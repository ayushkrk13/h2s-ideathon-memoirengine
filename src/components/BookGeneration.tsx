'use client';

import { useState, useEffect, useRef } from 'react';
import { DEMO_CHAPTERS, DEMO_MEMORIES, DEMO_SUBJECT } from '@/lib/demoData';
import { sleep } from '@/lib/utils';

type BuildStep = 'idle' | 'assembling' | 'chapters' | 'photos' | 'tree' | 'cover' | 'preview';

export default function BookGeneration() {
  const [step, setStep] = useState<BuildStep>('idle');
  const [progress, setProgress] = useState(0);
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

  const buildBook = async () => {
    setStep('assembling');
    setProgress(0);

    // Animated assembly steps
    for (let i = 0; i <= 25; i++) {
      setProgress(i);
      await sleep(40);
    }
    setStep('chapters');
    for (let i = 26; i <= 50; i++) {
      setProgress(i);
      await sleep(35);
    }
    setStep('photos');
    for (let i = 51; i <= 70; i++) {
      setProgress(i);
      await sleep(30);
    }
    setStep('tree');
    for (let i = 71; i <= 88; i++) {
      setProgress(i);
      await sleep(40);
    }
    setStep('cover');
    for (let i = 89; i <= 100; i++) {
      setProgress(i);
      await sleep(50);
    }
    setStep('preview');
  };

  const resetBook = () => {
    setStep('idle');
    setProgress(0);
  };

  const isBuilding = ['assembling', 'chapters', 'photos', 'tree', 'cover'].includes(step);

  const STEPS = [
    { key: 'assembling', label: 'Assembling memories' },
    { key: 'chapters', label: 'Organising chapters' },
    { key: 'photos', label: 'Placing photographs' },
    { key: 'tree', label: 'Drawing family tree' },
    { key: 'cover', label: 'Designing cover' },
  ];

  const currentStepIdx = STEPS.findIndex(s => s.key === step);

  return (
    <section
      ref={sectionRef}
      id="book"
      className="relative py-32 px-6"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="archival-label mb-6" style={{ letterSpacing: '0.25em' }}>
            THE FAMILY BOOK
          </div>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-primary"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
          >
            From conversations<br />
            <em className="text-gold not-italic">to a published legacy.</em>
          </h2>
          <p className="mt-6 text-secondary text-lg font-light mx-auto max-w-xl" style={{ fontFamily: 'var(--font-display)' }}>
            MemoirEngine assembles your archive into a complete family book — 
            chapters, photographs, timeline and family tree — ready to print or share.
          </p>
        </div>

        {/* Book generation area */}
        <div
          className={`transition-all duration-1000 delay-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
          {step === 'idle' && (
            <div className="flex flex-col items-center gap-10">
              {/* Book preview outline */}
              <div className="relative w-64">
                <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl" aria-hidden="true">
                  {/* Book spine */}
                  <rect x="0" y="10" width="20" height="240" rx="2" fill="var(--bg-surface)" stroke="var(--border-medium)" strokeWidth="1"/>
                  {/* Book cover */}
                  <rect x="20" y="0" width="180" height="260" rx="2" fill="var(--bg-elevated)" stroke="var(--border-medium)" strokeWidth="1"/>
                  {/* Cover top line */}
                  <line x1="40" y1="30" x2="180" y2="30" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.5"/>
                  <line x1="40" y1="32" x2="180" y2="32" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.3"/>
                  {/* Title placeholder */}
                  <rect x="40" y="60" width="120" height="3" rx="1" fill="var(--text-primary)" opacity="0.6"/>
                  <rect x="55" y="70" width="90" height="2" rx="1" fill="var(--text-primary)" opacity="0.4"/>
                  {/* Subtitle */}
                  <rect x="65" y="80" width="70" height="2" rx="1" fill="var(--accent-gold)" opacity="0.5"/>
                  {/* Family name */}
                  <text x="100" y="130" textAnchor="middle" fill="var(--accent-gold)" fontSize="18" fontFamily="var(--font-display)" fontStyle="italic" opacity="0.8">
                    Sharma
                  </text>
                  {/* Year range */}
                  <text x="100" y="150" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-body)" letterSpacing="0.15em">
                    1942 — 2024
                  </text>
                  {/* Bottom line */}
                  <line x1="40" y1="220" x2="180" y2="220" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.3"/>
                  <rect x="70" y="228" width="60" height="1.5" rx="0.5" fill="var(--text-muted)" opacity="0.3"/>
                </svg>
              </div>

              {/* Metadata */}
              <div className="text-center">
                <div className="archival-label mb-2">THE SHARMA STORY</div>
                <div className="text-muted text-sm">
                  {DEMO_CHAPTERS.length} chapters · {DEMO_MEMORIES.length} memories · 1942 — 2024
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={buildBook}
                className="group flex items-center gap-4 px-10 py-5 bg-[var(--bg-surface)] border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all duration-300"
                aria-label="Generate the family book"
              >
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="16" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="3" y="1" width="1.5" height="18" fill="currentColor" opacity="0.4"/>
                  <line x1="6" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
                  <line x1="6" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                  <line x1="6" y1="12" x2="11" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                </svg>
                <span className="text-[11px] tracking-[0.2em] uppercase font-medium">
                  Create Family Book
                </span>
              </button>
            </div>
          )}

          {/* Building state */}
          {isBuilding && (
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <div
                  className="font-display text-2xl text-primary animate-pulse"
                  style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
                >
                  Assembling your family&apos;s story...
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative mb-8">
                <div className="h-px w-full bg-[var(--border-medium)]" />
                <div
                  className="absolute top-0 left-0 h-px bg-gold transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-3">
                {STEPS.map((s, i) => {
                  const isDone = i < currentStepIdx;
                  const isActive = s.key === step;
                  return (
                    <div
                      key={s.key}
                      className={`flex items-center gap-4 transition-all duration-300 ${
                        isDone ? 'opacity-40' : isActive ? 'opacity-100' : 'opacity-20'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isDone ? 'border-gold bg-[rgba(201,168,76,0.15)]' : isActive ? 'border-gold' : 'border-[var(--border-medium)]'
                        }`}
                      >
                        {isDone && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                            <path d="M1 4l3 3 5-6" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" aria-hidden="true"/>
                        )}
                      </div>
                      <span className={`archival-label ${isActive ? 'text-gold' : ''}`}>
                        {s.label}
                      </span>
                      {isActive && (
                        <span className="archival-label text-muted ml-auto">{progress}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Preview state */}
          {step === 'preview' && (
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Book preview */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative group">
                  {/* Book shadow */}
                  <div
                    className="absolute -bottom-4 -right-4 w-full h-full opacity-20"
                    style={{ background: 'var(--accent-gold)', filter: 'blur(20px)' }}
                    aria-hidden="true"
                  />
                  <svg viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-60 relative group-hover:scale-[1.02] transition-transform duration-500" aria-hidden="true">
                    <rect x="0" y="12" width="24" height="296" rx="2" fill="#2a2420" stroke="var(--border-medium)" strokeWidth="1"/>
                    <rect x="24" y="0" width="216" height="320" rx="2" fill="#231f1a" stroke="var(--accent-gold-dim)" strokeWidth="1.5"/>
                    {/* Gold border inset */}
                    <rect x="32" y="12" width="200" height="296" rx="1" stroke="var(--accent-gold)" strokeWidth="0.5" strokeOpacity="0.4" fill="none"/>
                    {/* Top ornament */}
                    <line x1="65" y1="28" x2="216" y2="28" stroke="var(--accent-gold)" strokeWidth="0.8" opacity="0.6"/>
                    <line x1="65" y1="30" x2="216" y2="30" stroke="var(--accent-gold)" strokeWidth="0.4" opacity="0.3"/>
                    {/* Subtitle */}
                    <text x="140" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.2em">
                      A LIVING FAMILY ARCHIVE
                    </text>
                    {/* Main title */}
                    <text x="140" y="130" textAnchor="middle" fill="var(--text-primary)" fontSize="26" fontFamily="var(--font-display)" fontWeight="300" letterSpacing="-0.02em">
                      The
                    </text>
                    <text x="140" y="162" textAnchor="middle" fill="var(--accent-gold)" fontSize="36" fontFamily="var(--font-display)" fontWeight="600" letterSpacing="-0.02em">
                      Sharma
                    </text>
                    <text x="140" y="192" textAnchor="middle" fill="var(--text-primary)" fontSize="26" fontFamily="var(--font-display)" fontWeight="300" letterSpacing="-0.02em">
                      Story
                    </text>
                    {/* Year range */}
                    <text x="140" y="220" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-body)" letterSpacing="0.15em">
                      1942 — 2024
                    </text>
                    {/* Bottom ornament */}
                    <line x1="65" y1="280" x2="216" y2="280" stroke="var(--accent-gold)" strokeWidth="0.8" opacity="0.4"/>
                    {/* Publisher */}
                    <text x="140" y="300" textAnchor="middle" fill="var(--text-muted)" fontSize="6" fontFamily="var(--font-body)" letterSpacing="0.2em" opacity="0.5">
                      MEMOIRENGINE
                    </text>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="archival-label mb-2 text-gold">GENERATED</div>
                  <div className="text-muted text-xs">
                    {DEMO_CHAPTERS.length} chapters · {DEMO_MEMORIES.length} memories · 
                    {DEMO_CHAPTERS[0].yearStart} — {DEMO_CHAPTERS[DEMO_CHAPTERS.length - 1].yearEnd}
                  </div>
                </div>
              </div>

              {/* Table of contents */}
              <div>
                <div className="archival-label mb-8">TABLE OF CONTENTS</div>
                <div className="flex flex-col gap-0 border-t border-[var(--border-subtle)]">
                  {[
                    { title: 'Dedication', page: 2, type: 'front' },
                    { title: 'Foreword', page: 4, type: 'front' },
                    ...DEMO_CHAPTERS.map((ch, i) => ({ title: ch.title, page: 10 + i * 20, type: 'chapter', sub: ch.subtitle })),
                    { title: 'Photograph Album', page: 90, type: 'section' },
                    { title: 'Timeline', page: 110, type: 'section' },
                    { title: 'Family Tree', page: 124, type: 'section' },
                    { title: 'Epilogue', page: 132, type: 'front' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-baseline justify-between py-4 border-b border-[var(--border-subtle)] hover:bg-[rgba(201,168,76,0.03)] transition-colors duration-200 px-2"
                    >
                      <div>
                        <div
                          className={`text-sm ${item.type === 'chapter' ? 'text-primary font-medium' : 'text-secondary'}`}
                          style={{ fontFamily: item.type === 'chapter' ? 'var(--font-display)' : undefined }}
                        >
                          {item.title}
                        </div>
                        {'sub' in item && item.sub && (
                          <div className="archival-label mt-0.5">{item.sub}</div>
                        )}
                      </div>
                      <div className="archival-label ml-4 flex-shrink-0">{item.page}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex gap-4">
                  <button className="flex-1 py-4 border border-[var(--accent-gold)] text-[var(--accent-gold)] text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all duration-300">
                    Download PDF
                  </button>
                  <button
                    onClick={resetBook}
                    className="px-6 py-4 border border-[var(--border-medium)] text-secondary text-[11px] tracking-[0.15em] uppercase font-medium hover:border-[var(--accent-gold-dim)] hover:text-primary transition-all duration-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
