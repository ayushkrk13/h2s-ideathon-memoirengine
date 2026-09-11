'use client';

import { useEffect, useRef } from 'react';

export default function ProblemStatement() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
              (el as HTMLElement).style.transitionDelay = `${i * 150}ms`;
              el.classList.add('section-visible');
              el.classList.remove('section-enter');
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '80%', label: 'of family stories are lost within one generation' },
    { value: '3 hrs', label: 'average time before an elderly voice becomes irreplaceable' },
    { value: '2026', label: 'the year you can change that' },
  ];

  return (
    <section
      ref={sectionRef}
      id="problem"
      className="relative py-40 px-6"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Left vertical rule */}
      <div
        className="absolute left-12 top-0 bottom-0 w-px hidden lg:block"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--border-subtle), transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto">
        {/* Label */}
        <div
          data-reveal
          className="section-enter archival-label mb-16"
          style={{ letterSpacing: '0.25em' }}
        >
          THE PROBLEM
        </div>

        {/* Large statement */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-start">
          <div>
            <h2
              data-reveal
              className="section-enter font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-primary leading-[1.15]"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
            >
              Every family has stories.
              <br />
              <em className="text-secondary not-italic">Most of them exist only</em>
              <br />
              in someone&apos;s memory.
            </h2>

            <div
              data-reveal
              className="section-enter mt-10 w-10 h-px bg-gold"
            />

            <p
              data-reveal
              className="section-enter mt-8 text-secondary text-lg font-light max-w-xl leading-[1.8]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              When that person is gone, the stories go with them. Not because nobody cared — 
              but because nobody asked in time, or didn&apos;t know how to begin.
            </p>

            <p
              data-reveal
              className="section-enter mt-6 text-secondary text-lg font-light max-w-xl leading-[1.8]"
              style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
            >
              MemoirEngine gives you a way to begin.
            </p>
          </div>

          {/* Stats column */}
          <div className="flex flex-col gap-10 lg:w-72">
            {stats.map((s, i) => (
              <div
                key={s.label}
                data-reveal
                className="section-enter border-l-2 border-gold pl-6"
              >
                <div
                  className="font-display text-5xl font-light text-gold"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
                >
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-muted leading-[1.6] max-w-[180px]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The transformation */}
        <div className="mt-32">
          <div
            data-reveal
            className="section-enter archival-label mb-12 text-center"
            style={{ letterSpacing: '0.25em' }}
          >
            THE TRANSFORMATION
          </div>

          <div
            data-reveal
            className="section-enter flex flex-wrap items-center justify-center gap-0"
          >
            {[
              { word: 'VOICE', color: 'text-gold' },
              null,
              { word: 'WORDS', color: 'text-primary' },
              null,
              { word: 'MEMORY', color: 'text-primary' },
              null,
              { word: 'CONNECTION', color: 'text-primary' },
              null,
              { word: 'STORY', color: 'text-primary' },
              null,
              { word: 'LEGACY', color: 'text-forest' },
            ].map((item, i) =>
              item === null ? (
                <div key={`arrow-${i}`} className="flex items-center mx-4 text-muted">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ) : (
                <div
                  key={item.word}
                  className={`text-[11px] tracking-[0.2em] font-medium ${item.color}`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.word}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
