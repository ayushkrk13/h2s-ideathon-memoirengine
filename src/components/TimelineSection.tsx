'use client';

import { useEffect, useRef, useState } from 'react';
import { DEMO_TIMELINE } from '@/lib/demoData';

const TYPE_COLORS = {
  childhood: 'var(--text-secondary)',
  education: 'var(--accent-green-bright)',
  career: 'var(--accent-gold)',
  family: '#c87c6a',
  migration: 'var(--text-secondary)',
  milestone: 'var(--accent-gold)',
};

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="timeline"
      className="relative py-32 px-6"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className={`mb-20 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="archival-label mb-6" style={{ letterSpacing: '0.25em' }}>
            THE ARCHIVE
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-light text-primary"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
          >
            A life, in{' '}
            <em className="text-gold not-italic">sequence.</em>
          </h2>
        </div>

        {/* Timeline */}
        <div ref={sectionRef} className="relative">
          {/* Central vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block"
            style={{
              background: 'linear-gradient(to bottom, transparent, var(--border-medium) 5%, var(--border-medium) 95%, transparent)',
              transform: 'translateX(-50%)',
            }}
            aria-hidden="true"
          />

          {/* Timeline events */}
          <div className="flex flex-col gap-0">
            {DEMO_TIMELINE.map((event, i) => {
              const isLeft = i % 2 === 0;
              const isMajor = event.significance === 'defining';
              const isActive = activeIndex === i;

              return (
                <div
                  key={event.id}
                  className={`relative grid lg:grid-cols-2 gap-0 transition-all duration-700 ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {/* Left content */}
                  <div
                    className={`lg:pr-16 pb-12 ${isLeft ? 'lg:text-right' : 'hidden lg:block'}`}
                  >
                    {isLeft && (
                      <TimelineEntry
                        event={event}
                        isMajor={isMajor}
                        isActive={isActive}
                        align="right"
                        onClick={() => setActiveIndex(isActive ? null : i)}
                      />
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-0 items-center justify-center z-10">
                    <button
                      onClick={() => setActiveIndex(isActive ? null : i)}
                      className={`rounded-full border-2 border-[var(--bg-secondary)] transition-all duration-300 ${
                        isMajor ? 'w-5 h-5' : 'w-3 h-3'
                      } ${isActive ? 'scale-150' : 'hover:scale-125'}`}
                      style={{
                        background: isActive ? 'var(--accent-gold)' : TYPE_COLORS[event.type] || 'var(--border-medium)',
                        boxShadow: isActive ? '0 0 0 3px rgba(201,168,76,0.2), 0 0 12px rgba(201,168,76,0.4)' : 'none',
                      }}
                      aria-label={`${event.year}: ${event.title}`}
                    />
                  </div>

                  {/* Right content */}
                  <div className={`lg:pl-16 pb-12 ${!isLeft ? '' : 'hidden lg:block'}`}>
                    {/* Mobile: show all on right */}
                    <div className="lg:hidden">
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-1 rounded-full flex-shrink-0 ${isMajor ? 'w-4 h-4' : 'w-2.5 h-2.5'}`}
                          style={{ background: TYPE_COLORS[event.type] || 'var(--border-medium)' }}
                        />
                        <TimelineEntry
                          event={event}
                          isMajor={isMajor}
                          isActive={isActive}
                          align="left"
                          onClick={() => setActiveIndex(isActive ? null : i)}
                        />
                      </div>
                    </div>
                    {/* Desktop: only right-aligned events */}
                    {!isLeft && (
                      <TimelineEntry
                        event={event}
                        isMajor={isMajor}
                        isActive={isActive}
                        align="left"
                        onClick={() => setActiveIndex(isActive ? null : i)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({
  event,
  isMajor,
  isActive,
  align,
  onClick,
}: {
  event: (typeof DEMO_TIMELINE)[0];
  isMajor: boolean;
  isActive: boolean;
  align: 'left' | 'right';
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-${align} w-full hover:opacity-80 transition-opacity duration-200 group`}
      aria-expanded={isActive}
    >
      {/* Year */}
      <div
        className={`${isMajor ? 'text-3xl' : 'text-xl'} font-display font-light transition-colors duration-300 ${
          isActive ? 'text-gold' : 'text-muted group-hover:text-secondary'
        }`}
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
      >
        {event.year}
      </div>

      {/* Title */}
      <div
        className={`mt-1 text-sm font-medium transition-colors duration-300 ${
          isActive ? 'text-primary' : 'text-secondary group-hover:text-primary'
        }`}
      >
        {event.title}
      </div>

      {/* Description (expanded) */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isActive ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-muted text-xs leading-[1.7]" style={{ fontFamily: 'var(--font-display)' }}>
          {event.description}
        </p>
        {event.memoryId && (
          <a
            href="#wow-sequence"
            className="mt-2 inline-block archival-label text-gold hover:underline"
            onClick={e => e.stopPropagation()}
          >
            VIEW MEMORY →
          </a>
        )}
      </div>
    </button>
  );
}
