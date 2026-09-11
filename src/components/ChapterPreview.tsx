'use client';

import { useState, useEffect, useRef } from 'react';
import { DEMO_CHAPTERS, DEMO_MEMORIES } from '@/lib/demoData';

export default function ChapterPreview() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const chapter = DEMO_CHAPTERS[activeChapter];
  const chapterMemories = DEMO_MEMORIES.filter(m => chapter.memoriesIds.includes(m.id));

  return (
    <section
      ref={sectionRef}
      id="chapters"
      className="relative py-32 px-6"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Right vertical rule */}
      <div
        className="absolute right-12 top-0 bottom-0 w-px hidden lg:block"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--border-subtle), transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div
          className={`mb-20 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="archival-label mb-6" style={{ letterSpacing: '0.25em' }}>
            CHAPTERS
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-light text-primary"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
          >
            Stories become{' '}
            <em className="text-gold not-italic">literature.</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-16">
          {/* Chapter list */}
          <div
            className={`flex flex-col gap-0 border-r border-[var(--border-subtle)] transition-all duration-1000 delay-100 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {DEMO_CHAPTERS.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(i)}
                className={`text-left pr-8 py-6 border-b border-[var(--border-subtle)] transition-all duration-300 group ${
                  activeChapter === i ? 'border-l-2 border-gold pl-6 -ml-px' : 'pl-0 hover:pl-2'
                }`}
                aria-pressed={activeChapter === i}
              >
                <div className="archival-label mb-2" style={{ color: activeChapter === i ? 'var(--accent-gold)' : undefined }}>
                  {ch.yearStart} — {ch.yearEnd}
                </div>
                <div
                  className={`font-display text-lg font-medium transition-colors duration-300 ${
                    activeChapter === i ? 'text-primary' : 'text-secondary group-hover:text-primary'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {ch.title}
                </div>
                <div className="mt-1 text-muted text-xs">{ch.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Chapter reader */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Chapter header */}
            <div className="pb-10 border-b border-[var(--border-subtle)] mb-10">
              <div className="archival-label mb-4">{chapter.subtitle}</div>
              <h3
                className="font-display text-4xl md:text-5xl font-light text-primary leading-[1.15]"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
              >
                {chapter.title}
              </h3>
              <div className="mt-4 flex items-center gap-6 text-sm text-muted">
                <span>{chapter.location}</span>
                <span>·</span>
                <span>{chapterMemories.length} memories</span>
              </div>
            </div>

            {/* Chapter prose */}
            <div className="memoir-prose">
              {chapter.prose.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  className={i === 0 ? 'drop-cap' : ''}
                  style={{ marginTop: i > 0 ? '1.5em' : 0 }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Source memories */}
            <div className="mt-16">
              <div className="archival-label mb-6">SOURCE MEMORIES</div>
              <div className="flex flex-col gap-4">
                {chapterMemories.map(mem => (
                  <div
                    key={mem.id}
                    className="p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold-dim)] transition-colors duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="archival-label mb-1">{mem.year} · {mem.location}</div>
                        <div
                          className="text-primary text-base font-medium"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {mem.title}
                        </div>
                      </div>
                      <button
                        className="flex-shrink-0 archival-label text-muted hover:text-gold transition-colors duration-300 text-xs"
                        aria-label={`Show source for ${mem.title}`}
                      >
                        SHOW SOURCE
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {mem.people.slice(0, 3).map(p => (
                        <span key={p} className="entity-chip entity-person">{p}</span>
                      ))}
                      {mem.objects.slice(0, 2).map(o => (
                        <span key={o} className="entity-chip entity-object">{o}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
