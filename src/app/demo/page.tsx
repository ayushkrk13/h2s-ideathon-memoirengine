'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { DEMO_WOW_SEQUENCE, DEMO_SUBJECT } from '@/lib/demoData';
import { sleep } from '@/lib/utils';

type DemoPhase =
  | 'intro'
  | 'tree-growing'
  | 'arthur-question'
  | 'recording'
  | 'transcript'
  | 'discovery'
  | 'memory-form'
  | 'timeline-entry'
  | 'voice-playback'
  | 'memoir-reveal'
  | 'photo-connect'
  | 'book-assembly'
  | 'finale';

const PHASE_LABELS: Record<DemoPhase, string> = {
  'intro': '0:00 — Opening',
  'tree-growing': '0:10 — Memory Tree',
  'arthur-question': '0:20 — Arthur speaks',
  'recording': '0:45 — Voice captured',
  'transcript': '1:00 — Transcript',
  'discovery': '1:15 — Discovery',
  'memory-form': '1:30 — Memory forms',
  'timeline-entry': '1:45 — Timeline',
  'voice-playback': '2:00 — Original voice',
  'memoir-reveal': '2:15 — Memoir',
  'photo-connect': '2:30 — Photograph',
  'book-assembly': '2:45 — Family Book',
  'finale': '3:00 — Legacy',
};

const PHASE_ORDER: DemoPhase[] = [
  'intro', 'tree-growing', 'arthur-question', 'recording', 'transcript',
  'discovery', 'memory-form', 'timeline-entry', 'voice-playback',
  'memoir-reveal', 'photo-connect', 'book-assembly', 'finale',
];

