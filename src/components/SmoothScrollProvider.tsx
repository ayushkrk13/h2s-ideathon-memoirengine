'use client';

import { useEffect, useRef } from 'react';

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let lenis: any;
    
    const initLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
        lenisRef.current = lenis;

        const raf = (time: number) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      } catch (e) {
        // Lenis failed, use native scroll
      }
    };

    // Only init on desktop / non-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      initLenis();
    }

    return () => {
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
