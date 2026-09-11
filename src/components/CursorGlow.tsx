'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = -300, my = -300;
    let rx = -300, ry = -300;
    let tx = -300, ty = -300;
    let rafId: number;
    let isHovering = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onEnterInteractive = () => { isHovering = true; };
    const onLeaveInteractive = () => { isHovering = false; };

    window.addEventListener('mousemove', onMove, { passive: true });

    const addListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label').forEach(el => {
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
    };
    addListeners();
    const reQueryInterval = setInterval(addListeners, 2000);

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      const rLerp = 0.15;
      rx += (mx - rx) * rLerp;
      ry += (my - ry) * rLerp;

      const tLerp = 0.08;
      tx += (mx - tx) * tLerp;
      ty += (my - ty) * tLerp;

      if (dotRef.current) {
        dotRef.current.style.left  = `${mx}px`;
        dotRef.current.style.top   = `${my}px`;
        dotRef.current.style.transform = `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`;
        dotRef.current.style.background = isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(217,119,6,0.9)';
        dotRef.current.style.boxShadow = isHovering 
          ? '0 0 15px 5px rgba(255,255,255,0.6), 0 0 5px 2px rgba(255,255,255,0.8)' 
          : '0 0 10px 4px rgba(217,119,6,0.6), 0 0 3px 1px rgba(255,255,255,0.5)';
      }

      if (ringRef.current) {
        ringRef.current.style.left  = `${rx}px`;
        ringRef.current.style.top   = `${ry}px`;
        ringRef.current.style.transform = `translate(-50%, -50%) scale(${isHovering ? 2.0 : 1})`;
        ringRef.current.style.opacity = isHovering ? '1' : '0.7';
        ringRef.current.style.borderColor = isHovering ? 'rgba(255,255,255,0.7)' : 'rgba(217,119,6,0.65)';
      }

      if (trailRef.current) {
        trailRef.current.style.left  = `${tx}px`;
        trailRef.current.style.top   = `${ty}px`;
        trailRef.current.style.transform = `translate(-50%, -50%) scale(${isHovering ? 1.4 : 1})`;
        trailRef.current.style.opacity = isHovering ? '1' : '0.8';
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(reQueryInterval);
      window.removeEventListener('mousemove', onMove);
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label').forEach(el => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={trailRef}
        className="hidden lg:block pointer-events-none"
        aria-hidden="true"
        style={{
          position: 'fixed',
          width: 450,
          height: 450,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, rgba(245,158,11,0.06) 40%, transparent 70%)',
          zIndex: 9996,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          willChange: 'left, top',
        }}
      />
      <div
        ref={ringRef}
        className="hidden lg:block pointer-events-none"
        aria-hidden="true"
        style={{
          position: 'fixed',
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '1.5px solid rgba(217,119,6,0.65)',
          background: 'transparent',
          zIndex: 9997,
          transition: 'transform 0.15s ease, opacity 0.2s ease, border-color 0.2s ease',
          willChange: 'left, top, transform',
        }}
      />
      <div
        ref={dotRef}
        className="hidden lg:block pointer-events-none"
        aria-hidden="true"
        style={{
          position: 'fixed',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'rgba(217,119,6,0.9)',
          boxShadow: '0 0 10px 4px rgba(217,119,6,0.6), 0 0 3px 1px rgba(255,255,255,0.5)',
          zIndex: 9998,
          transition: 'transform 0.12s ease, background 0.2s ease, box-shadow 0.2s ease',
          willChange: 'left, top, transform',
        }}
      />
    </>
  );
}
