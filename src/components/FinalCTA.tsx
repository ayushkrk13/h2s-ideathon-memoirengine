'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

export default function FinalCTA() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="cta"
      className="relative py-40 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, #fdf3e3 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at center 70%, rgba(217,119,6,0.08) 0%, transparent 60%)' }} />

      <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
        {/* Ornament */}
        <div className="flex items-center justify-center gap-4 mb-16" aria-hidden="true">
          <div className="h-px flex-1 max-w-24" style={{ background: 'var(--border-medium)' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-amber)' }} />
          <div className="h-px flex-1 max-w-24" style={{ background: 'var(--border-medium)' }} />
        </div>

        <h2
          className="font-display text-4xl md:text-6xl font-light text-primary leading-[1.15]"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
        >
          Whose story will you<br />
          <em className="not-italic" style={{ color: 'var(--accent-amber)' }}>preserve?</em>
        </h2>

        <p className={`mt-8 text-secondary text-xl font-light transition-all duration-1000 delay-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', lineHeight: 1.8 }}>
          Some stories only exist in someone&apos;s voice.<br />They don&apos;t have to disappear.
        </p>

        <div className={`mt-14 transition-all duration-1000 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link href="/login" className="btn-primary text-sm py-4 px-12 inline-flex">
            Begin a Memory
            <svg className="w-5 h-5" fill="none" viewBox="0 0 18 18" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 9h10M10 5l4 4-4 4" />
            </svg>
          </Link>
        </div>

        <div className={`mt-16 flex flex-col gap-2 transition-all duration-1000 delay-600 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          {['Preserve the voice.', 'Preserve the story.', 'Preserve the person.'].map(line => (
            <p key={line} className="text-muted text-base" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{line}</p>
          ))}
        </div>
      </div>

      <footer className="mt-24 border-t border-[var(--border-subtle)] pt-10 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full" style={{ background: 'var(--accent-amber-bg)', border: '1px solid var(--accent-amber)' }} aria-hidden="true" />
          <span className="label font-semibold text-primary">MEMOIRENGINE</span>
        </div>
        <p className="text-muted text-xs">A living archive of human memory.</p>
        <nav className="mt-5 flex flex-wrap justify-center gap-5" aria-label="Footer">
          {[['Explore', '/explore'], ['Archive', '/archive'], ['Interview', '/interview'], ['Login', '/login'], ['Demo', '/demo']].map(([l, h]) => (
            <Link key={l} href={h} className="label hover:text-amber transition-colors duration-200">{l}</Link>
          ))}
        </nav>
      </footer>
    </section>
  );
}
