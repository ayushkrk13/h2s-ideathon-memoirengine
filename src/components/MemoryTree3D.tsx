'use client';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function MemoryTree3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.clientWidth || window.innerWidth;
    const H = el.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    // Subtle warm fog for depth
    scene.fog = new THREE.FogExp2(0xfdf8f0, 0.045);

    const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 80);
    camera.position.set(0, 1.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Materials ──────────────────────────────────────────────────────────────

    // Main branches — warm amber, additive for glow
    const branchMat = new THREE.LineBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.55,
    });
    // Secondary branches — lighter
    const dimMat = new THREE.LineBasicMaterial({
      color: 0xe8a535,
      transparent: true,
      opacity: 0.25,
    });
    // Fine twigs
    const twigMat = new THREE.LineBasicMaterial({
      color: 0xf0c060,
      transparent: true,
      opacity: 0.14,
    });

    // Memory nodes — large glowing points (additive blending for bloom feel)
    const nodeMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.22,
      transparent: true,
      opacity: 0.0,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Inner bright node core
    const nodeCoreMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.0,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Ambient floating particles
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.055,
      transparent: true,
      opacity: 0.0,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Slower, bigger atmospheric dust
    const dustMat = new THREE.PointsMaterial({
      color: 0xd97706,
      size: 0.09,
      transparent: true,
      opacity: 0.0,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // ── Tree geometry ──────────────────────────────────────────────────────────

    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Trunk — slightly curved, organic
    const trunkPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      trunkPoints.push(new THREE.Vector3(
        Math.sin(t * 2.8) * 0.18,
        -3.2 + t * 6.8,
        Math.cos(t * 1.8) * 0.12
      ));
    }
    treeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(trunkPoints), branchMat));

    // ── Branch builder helper ──────────────────────────────────────────────────
    const nodePositions: THREE.Vector3[] = [];

    const addBranch = (
      from: THREE.Vector3,
      dir: THREE.Vector3,
      length: number,
      mat: THREE.LineBasicMaterial,
      depth: number
    ): THREE.Vector3 => {
      const pts: THREE.Vector3[] = [];
      const steps = depth > 0 ? 14 : 10;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const p = from.clone().add(dir.clone().normalize().multiplyScalar(t * length));
        p.x += Math.sin(t * 5 + dir.x * 8) * 0.07 * length;
        p.z += Math.cos(t * 4 + dir.z * 7) * 0.05 * length;
        pts.push(p);
      }
      treeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
      const tip = pts[pts.length - 1].clone();
      nodePositions.push(tip);

      // Recurse sub-branches at depth 0
      if (depth > 0) {
        for (let s = 0; s < 4; s++) {
          const origin = pts[Math.floor((s + 1) / 5 * steps)].clone();
          const subDir = new THREE.Vector3(
            dir.x + (Math.random() - 0.5) * 1.2,
            dir.y + Math.random() * 0.5 + 0.2,
            dir.z + (Math.random() - 0.5) * 0.7
          ).normalize();
          addBranch(origin, subDir, length * 0.45, depth === 1 ? dimMat : twigMat, depth - 1);
        }
      }
      return tip;
    };

    // Primary branches
    const branchConfigs = [
      { t: 0.28, dir: new THREE.Vector3(-1.4, 0.7, 0.35), len: 2.4 },
      { t: 0.42, dir: new THREE.Vector3(-1.6, 1.1, -0.25), len: 2.6 },
      { t: 0.58, dir: new THREE.Vector3(-1.1, 1.4, 0.45), len: 2.1 },
      { t: 0.72, dir: new THREE.Vector3(-0.7, 1.8, 0.15), len: 1.7 },
      { t: 0.32, dir: new THREE.Vector3(1.3, 0.8, -0.3), len: 2.3 },
      { t: 0.48, dir: new THREE.Vector3(1.5, 1.2, 0.2), len: 2.5 },
      { t: 0.64, dir: new THREE.Vector3(1.2, 1.5, -0.4), len: 2.0 },
      { t: 0.78, dir: new THREE.Vector3(0.8, 1.9, 0.3), len: 1.6 },
      { t: 0.88, dir: new THREE.Vector3(-0.4, 2.2, 0.1), len: 1.4 },
      { t: 0.93, dir: new THREE.Vector3(0.5, 2.3, -0.2), len: 1.3 },
    ];

    branchConfigs.forEach(({ t, dir, len }) => {
      const from = trunkPoints[Math.floor(t * 28)].clone();
      addBranch(from, dir, len, t < 0.55 ? branchMat : dimMat, 1);
    });

    // Leaf-tip particles — cluster around node tips
    const leafCount = nodePositions.length * 8;
    const leafPos = new Float32Array(leafCount * 3);
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = 0; j < 8; j++) {
        const idx = (i * 8 + j) * 3;
        const spread = 0.35;
        leafPos[idx]     = nodePositions[i].x + (Math.random() - 0.5) * spread;
        leafPos[idx + 1] = nodePositions[i].y + (Math.random() - 0.5) * spread;
        leafPos[idx + 2] = nodePositions[i].z + (Math.random() - 0.5) * spread;
      }
    }
    const leafGeo = new THREE.BufferGeometry();
    leafGeo.setAttribute('position', new THREE.BufferAttribute(leafPos, 3));
    treeGroup.add(new THREE.Points(leafGeo, nodeMat));

    // Node cores — bright center sparks
    const nodePosArr = new Float32Array(nodePositions.flatMap(p => [p.x, p.y, p.z]));
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
    treeGroup.add(new THREE.Points(nodeGeo, nodeMat));
    treeGroup.add(new THREE.Points(nodeGeo, nodeCoreMat));

    // Roots
    [
      new THREE.Vector3(-1.3, -1.1, 0.3),
      new THREE.Vector3(1.2, -1.3, -0.25),
      new THREE.Vector3(0.4, -1.6, 0.5),
      new THREE.Vector3(-0.9, -1.4, -0.45),
      new THREE.Vector3(1.5, -0.9, 0.4),
      new THREE.Vector3(-0.3, -1.8, 0.1),
    ].forEach(dir => {
      const rp: THREE.Vector3[] = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const p = new THREE.Vector3(0, -3.2, 0).add(dir.clone().normalize().multiplyScalar(t * 2.8));
        p.x += Math.sin(t * 6 + dir.x) * 0.09;
        rp.push(p);
      }
      treeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rp), dimMat));
    });

    // ── Particles ──────────────────────────────────────────────────────────────

    // Floating memory particles — two layers
    const pCount = 280;
    const pPos = new Float32Array(pCount * 3);
    const pVel = new Float32Array(pCount * 3); // y velocity
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 18;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      pVel[i * 3 + 1] = 0.001 + Math.random() * 0.003;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, particleMat));

    // Atmospheric dust
    const dCount = 120;
    const dPos = new Float32Array(dCount * 3);
    for (let i = 0; i < dCount; i++) {
      dPos[i * 3]     = (Math.random() - 0.5) * 22;
      dPos[i * 3 + 1] = (Math.random()) * 16 - 4;
      dPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    scene.add(new THREE.Points(dGeo, dustMat));

    // ── Mouse interaction ──────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / W - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / H - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Animation loop ─────────────────────────────────────────────────────────
    let t = 0;
    let opacity = 0;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.004;

      // Fade-in on mount
      if (opacity < 1) {
        opacity = Math.min(1, opacity + 0.008);
        branchMat.opacity  = 0.55 * opacity;
        dimMat.opacity     = 0.25 * opacity;
        twigMat.opacity    = 0.14 * opacity;
        nodeMat.opacity    = 0.82 * opacity;
        nodeCoreMat.opacity = 0.65 * opacity;
        particleMat.opacity = 0.38 * opacity;
        dustMat.opacity    = 0.18 * opacity;
      }

      // Tree sways gently, follows mouse
      treeGroup.rotation.y = THREE.MathUtils.lerp(treeGroup.rotation.y, mouseRef.current.x * 0.12, 0.025);
      treeGroup.rotation.x = THREE.MathUtils.lerp(treeGroup.rotation.x, mouseRef.current.y * 0.06, 0.025);
      treeGroup.rotation.z = Math.sin(t * 0.25) * 0.015;

      // Breathe: subtle scale pulse on nodes
      const pulse = 1 + Math.sin(t * 1.8) * 0.06;
      nodeMat.size = 0.22 * pulse;
      nodeCoreMat.size = 0.08 * pulse;

      // Drift particles upward, recycle
      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        pos[i * 3 + 1] += pVel[i * 3 + 1];
        // Subtle x drift
        pos[i * 3] += Math.sin(t + i * 0.3) * 0.0006;
        if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = -7;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Drift dust slowly
      const dp = dGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dCount; i++) {
        dp[i * 3 + 1] += 0.0007;
        dp[i * 3]     += Math.sin(t * 0.4 + i * 0.7) * 0.0005;
        if (dp[i * 3 + 1] > 12) dp[i * 3 + 1] = -4;
      }
      dGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" aria-hidden="true" />;
}
