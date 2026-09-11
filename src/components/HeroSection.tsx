'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const MemoryTree3D = dynamic(() => import('@/components/MemoryTree3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-2 h-2 rounded-full animate-pulse-amber" style={{ background: 'var(--accent-amber)' }} />
    </div>
  ),
});

export default function HeroSection() {
  const [phase, setPhase] = useState(0);
  const [headline1, setHeadline1] = useState(false);
  const [headline2, setHeadline2] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setLabelVisible(true), 900);
    const t3 = setTimeout(() => setHeadline1(true), 1600);
    const t4 = setTimeout(() => setHeadline2(true), 2700);
    const t5 = setTimeout(() => setCtaVisible(true), 3700);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #fdf3e3 0%, #fdf8f0 50%, #f5ede0 100%)' }}
      aria-label="MemoirEngine — Living Archive of Human Memory"
    >
      {/* Decorative warm circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #fde68a 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #fed7aa 0%, transparent 70%)' }} />
      </div>

      {/* 3D Memory Tree — right side on desktop */}
      <div
        className="absolute right-0 top-0 bottom-0 w-full lg:w-[52%] z-0 opacity-70"
        aria-hidden="true"
      >
        {phase >= 1 && <MemoryTree3D />}
      </div>

      {/* Content — left aligned on desktop */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col items-start">
        {/* Label */}
        <div
          className={`transition-all duration-700 mb-8 ${labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        >
          <span className="badge badge-amber text-xs">A LIVING FAMILY ARCHIVE</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
          <span
            className={`block text-4xl md:text-6xl lg:text-7xl font-light text-primary leading-[1.1] transition-all duration-1000 ${headline1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            Some stories only
          </span>
          <span
            className={`block text-4xl md:text-6xl lg:text-7xl font-light text-primary leading-[1.1] transition-all duration-1000 delay-100 ${headline1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            exist in someone&apos;s{' '}
            <em className="not-italic" style={{ color: 'var(--accent-amber)' }}>voice.</em>
          </span>
        </h1>

        <p
          className={`mt-6 text-xl text-secondary font-light max-w-md leading-[1.7] transition-all duration-1000 delay-200 ${headline2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
        >
          Let&apos;s make sure they are remembered.
        </p>

        {/* CTAs */}
        <div className={`mt-10 flex flex-wrap gap-3 transition-all duration-1000 delay-300 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link href="/login" className="btn-primary text-sm py-3 px-7">
            Begin a Memory
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <Link href="/explore" className="btn-secondary text-sm py-3 px-6">
            Browse Public Families
          </Link>
        </div>

        {/* Social proof */}
        <div className={`mt-12 transition-all duration-1000 delay-500 ${ctaVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['M', 'R', 'P', 'S'].map((l, i) => (
                <div key={i} className="avatar w-8 h-8 text-xs border-2 border-white" style={{ zIndex: 4 - i }}>{l}</div>
              ))}
            </div>
            <p className="text-secondary text-sm">
              <strong className="font-semibold text-primary">2,400+ families</strong> already preserving their stories
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${ctaVisible ? 'opacity-50' : 'opacity-0'}`} aria-hidden="true">
        <div className="w-px h-10 bg-[var(--border-medium)] relative overflow-hidden">
          <div className="absolute top-0 w-full h-3 animate-float" style={{ background: 'var(--accent-amber)' }} />
        </div>
        <span className="label text-[9px]">SCROLL</span>
      </div>
    </section>
  );
}
