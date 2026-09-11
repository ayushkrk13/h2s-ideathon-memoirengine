'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useFamilyStore } from '@/lib/store';
import { sleep } from '@/lib/utils';

type BuildStep = 'idle' | 'assembling' | 'chapters' | 'photos' | 'tree' | 'cover' | 'preview';

const BUILD_STEPS = [
  { key: 'assembling', label: 'Assembling memories', icon: '◇' },
  { key: 'chapters', label: 'Organising chapters', icon: '≡' },
  { key: 'photos', label: 'Placing photographs', icon: '□' },
  { key: 'tree', label: 'Drawing family tree', icon: '○' },
  { key: 'cover', label: 'Designing cover', icon: '◻' },
] as const;

export default function BookPage() {
  const params = useParams();
  const familyId = params.id as string;

  const [step, setStep] = useState<BuildStep>('idle');
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'cover' | 'toc' | 'chapter'>('cover');
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

  // Raw store values — no inline derived arrays (prevents infinite loop)
  const families = useFamilyStore(s => s.families);
  const memories = useFamilyStore(s => s.memories);
  const members = useFamilyStore(s => s.members);
  const chapters = useFamilyStore(s => s.chapters);
  const timelineEvents = useFamilyStore(s => s.timeline);

  // Derive data with useMemo
  const family = useMemo(() => families.find(f => f.id === familyId), [families, familyId]);

  const familyMemories = useMemo(
    () => memories.filter(m => m.familyId === familyId).sort((a, b) => (a.year ?? 0) - (b.year ?? 0)),
    [memories, familyId]
  );

  const familyMembers = useMemo(
    () => members.filter(m => m.familyId === familyId),
    [members, familyId]
  );

  const familyChapters = useMemo(
    () => chapters.filter(c => c.familyId === familyId),
    [chapters, familyId]
  );

  const familyTimeline = useMemo(
    () => timelineEvents.filter(e => e.familyId === familyId).sort((a, b) => a.year - b.year),
    [timelineEvents, familyId]
  );

  const photosCount = useMemo(
    () => familyMemories.reduce((acc, m) => acc + m.photoUrls.length, 0),
    [familyMemories]
  );

  const yearRange = useMemo(() => {
    const years = familyMemories.map(m => m.year).filter(Boolean) as number[];
    if (!years.length) return '—';
    return `${Math.min(...years)} — ${Math.max(...years)}`;
  }, [familyMemories]);

  const chapterPreviews = useMemo(() => {
    if (familyChapters.length > 0) return familyChapters;
    // Auto-generate preview chapters from memories if none exist
    if (familyMemories.length === 0) return [];
    const sorted = [...familyMemories];
    const third = Math.ceil(sorted.length / 3);
    return [
      { id: 'auto-1', title: 'The Roots', subtitle: 'Origins & Childhood', yearStart: sorted[0]?.year, yearEnd: sorted[third - 1]?.year, memoryIds: sorted.slice(0, third).map(m => m.id), familyId, createdAt: '' },
      { id: 'auto-2', title: 'The Journey', subtitle: 'Years of Change', yearStart: sorted[third]?.year, yearEnd: sorted[third * 2 - 1]?.year, memoryIds: sorted.slice(third, third * 2).map(m => m.id), familyId, createdAt: '' },
      { id: 'auto-3', title: 'The Legacy', subtitle: 'What Remains', yearStart: sorted[third * 2]?.year, yearEnd: sorted[sorted.length - 1]?.year, memoryIds: sorted.slice(third * 2).map(m => m.id), familyId, createdAt: '' },
    ].filter(c => c.memoryIds.length > 0);
  }, [familyChapters, familyMemories, familyId]);

  const tableOfContents = useMemo(() => [
    { title: 'Dedication', page: 2, type: 'front' as const },
    { title: 'A Note on This Archive', page: 4, type: 'front' as const },
    ...chapterPreviews.map((ch, i) => ({
      title: ch.title,
      page: 8 + i * Math.max(12, ch.memoryIds.length * 4),
      type: 'chapter' as const,
      sub: ch.subtitle ?? '',
      years: ch.yearStart && ch.yearEnd ? `${ch.yearStart} — ${ch.yearEnd}` : '',
    })),
    ...(photosCount > 0 ? [{ title: 'Photograph Album', page: 90, type: 'section' as const }] : []),
    ...(familyTimeline.length > 0 ? [{ title: 'Family Timeline', page: 110, type: 'section' as const }] : []),
    ...(familyMembers.length > 1 ? [{ title: 'Family Tree', page: 124, type: 'section' as const }] : []),
    { title: 'Epilogue', page: 132, type: 'front' as const },
  ], [chapterPreviews, photosCount, familyTimeline.length, familyMembers.length]);

  useEffect(() => { setMounted(true); }, []);

  const buildBook = async () => {
    setStep('assembling');
    setProgress(0);
    for (let i = 0; i <= 25; i++) { setProgress(i); await sleep(30); }
    setStep('chapters');
    for (let i = 26; i <= 50; i++) { setProgress(i); await sleep(28); }
    setStep('photos');
    for (let i = 51; i <= 70; i++) { setProgress(i); await sleep(25); }
    setStep('tree');
    for (let i = 71; i <= 88; i++) { setProgress(i); await sleep(30); }
    setStep('cover');
    for (let i = 89; i <= 100; i++) { setProgress(i); await sleep(45); }
    setStep('preview');
  };

  const resetBook = () => {
    setStep('idle');
    setProgress(0);
    setActivePreviewTab('cover');
    setActiveChapterIdx(0);
  };

  const isBuilding = ['assembling', 'chapters', 'photos', 'tree', 'cover'].includes(step);
  const currentStepIdx = BUILD_STEPS.findIndex(s => s.key === step);
  const familyName = family?.name ?? 'The Family';
  const firstWord = familyName.split(' ')[0];

  if (!mounted) return null;

  if (!family) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navigation />
        <div className="flex items-center justify-center pt-40 flex-col gap-4">
          <div className="font-display text-2xl text-primary">Archive not found.</div>
          <Link href="/archive" className="btn-secondary text-sm">← Back to Archive</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navigation />

      {/* Page header */}
      <div
        className="pt-24 pb-12 px-6 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="max-w-[1100px] mx-auto">
          <Link
            href="/archive"
            className="label hover:text-primary transition-colors mb-6 inline-flex items-center gap-2"
          >
            ← ARCHIVE
          </Link>
          <div className="mt-4 flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="label mb-3" style={{ letterSpacing: '0.25em' }}>THE FAMILY BOOK</div>
              <h1
                className="font-display text-4xl md:text-5xl font-light text-primary"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
              >
                {familyName}
              </h1>
              <div className="mt-3 flex items-center gap-4 text-muted text-sm">
                <span>{yearRange}</span>
                {familyMemories.length > 0 && <><span>·</span><span>{familyMemories.length} memories</span></>}
                {chapterPreviews.length > 0 && <><span>·</span><span>{chapterPreviews.length} chapters</span></>}
              </div>
            </div>
            {step === 'preview' && (
              <button
                onClick={resetBook}
                className="btn-secondary text-xs"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-16">

        {/* ── IDLE STATE ── */}
        {step === 'idle' && (
          <div className="flex flex-col items-center gap-14">
            {/* Book preview outline */}
            <div className="relative">
              <div
                className="absolute -bottom-6 -right-6 w-64 h-80 rounded-sm opacity-10"
                style={{ background: 'var(--accent-amber)', filter: 'blur(30px)' }}
                aria-hidden="true"
              />
              <svg
                viewBox="0 0 240 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-56 relative"
                aria-label="Book preview outline"
                role="img"
              >
                {/* Spine */}
                <rect x="0" y="12" width="22" height="296" rx="2" fill="var(--bg-secondary)" stroke="var(--border-medium)" strokeWidth="1"/>
                {/* Cover */}
                <rect x="22" y="0" width="218" height="320" rx="2" fill="var(--bg-elevated)" stroke="var(--border-medium)" strokeWidth="1"/>
                {/* Gold border inset */}
                <rect x="30" y="10" width="202" height="300" rx="1" stroke="var(--accent-gold)" strokeWidth="0.5" strokeOpacity="0.4" fill="none"/>
                {/* Top ornament */}
                <line x1="55" y1="26" x2="210" y2="26" stroke="var(--accent-gold)" strokeWidth="0.8" opacity="0.5"/>
                <line x1="55" y1="28" x2="210" y2="28" stroke="var(--accent-gold)" strokeWidth="0.3" opacity="0.3"/>
                {/* Family name */}
                <text x="131" y="120" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-body)" letterSpacing="0.2em">
                  A LIVING FAMILY ARCHIVE
                </text>
                <text x="131" y="165" textAnchor="middle" fill="var(--accent-gold)" fontSize="28" fontFamily="var(--font-display)" fontWeight="500" letterSpacing="-0.02em">
                  {firstWord}
                </text>
                {/* Year range */}
                <text x="131" y="192" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-body)" letterSpacing="0.2em">
                  {yearRange}
                </text>
                {/* Bottom ornament */}
                <line x1="55" y1="278" x2="210" y2="278" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.3"/>
                <text x="131" y="300" textAnchor="middle" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.2em" opacity="0.5">
                  MEMOIRENGINE
                </text>
              </svg>
            </div>

            {/* Archive summary */}
            <div className="text-center max-w-md">
              <div className="label mb-3" style={{ letterSpacing: '0.2em' }}>ARCHIVE SUMMARY</div>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { val: String(familyMemories.length), lbl: 'memories' },
                  { val: String(chapterPreviews.length), lbl: 'chapters' },
                  { val: String(familyMembers.length), lbl: 'family members' },
                ].map(item => (
                  <div key={item.lbl} className="text-center">
                    <div
                      className="font-display text-3xl font-light"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-amber)', letterSpacing: '-0.03em' }}
                    >
                      {item.val}
                    </div>
                    <div className="label mt-1">{item.lbl}</div>
                  </div>
                ))}
              </div>
              {familyMemories.length === 0 && (
                <div
                  className="p-4 rounded-lg text-sm text-secondary mb-8"
                  style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-subtle)' }}
                >
                  <strong className="text-primary">No memories yet.</strong> Add memories in your archive first — they&apos;ll become the chapters of your book.{' '}
                  <Link href="/archive" className="text-[var(--accent-amber)] underline">Go to Archive →</Link>
                </div>
              )}
              <button
                onClick={buildBook}
                className="group flex items-center gap-4 mx-auto px-10 py-5 bg-[var(--bg-surface)] border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all duration-300"
                aria-label="Generate the family book"
              >
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="16" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="3" y="1" width="1.5" height="18" fill="currentColor" opacity="0.4"/>
                  <line x1="6" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
                  <line x1="6" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                  <line x1="6" y1="12" x2="11" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                </svg>
                <span className="text-[11px] tracking-[0.2em] uppercase font-medium">Create Family Book</span>
              </button>
            </div>
          </div>
        )}

        {/* ── BUILDING STATE ── */}
        {isBuilding && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-16">
              <div
                className="font-display text-2xl text-primary animate-pulse"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
              >
                Assembling your family&apos;s story…
              </div>
              <p className="text-muted text-sm mt-3">This will only take a moment.</p>
            </div>

            {/* Progress bar */}
            <div className="relative mb-10">
              <div className="h-px w-full bg-[var(--border-medium)]" />
              <div
                className="absolute top-0 left-0 h-px transition-all duration-300"
                style={{ width: `${progress}%`, background: 'var(--accent-amber)' }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Building book: ${progress}%`}
              />
            </div>

            {/* Steps list */}
            <div className="flex flex-col gap-5">
              {BUILD_STEPS.map((s, i) => {
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
                      className={`w-6 h-6 border flex items-center justify-center flex-shrink-0 rounded-sm ${
                        isDone
                          ? 'border-[var(--accent-amber)] bg-[var(--accent-amber-bg)]'
                          : isActive
                          ? 'border-[var(--accent-amber)]'
                          : 'border-[var(--border-medium)]'
                      }`}
                    >
                      {isDone ? (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                          <path d="M1 4l3 3 5-6" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : isActive ? (
                        <div
                          className="w-2 h-2 rounded-full animate-pulse-amber"
                          style={{ background: 'var(--accent-amber)' }}
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="text-muted text-[9px]">{s.icon}</span>
                      )}
                    </div>
                    <span className="label" style={{ color: isActive ? 'var(--accent-amber)' : undefined }}>
                      {s.label}
                    </span>
                    {isActive && (
                      <span className="label text-muted ml-auto">{progress}%</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PREVIEW STATE ── */}
        {step === 'preview' && (
          <div className="animate-fade-in">
            {/* Completion message */}
            <div className="text-center mb-16">
              <div className="label mb-3 text-[var(--accent-amber)]" style={{ letterSpacing: '0.25em' }}>
                ✓ BOOK GENERATED
              </div>
              <h2
                className="font-display text-3xl md:text-4xl font-light text-primary"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
              >
                Your family&apos;s story is ready.
              </h2>
            </div>

            {/* Preview tabs */}
            <div className="flex gap-2 mb-10 overflow-x-auto pb-1">
              {(['cover', 'toc', 'chapter'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActivePreviewTab(t)}
                  className={`pill-tab ${activePreviewTab === t ? 'pill-tab-active' : 'pill-tab-inactive'}`}
                >
                  {t === 'cover' ? 'Cover' : t === 'toc' ? 'Contents' : 'Read Chapter'}
                </button>
              ))}
            </div>

            {/* COVER PREVIEW */}
            {activePreviewTab === 'cover' && (
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Book render */}
                <div className="flex flex-col items-center gap-8">
                  <div className="relative group">
                    <div
                      className="absolute -bottom-6 -right-6 w-60 h-80 opacity-15"
                      style={{ background: 'var(--accent-amber)', filter: 'blur(30px)' }}
                      aria-hidden="true"
                    />
                    <svg
                      viewBox="0 0 240 320"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-60 relative group-hover:scale-[1.02] transition-transform duration-500"
                      aria-label={`${familyName} book cover`}
                      role="img"
                    >
                      {/* Spine */}
                      <rect x="0" y="12" width="24" height="296" rx="2" fill="#2a2218" stroke="var(--border-medium)" strokeWidth="1"/>
                      {/* Cover — warm dark for premium feel */}
                      <rect x="24" y="0" width="216" height="320" rx="2" fill="#1e1a12" stroke="var(--accent-gold)" strokeWidth="0.8" strokeOpacity="0.5"/>
                      {/* Gold border inset */}
                      <rect x="32" y="12" width="200" height="296" rx="1" stroke="var(--accent-gold)" strokeWidth="0.5" strokeOpacity="0.35" fill="none"/>
                      {/* Top ornament lines */}
                      <line x1="60" y1="28" x2="216" y2="28" stroke="var(--accent-gold)" strokeWidth="0.8" opacity="0.6"/>
                      <line x1="60" y1="30" x2="216" y2="30" stroke="var(--accent-gold)" strokeWidth="0.3" opacity="0.3"/>
                      {/* Subtitle */}
                      <text x="140" y="80" textAnchor="middle" fill="#9c8470" fontSize="7" fontFamily="var(--font-body)" letterSpacing="0.2em">
                        A LIVING FAMILY ARCHIVE
                      </text>
                      {/* The */}
                      <text x="140" y="130" textAnchor="middle" fill="#f0e8dc" fontSize="22" fontFamily="var(--font-display)" fontWeight="300" letterSpacing="-0.02em">
                        The
                      </text>
                      {/* Family name — gold */}
                      <text x="140" y="168" textAnchor="middle" fill="var(--accent-gold)" fontSize="32" fontFamily="var(--font-display)" fontWeight="600" letterSpacing="-0.02em">
                        {firstWord}
                      </text>
                      {/* Story */}
                      <text x="140" y="200" textAnchor="middle" fill="#f0e8dc" fontSize="22" fontFamily="var(--font-display)" fontWeight="300" letterSpacing="-0.02em">
                        Story
                      </text>
                      {/* Year range */}
                      <text x="140" y="228" textAnchor="middle" fill="#9c8470" fontSize="9" fontFamily="var(--font-body)" letterSpacing="0.18em">
                        {yearRange}
                      </text>
                      {/* Bottom ornament */}
                      <line x1="60" y1="278" x2="216" y2="278" stroke="var(--accent-gold)" strokeWidth="0.6" opacity="0.4"/>
                      {/* Publisher */}
                      <text x="140" y="300" textAnchor="middle" fill="#9c8470" fontSize="6" fontFamily="var(--font-body)" letterSpacing="0.25em" opacity="0.5">
                        MEMOIRENGINE
                      </text>
                    </svg>
                  </div>

                  {/* Stats */}
                  <div className="text-center">
                    <div className="label mb-2 text-[var(--accent-amber)]">GENERATED</div>
                    <div className="text-muted text-sm">
                      {chapterPreviews.length} chapters · {familyMemories.length} memories · {yearRange}
                    </div>
                  </div>
                </div>

                {/* Cover metadata */}
                <div>
                  <div className="label mb-8">ABOUT THIS BOOK</div>

                  <div className="flex flex-col gap-6 border-t border-[var(--border-subtle)]">
                    {[
                      { label: 'Full Title', value: `The ${familyName} Story` },
                      { label: 'Subtitle', value: 'A Living Family Archive' },
                      { label: 'Years Covered', value: yearRange },
                      { label: 'Total Memories', value: `${familyMemories.length} recorded memories` },
                      { label: 'Chapters', value: `${chapterPreviews.length} chapters` },
                      { label: 'Family Members', value: `${familyMembers.length} documented members` },
                      { label: 'Photographs', value: photosCount > 0 ? `${photosCount} photographs` : 'No photographs yet' },
                      { label: 'Publisher', value: 'MemoirEngine Living Archive' },
                      { label: 'Format', value: 'PDF · Printable hardcover layout' },
                    ].map(row => (
                      <div key={row.label} className="grid grid-cols-[140px_1fr] gap-4 pt-6 border-t border-[var(--border-subtle)]">
                        <div className="label">{row.label}</div>
                        <div className="text-primary text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                          {row.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Download buttons */}
                  <div className="mt-10 flex gap-4 flex-wrap">
                    <button
                      className="flex-1 py-4 min-w-[160px] border border-[var(--accent-gold)] text-[var(--accent-gold)] text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all duration-300"
                      onClick={() => alert('PDF export coming soon — backend integration required.')}
                    >
                      Download PDF
                    </button>
                    <button
                      className="px-6 py-4 border border-[var(--border-medium)] text-secondary text-[11px] tracking-[0.15em] uppercase font-medium hover:border-[var(--border-strong)] hover:text-primary transition-all duration-300"
                      onClick={() => alert('Print ordering coming soon.')}
                    >
                      Order Print
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TABLE OF CONTENTS */}
            {activePreviewTab === 'toc' && (
              <div className="max-w-2xl mx-auto">
                <div
                  className="p-10 border border-[var(--border-subtle)]"
                  style={{ background: 'var(--bg-elevated)' }}
                >
                  {/* Book title header */}
                  <div className="text-center mb-10 pb-10 border-b border-[var(--border-subtle)]">
                    <div className="label mb-3" style={{ letterSpacing: '0.25em' }}>TABLE OF CONTENTS</div>
                    <div
                      className="font-display text-2xl font-light text-primary"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      The {familyName} Story
                    </div>
                    <div className="text-muted text-sm mt-2">{yearRange}</div>
                  </div>

                  <div className="flex flex-col gap-0 border-t border-[var(--border-subtle)]">
                    {tableOfContents.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-baseline justify-between py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition-colors duration-200 px-2 -mx-2 rounded"
                      >
                        <div>
                          <div
                            className={`text-sm ${item.type === 'chapter' ? 'text-primary font-medium' : 'text-secondary'}`}
                            style={{ fontFamily: item.type === 'chapter' ? 'var(--font-display)' : undefined }}
                          >
                            {item.title}
                          </div>
                          {'sub' in item && item.sub && (
                            <div className="label mt-0.5">{item.sub}</div>
                          )}
                          {'years' in item && item.years && (
                            <div className="label mt-0.5">{item.years}</div>
                          )}
                        </div>
                        <div className="label ml-6 flex-shrink-0 tabular-nums">{item.page}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CHAPTER PREVIEW */}
            {activePreviewTab === 'chapter' && (
              <div>
                {chapterPreviews.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-secondary text-lg" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                      No chapters in your archive yet.
                    </div>
                    <Link href="/archive" className="btn-primary mt-6 inline-flex">Add Memories →</Link>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-[240px_1fr] gap-12">
                    {/* Chapter list */}
                    <div className="flex flex-col gap-0 border-r border-[var(--border-subtle)]">
                      {chapterPreviews.map((ch, i) => (
                        <button
                          key={ch.id}
                          onClick={() => setActiveChapterIdx(i)}
                          className={`text-left pr-8 py-6 border-b border-[var(--border-subtle)] transition-all duration-300 group ${
                            activeChapterIdx === i
                              ? 'border-l-2 border-[var(--accent-amber)] pl-5 -ml-px'
                              : 'pl-0 hover:pl-2'
                          }`}
                          aria-pressed={activeChapterIdx === i}
                        >
                          <div
                            className="label mb-2"
                            style={{ color: activeChapterIdx === i ? 'var(--accent-amber)' : undefined }}
                          >
                            {ch.yearStart && ch.yearEnd ? `${ch.yearStart} — ${ch.yearEnd}` : `Chapter ${i + 1}`}
                          </div>
                          <div
                            className={`font-display text-base font-medium transition-colors duration-300 ${
                              activeChapterIdx === i ? 'text-primary' : 'text-secondary group-hover:text-primary'
                            }`}
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {ch.title}
                          </div>
                          {ch.subtitle && (
                            <div className="label mt-1">{ch.subtitle}</div>
                          )}
                          <div className="label mt-1">{ch.memoryIds.length} memories</div>
                        </button>
                      ))}
                    </div>

                    {/* Chapter reader */}
                    <div>
                      {(() => {
                        const ch = chapterPreviews[activeChapterIdx];
                        if (!ch) return null;
                        const chMemories = familyMemories.filter(m => ch.memoryIds.includes(m.id));
                        return (
                          <>
                            {/* Chapter header */}
                            <div className="pb-10 border-b border-[var(--border-subtle)] mb-10">
                              {ch.subtitle && <div className="label mb-4">{ch.subtitle}</div>}
                              <h2
                                className="font-display text-4xl md:text-5xl font-light text-primary leading-[1.15]"
                                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
                              >
                                {ch.title}
                              </h2>
                              <div className="mt-4 flex items-center gap-4 text-sm text-muted">
                                {ch.yearStart && <span>{ch.yearStart}{ch.yearEnd && ` — ${ch.yearEnd}`}</span>}
                                {'location' in ch && ch.location && <><span>·</span><span>{ch.location}</span></>}
                                <span>·</span>
                                <span>{chMemories.length} memories</span>
                              </div>
                            </div>

                            {/* Auto-generated chapter intro */}
                            {'prose' in ch && ch.prose ? (
                              <div className="memoir-prose">
                                {(ch.prose as string).split('\n\n').map((para: string, i: number) => (
                                  <p key={i} className={i === 0 ? 'drop-cap' : ''} style={{ marginTop: i > 0 ? '1.5em' : 0 }}>
                                    {para}
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <div className="memoir-prose">
                                <p className="drop-cap">
                                  This chapter contains {chMemories.length} {chMemories.length === 1 ? 'memory' : 'memories'} from{' '}
                                  {ch.yearStart ? `${ch.yearStart}` : 'this period'}{ch.yearEnd ? ` to ${ch.yearEnd}` : ''}.
                                  Each memory is a fragment of a life — preserved here so that it may be passed on.
                                </p>
                                {chMemories.length > 0 && (
                                  <p style={{ marginTop: '1.5em' }}>
                                    The {chMemories[0].title} is among the memories that define this chapter.
                                    {chMemories[0].location ? ` It takes place in ${chMemories[0].location}.` : ''}
                                    {chMemories[0].transcript ? ` In the subject&apos;s own words: &ldquo;${chMemories[0].transcript.slice(0, 140)}…&rdquo;` : ''}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Memory cards */}
                            <div className="mt-16">
                              <div className="label mb-6">MEMORIES IN THIS CHAPTER</div>
                              <div className="flex flex-col gap-4">
                                {chMemories.length === 0 ? (
                                  <div className="text-muted text-sm py-4" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                                    No memories assigned to this chapter yet.
                                  </div>
                                ) : (
                                  chMemories.map(mem => (
                                    <div
                                      key={mem.id}
                                      className="p-5 border border-[var(--border-subtle)] hover:border-[var(--accent-amber-bg)] transition-colors duration-300"
                                      style={{ background: 'var(--bg-surface)' }}
                                    >
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                          <div className="label mb-1">
                                            {mem.year ? `${mem.year} ` : ''}{mem.location ? `· ${mem.location}` : ''}
                                          </div>
                                          <div
                                            className="text-primary text-base font-medium truncate"
                                            style={{ fontFamily: 'var(--font-display)' }}
                                          >
                                            {mem.title}
                                          </div>
                                          {mem.transcript && (
                                            <p className="text-secondary text-sm leading-[1.8] mt-2 line-clamp-3" style={{ fontFamily: 'var(--font-display)' }}>
                                              {mem.transcript.slice(0, 200)}{mem.transcript.length > 200 ? '…' : ''}
                                            </p>
                                          )}
                                        </div>
                                        {mem.photoUrls.length > 0 && (
                                          <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded">
                                            <img
                                              src={mem.photoUrls[0]}
                                              alt={mem.title}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        )}
                                      </div>
                                      {(mem.peopleFreeText.length > 0 || mem.objects.length > 0 || mem.emotions.length > 0) && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                          {mem.peopleFreeText.slice(0, 2).map(p => (
                                            <span key={p} className="entity-chip entity-person">{p}</span>
                                          ))}
                                          {mem.objects.slice(0, 2).map(o => (
                                            <span key={o} className="entity-chip entity-object">{o}</span>
                                          ))}
                                          {mem.emotions.slice(0, 1).map(e => (
                                            <span key={e} className="entity-chip entity-emotion">{e}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action row */}
            <div className="mt-16 pt-10 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
              <div className="text-muted text-sm" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                Stories shouldn&apos;t disappear.
              </div>
              <div className="flex gap-3">
                <Link href="/archive" className="btn-secondary text-xs">← Back to Archive</Link>
                <button
                  onClick={buildBook}
                  className="btn-primary text-xs"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
