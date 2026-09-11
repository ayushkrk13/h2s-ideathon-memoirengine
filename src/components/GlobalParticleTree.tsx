'use client';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function GlobalParticleTree() {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.035);

    // Camera positioned to view the tree as a subtle background element
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 80);
    camera.position.set(2, 0.5, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // lower pixel ratio for perf
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Materials (Subdued for background watermark) ──
    const branchMat = new THREE.LineBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.15,
    });
    const dimMat = new THREE.LineBasicMaterial({
      color: 0xe8a535,
      transparent: true,
      opacity: 0.08,
    });
    const twigMat = new THREE.LineBasicMaterial({
      color: 0xf0c060,
      transparent: true,
      opacity: 0.04,
    });

    const nodeMat = new THREE.PointsMaterial({
      color: 0xa36605, // darker amber
      size: 0.15,
      transparent: true,
      opacity: 0.12,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleMat = new THREE.PointsMaterial({
      color: 0x784f00, // much darker brown/amber for shattered look
      size: 0.04,
      transparent: true,
      opacity: 0.06,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const treeGroup = new THREE.Group();
    // Shift tree slightly to the right to act as a watermark
    treeGroup.position.set(3, -1.5, 0);
    scene.add(treeGroup);

    // Trunk
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

    const nodePositions: THREE.Vector3[] = [];

    const addBranch = (
      from: THREE.Vector3,
      dir: THREE.Vector3,
      length: number,
      mat: THREE.LineBasicMaterial,
      depth: number
    ): THREE.Vector3 => {
      const pts: THREE.Vector3[] = [];
      const steps = depth > 0 ? 12 : 8;
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

      if (depth > 0) {
        for (let s = 0; s < 3; s++) { // Reduced sub-branches
          const origin = pts[Math.floor((s + 1) / 4 * steps)].clone();
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

    const branchConfigs = [
      { t: 0.28, dir: new THREE.Vector3(-1.4, 0.7, 0.35), len: 2.4 },
      { t: 0.42, dir: new THREE.Vector3(-1.6, 1.1, -0.25), len: 2.6 },
      { t: 0.58, dir: new THREE.Vector3(-1.1, 1.4, 0.45), len: 2.1 },
      { t: 0.32, dir: new THREE.Vector3(1.3, 0.8, -0.3), len: 2.3 },
      { t: 0.48, dir: new THREE.Vector3(1.5, 1.2, 0.2), len: 2.5 },
      { t: 0.64, dir: new THREE.Vector3(1.2, 1.5, -0.4), len: 2.0 },
      { t: 0.88, dir: new THREE.Vector3(-0.4, 2.2, 0.1), len: 1.4 },
    ];

    branchConfigs.forEach(({ t, dir, len }) => {
      const from = trunkPoints[Math.floor(t * 28)].clone();
      addBranch(from, dir, len, t < 0.55 ? branchMat : dimMat, 1);
    });

    const nodePosArr = new Float32Array(nodePositions.flatMap(p => [p.x, p.y, p.z]));
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
    treeGroup.add(new THREE.Points(nodeGeo, nodeMat));

    // Floating background particles
    const pCount = 150;
    const pPos = new Float32Array(pCount * 3);
    const pVel = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      pVel[i * 3 + 1] = 0.0005 + Math.random() * 0.002;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pSystem = new THREE.Points(pGeo, particleMat);
    scene.add(pSystem);

    let t = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.002;

      treeGroup.rotation.y = Math.sin(t * 0.5) * 0.1;
      treeGroup.rotation.z = Math.cos(t * 0.3) * 0.02;

      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        pos[i * 3 + 1] += pVel[i * 3 + 1];
        pos[i * 3] += Math.sin(t + i * 0.3) * 0.0004;
        if (pos[i * 3 + 1] > 8) pos[i * 3 + 1] = -8;
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-[-1] opacity-60 mix-blend-screen"
      aria-hidden="true"
    />
  );
}