export default function DemoPage() {
  const [phase, setPhase] = useState<DemoPhase>('intro');
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [visibleEntities, setVisibleEntities] = useState(0);
  const [proseText, setProseText] = useState('');
  const [waveformHeights, setWaveformHeights] = useState<number[]>([]);
  const [waveActive, setWaveActive] = useState(false);
  const waveRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const autoRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setWaveformHeights(Array.from({ length: 48 }, () => Math.random() * 0.6 + 0.1));
  }, []);

  useEffect(() => {
    if (waveActive) {
      waveRef.current = setInterval(() => {
        setWaveformHeights(prev => prev.map(h => Math.max(0.06, Math.min(1, h + (Math.random() - 0.5) * 0.25))));
      }, 80);
    } else clearInterval(waveRef.current);
    return () => clearInterval(waveRef.current);
  }, [waveActive]);

  const runAutoDemo = async () => {
    setIsAutoRunning(true);

    const phases: Array<{ phase: DemoPhase; duration: number; action?: () => Promise<void> }> = [
      { phase: 'intro', duration: 2000 },
      { phase: 'tree-growing', duration: 3000 },
      { phase: 'arthur-question', duration: 3000 },
      {
        phase: 'recording', duration: 100,
        action: async () => {
          setWaveActive(true);
          await sleep(2500);
          setWaveActive(false);
        }
      },
      {
        phase: 'transcript', duration: 100,
        action: async () => {
          const words = DEMO_WOW_SEQUENCE.transcript.split(' ');
          for (let i = 0; i < words.length; i++) {
            setTranscript(words.slice(0, i + 1).join(' '));
            await sleep(40);
          }
          await sleep(600);
        }
      },
      {
        phase: 'discovery', duration: 100,
        action: async () => {
          for (let i = 0; i < DEMO_WOW_SEQUENCE.entities.length; i++) {
            setVisibleEntities(i + 1);
            await sleep(350);
          }
          await sleep(600);
        }
      },
      { phase: 'memory-form', duration: 2000 },
      { phase: 'timeline-entry', duration: 2000 },
      {
        phase: 'voice-playback', duration: 100,
        action: async () => {
          setWaveActive(true);
          await sleep(3000);
          setWaveActive(false);
        }
      },
      {
        phase: 'memoir-reveal', duration: 100,
        action: async () => {
          const words = DEMO_WOW_SEQUENCE.generatedProse.split(' ');
          for (let i = 0; i < words.length; i++) {
            setProseText(words.slice(0, i + 1).join(' '));
            await sleep(20);
          }
          await sleep(1000);
        }
      },
      { phase: 'photo-connect', duration: 2500 },
      { phase: 'book-assembly', duration: 4000 },
      { phase: 'finale', duration: 0 },
    ];

    for (const { phase: p, duration, action } of phases) {
      setPhase(p);
      if (action) {
        await action();
      } else {
        await sleep(duration);
      }
    }
    setIsAutoRunning(false);
  };

  const jumpToPhase = (p: DemoPhase) => {
    setPhase(p);
    if (p === 'intro') {
      setTranscript('');
      setVisibleEntities(0);
      setProseText('');
      setWaveActive(false);
    }
  };

  const ENTITY_COLORS: Record<string, string> = {
    person: 'entity-person',
    place: 'entity-place',
    year: 'entity-year',
    object: 'entity-object',
    emotion: 'entity-emotion',
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-primary)', fontFamily: 'var(--font-body)' }}
    >
      {/* Demo top bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-6 gap-4 border-b border-[var(--border-subtle)]"
        style={{ background: 'rgba(15,14,12,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <Link href="/" className="archival-label hover:text-gold transition-colors duration-200">
          ← BACK
        </Link>
        <div className="h-4 w-px bg-[var(--border-subtle)]" aria-hidden="true"/>
        <span className="archival-label text-gold">JUDGE DEMO MODE</span>
        <div className="ml-auto flex items-center gap-4">
          <button
            onClick={runAutoDemo}
            disabled={isAutoRunning}
            className="px-5 py-1.5 bg-gold text-[var(--bg-primary)] text-[10px] tracking-[0.15em] uppercase font-medium hover:bg-[#e0bc5e] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAutoRunning ? '▶ RUNNING' : '▶ AUTO DEMO (3 MIN)'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen pt-12">
        {/* Left sidebar — phase navigator */}
        <div
          className="lg:w-64 flex-shrink-0 border-r border-[var(--border-subtle)] pt-8 pb-8 overflow-y-auto"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div className="px-6 mb-6">
            <div className="archival-label mb-2">DEMO SEQUENCE</div>
            <div className="text-xs text-muted">3-minute judge presentation</div>
          </div>
          <nav aria-label="Demo phase navigation">
            {PHASE_ORDER.map((p) => (
              <button
                key={p}
                onClick={() => jumpToPhase(p)}
                className={`w-full text-left px-6 py-3 transition-all duration-200 border-l-2 ${
                  phase === p
                    ? 'border-gold bg-[rgba(201,168,76,0.06)] text-gold'
                    : 'border-transparent text-muted hover:text-secondary hover:border-[var(--border-medium)]'
                }`}
                aria-current={phase === p ? 'step' : undefined}
              >
                <div className="archival-label text-current" style={{ fontSize: '9px' }}>
                  {PHASE_LABELS[p]}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Main stage */}
        <div className="flex-1 pt-8 pb-16 px-8 lg:px-16 overflow-y-auto">
          {/* INTRO */}
          {phase === 'intro' && (
            <DemoStage title="Opening">
              <div className="flex flex-col items-center justify-center min-h-96 gap-8">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" aria-hidden="true"/>
                <p
                  className="text-center text-2xl text-secondary max-w-xl leading-[1.8] font-light"
                  style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
                >
                  &ldquo;Every family has stories that disappear
                  <br />when the person who remembers them is gone.&rdquo;
                </p>
                <div className="archival-label text-muted">
                  MemoirEngine captures them before they do.
                </div>
              </div>
            </DemoStage>
          )}

          {/* TREE GROWING */}
          {phase === 'tree-growing' && (
            <DemoStage title="The Memory Tree grows">
              <div className="flex flex-col items-center justify-center min-h-96 gap-6">
                {/* Simplified tree SVG animation */}
                <svg viewBox="0 0 300 360" width="280" height="336" aria-label="Memory Tree visualization">
                  {/* Trunk */}
                  <path d="M150 340 C148 320, 145 280, 150 220" stroke="var(--accent-gold)" strokeWidth="3" fill="none" strokeLinecap="round"
                    style={{ strokeDasharray: 200, strokeDashoffset: 0, animation: 'drawLine 1s ease-out forwards' }}/>
                  {/* Branches */}
                  <path d="M150 300 C130 280, 100 260, 80 240" stroke="var(--accent-gold)" strokeWidth="1.5" fill="none" opacity="0.7"
                    style={{ strokeDasharray: 100, strokeDashoffset: 0, animation: 'drawLine 1s 0.3s ease-out forwards' }}/>
                  <path d="M150 280 C170 255, 200 240, 215 220" stroke="var(--accent-gold)" strokeWidth="1.5" fill="none" opacity="0.7"
                    style={{ strokeDasharray: 100, strokeDashoffset: 0, animation: 'drawLine 1s 0.5s ease-out forwards' }}/>
                  <path d="M150 260 C140 235, 120 215, 105 200" stroke="var(--accent-gold)" strokeWidth="1.2" fill="none" opacity="0.5"
                    style={{ strokeDasharray: 100, strokeDashoffset: 0 }}/>
                  <path d="M150 250 C160 228, 175 208, 195 195" stroke="var(--accent-gold)" strokeWidth="1.2" fill="none" opacity="0.5"/>
                  {/* Roots */}
                  <path d="M150 340 C130 355, 110 360, 95 355" stroke="var(--accent-gold-dim)" strokeWidth="1.5" fill="none" opacity="0.4"/>
                  <path d="M150 340 C165 358, 185 362, 200 355" stroke="var(--accent-gold-dim)" strokeWidth="1.5" fill="none" opacity="0.4"/>
                  <path d="M150 345 C145 368, 140 375, 130 372" stroke="var(--accent-gold-dim)" strokeWidth="1" fill="none" opacity="0.3"/>
                  {/* Memory nodes */}
                  {[
                    [80, 240], [215, 220], [105, 200], [195, 195],
                    [150, 180], [120, 155], [175, 150], [150, 130],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="5" fill="var(--accent-gold)" opacity={0.6 + i * 0.03}
                      style={{ animation: `fadeIn 0.5s ${0.8 + i * 0.1}s both` }}/>
                  ))}
                  {/* Particles */}
                  {[
                    [60, 180], [240, 200], [90, 120], [210, 140], [140, 90],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="2" fill="var(--accent-gold)" opacity="0.3"
                      style={{ animation: `float ${3 + i}s ease-in-out infinite` }}/>
                  ))}
                </svg>
                <p
                  className="text-secondary text-lg text-center font-light"
                  style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
                >
                  Each memory adds a new branch to the tree.
                </p>
              </div>
            </DemoStage>
          )}

          {/* ARTHUR QUESTION */}
          {phase === 'arthur-question' && (
            <DemoStage title="Arthur, the AI Biographer">
              <div className="max-w-2xl">
                <div className="flex items-start gap-5 mb-12">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 border border-gold flex items-center justify-center">
                      <span className="text-gold text-sm tracking-wider font-medium">A</span>
                    </div>
                  </div>
                  <div>
                    <div className="archival-label mb-3 text-gold">ARTHUR — AI BIOGRAPHER</div>
                    <div className="font-display text-2xl text-primary leading-[1.5]" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                      &ldquo;{DEMO_WOW_SEQUENCE.question}&rdquo;
                    </div>
                  </div>
                </div>
                <div className="pl-17 ml-17">
                  <div className="archival-label mb-4">SUBJECT</div>
                  <div className="text-secondary text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                    {DEMO_SUBJECT.name}
                  </div>
                  <div className="text-muted text-sm mt-1">{DEMO_SUBJECT.tagline}</div>
                </div>
              </div>
            </DemoStage>
          )}

          {/* RECORDING */}
          {phase === 'recording' && (
            <DemoStage title="Voice Capture">
              <div className="flex flex-col items-center gap-8 py-12">
                <div className="archival-label text-gold animate-pulse-gold">● RECORDING</div>
                <div className="flex items-end gap-[2px] h-24 w-full max-w-lg" role="img" aria-label="Voice waveform">
                  {waveformHeights.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h * 100}%`,
                        background: `rgba(201, 168, 76, ${0.3 + h * 0.7})`,
                        transition: 'height 0.08s ease-out',
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-secondary text-sm text-center max-w-sm" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                  &ldquo;The sounds I remember most are the temple bells...&rdquo;
                </p>
              </div>
            </DemoStage>
          )}

          {/* TRANSCRIPT */}
          {phase === 'transcript' && (
            <DemoStage title="Real-Time Transcript">
              <div className="max-w-2xl">
                <div className="archival-label mb-6">LIVE TRANSCRIPT</div>
                <p
                  className="text-primary text-base leading-[1.9]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {transcript}
                  <span className="inline-block w-0.5 h-4 bg-gold ml-1 animate-pulse-gold" aria-hidden="true"/>
                </p>
              </div>
            </DemoStage>
          )}

          {/* DISCOVERY */}
          {phase === 'discovery' && (
            <DemoStage title="Memory Discovery">
              <div className="max-w-2xl">
                <p className="text-secondary text-sm mb-8 leading-[1.9]" style={{ fontFamily: 'var(--font-display)' }}>
                  {DEMO_WOW_SEQUENCE.transcript}
                </p>
                <div className="archival-label mb-4">ARTHUR IDENTIFIED</div>
                <div className="flex flex-wrap gap-3">
                  {DEMO_WOW_SEQUENCE.entities.slice(0, visibleEntities).map((e, i) => (
                    <span
                      key={i}
                      className={`entity-chip ${ENTITY_COLORS[e.type]}`}
                      style={{ fontSize: '13px', padding: '6px 14px' }}
                    >
                      {e.label}
                    </span>
                  ))}
                </div>
              </div>
            </DemoStage>
          )}

          {/* MEMORY FORM */}
          {phase === 'memory-form' && (
            <DemoStage title="Memory Card Forms">
              <div className="max-w-lg">
                <div className="memory-card">
                  <div className="archival-label mb-4">MEMORY</div>
                  <h3
                    className="font-display text-3xl font-medium text-primary"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                  >
                    {DEMO_WOW_SEQUENCE.memoryTitle}
                  </h3>
                  <div className="mt-3 text-muted text-sm">
                    {DEMO_WOW_SEQUENCE.memoryYear} · {DEMO_WOW_SEQUENCE.memoryLocation}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {DEMO_WOW_SEQUENCE.entities.map((e, i) => (
                      <span key={i} className={`entity-chip ${ENTITY_COLORS[e.type]}`}>{e.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </DemoStage>
          )}

          {/* TIMELINE ENTRY */}
          {phase === 'timeline-entry' && (
            <DemoStage title="Memory Enters the Timeline">
              <div className="max-w-xl">
                <div className="archival-label mb-8">1942 — PRESENT</div>
                <div className="relative pl-8 border-l border-[var(--border-medium)]">
                  {[1952, 1963, 1968, 1975, 1983].map((year, i) => (
                    <div key={year} className="flex items-center gap-4 mb-8">
                      <div
                        className="absolute left-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
                        style={{
                          background: year === 1950 ? 'var(--accent-gold)' : 'var(--border-medium)',
                          boxShadow: year === 1950 ? '0 0 8px rgba(201,168,76,0.6)' : 'none',
                        }}
                        aria-hidden="true"
                      />
                      <div>
                        <div className="archival-label mb-0.5" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{year}</div>
                      </div>
                    </div>
                  ))}
                  {/* New memory node — glowing */}
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-gold"
                      style={{ boxShadow: '0 0 0 4px rgba(201,168,76,0.15), 0 0 20px rgba(201,168,76,0.5)', animation: 'pulseGold 2s ease-in-out infinite' }}
                      aria-hidden="true"
                    />
                    <div>
                      <div className="archival-label mb-0.5 text-gold">NEW</div>
                      <div className="text-primary text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                        {DEMO_WOW_SEQUENCE.memoryTitle}
                      </div>
                      <div className="text-muted text-xs">{DEMO_WOW_SEQUENCE.memoryYear} · {DEMO_WOW_SEQUENCE.memoryLocation}</div>
                    </div>
                  </div>
                </div>
              </div>
            </DemoStage>
          )}

          {/* VOICE PLAYBACK */}
          {phase === 'voice-playback' && (
            <DemoStage title="Original Voice Plays">
              <div className="flex flex-col items-center gap-8 py-12">
                <div className="archival-label text-gold">▶ ORIGINAL RECORDING</div>
                <div className="flex items-end gap-[2px] h-20 w-full max-w-lg" role="img" aria-label="Playback waveform">
                  {waveformHeights.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h * 100}%`,
                        background: `rgba(201, 168, 76, ${0.3 + h * 0.6})`,
                        transition: 'height 0.08s ease-out',
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="archival-label text-muted">
                  {DEMO_SUBJECT.name} · Varanasi · c. 1950
                </div>
              </div>
            </DemoStage>
          )}

          {/* MEMOIR REVEAL */}
          {phase === 'memoir-reveal' && (
            <DemoStage title="AI Memoir Generated">
              <div className="max-w-2xl">
                <div className="archival-label mb-6">GENERATED MEMOIR PROSE</div>
                <div className="memoir-prose">
                  <p className="drop-cap">
                    {proseText}
                    {proseText.length < DEMO_WOW_SEQUENCE.generatedProse.length && (
                      <span className="inline-block w-0.5 h-4 bg-gold ml-1 animate-pulse-gold" aria-hidden="true"/>
                    )}
                  </p>
                </div>
                <div className="mt-6 archival-label">
                  SOURCE: Original recording, {DEMO_WOW_SEQUENCE.memoryYear}, {DEMO_WOW_SEQUENCE.memoryLocation}
                </div>
              </div>
            </DemoStage>
          )}

          {/* PHOTO CONNECT */}
          {phase === 'photo-connect' && (
            <DemoStage title="Memory Connects to Photograph">
              <div className="grid grid-cols-2 gap-10 items-start max-w-2xl">
                {/* Simulated photo */}
                <div className="photo-artifact aspect-[3/4] bg-[var(--bg-surface)] border border-[var(--border-medium)] overflow-hidden">
                  <div
                    className="w-full h-full"
                    style={{
                      background: `
                        radial-gradient(ellipse at 40% 60%, rgba(140, 120, 70, 0.3) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 30%, rgba(100, 85, 50, 0.15) 0%, transparent 50%),
                        var(--bg-secondary)
                      `,
                    }}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 100 130" className="w-full h-full" aria-hidden="true">
                      <ellipse cx="50" cy="85" rx="30" ry="40" fill="rgba(140,120,70,0.2)"/>
                      <circle cx="50" cy="35" r="18" fill="rgba(140,120,70,0.15)"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="archival-label" style={{ fontSize: '8px' }}>c. 1950 · VARANASI</div>
                  </div>
                </div>
                {/* Connection info */}
                <div>
                  <div className="archival-label mb-4 text-gold">CONNECTED</div>
                  <div className="font-display text-xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                    {DEMO_WOW_SEQUENCE.memoryTitle}
                  </div>
                  <div className="mt-2 text-muted text-sm">{DEMO_WOW_SEQUENCE.memoryYear}</div>
                  <div className="mt-6 flex flex-col gap-2">
                    {DEMO_WOW_SEQUENCE.entities.slice(0, 3).map((e, i) => (
                      <span key={i} className={`entity-chip ${['entity-person','entity-place','entity-object'][i]}`} style={{ width: 'fit-content' }}>
                        {e.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </DemoStage>
          )}

          {/* BOOK ASSEMBLY */}
          {phase === 'book-assembly' && (
            <DemoStage title="Family Book Assembles">
              <div className="flex flex-col items-center gap-10">
                <div className="animate-float" aria-hidden="true">
                  <svg viewBox="0 0 200 260" width="160" height="208" fill="none">
                    <rect x="0" y="10" width="18" height="240" rx="2" fill="var(--bg-surface)" stroke="var(--border-medium)" strokeWidth="1"/>
                    <rect x="18" y="0" width="182" height="260" rx="2" fill="var(--bg-elevated)" stroke="var(--accent-gold-dim)" strokeWidth="1.5"/>
                    <rect x="26" y="10" width="166" height="240" rx="1" stroke="var(--accent-gold)" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
                    <line x1="42" y1="26" x2="180" y2="26" stroke="var(--accent-gold)" strokeWidth="0.6" opacity="0.5"/>
                    <text x="109" y="95" textAnchor="middle" fill="var(--text-primary)" fontSize="22" fontFamily="var(--font-display)" fontWeight="300">The</text>
                    <text x="109" y="126" textAnchor="middle" fill="var(--accent-gold)" fontSize="32" fontFamily="var(--font-display)" fontWeight="600">Sharma</text>
                    <text x="109" y="155" textAnchor="middle" fill="var(--text-primary)" fontSize="22" fontFamily="var(--font-display)" fontWeight="300">Story</text>
                    <text x="109" y="178" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-body)" letterSpacing="0.12em">1942 — 2024</text>
                    <line x1="42" y1="220" x2="180" y2="220" stroke="var(--accent-gold)" strokeWidth="0.6" opacity="0.3"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="archival-label mb-2 text-gold">ASSEMBLED</div>
                  <div className="text-secondary text-sm">4 chapters · 10 memories · 1942 — 2024</div>
                </div>
              </div>
            </DemoStage>
          )}

          {/* FINALE */}
          {phase === 'finale' && (
            <DemoStage title="Legacy">
              <div className="flex flex-col items-center gap-10 py-12">
                <div className="text-center max-w-xl">
                  <p
                    className="font-display text-4xl font-light text-primary leading-[1.3]"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                  >
                    Stories shouldn&apos;t disappear.
                  </p>
                  <div className="mt-8 flex flex-col gap-2">
                    {['Preserve the voice.', 'Preserve the story.', 'Preserve the person.'].map(line => (
                      <p
                        key={line}
                        className="text-secondary text-lg font-light"
                        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="mt-12 sep-gold mx-auto" />
                  <div className="mt-8 archival-label text-gold">MEMOIRENGINE</div>
                  <div className="mt-2 text-muted text-xs">A Living Archive of Human Memory</div>
                </div>
              </div>
            </DemoStage>
          )}
        </div>
      </div>
    </div>
  );
}

function DemoStage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="archival-label mb-8 text-gold border-b border-[var(--border-subtle)] pb-4">
        {title.toUpperCase()}
      </div>
      {children}
    </div>
  );
}
