'use client';

import { useState, useEffect, useRef } from 'react';
import { DEMO_WOW_SEQUENCE } from '@/lib/demoData';
import { sleep } from '@/lib/utils';

type WowStep =
  | 'idle'
  | 'recording'
  | 'transcript'
  | 'entities'
  | 'memorycard'
  | 'timeline'
  | 'prose'
  | 'playback'
  | 'legacy';

const ENTITY_COLORS: Record<string, string> = {
  person: 'entity-person',
  place: 'entity-place',
  year: 'entity-year',
  object: 'entity-object',
  emotion: 'entity-emotion',
};

const ENTITY_ICONS: Record<string, string> = {
  person: '○',
  place: '◇',
  year: '◻',
  object: '△',
  emotion: '♡',
};

export default function WowSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState<WowStep>('idle');
  const [transcript, setTranscript] = useState('');
  const [visibleEntities, setVisibleEntities] = useState<number>(0);
  const [cardVisible, setCardVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [proseText, setProseText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformActive, setWaveformActive] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([]);
  const animRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const waveAnimRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Generate waveform heights
  useEffect(() => {
    const heights = Array.from({ length: 60 }, () => Math.random() * 0.7 + 0.1);
    setWaveHeights(heights);
  }, []);

  // Waveform animation
  useEffect(() => {
    if (waveformActive) {
      waveAnimRef.current = setInterval(() => {
        setWaveHeights(prev => prev.map(h => {
          const delta = (Math.random() - 0.5) * 0.3;
          return Math.max(0.08, Math.min(1, h + delta));
        }));
      }, 80);
    } else {
      clearInterval(waveAnimRef.current);
    }
    return () => clearInterval(waveAnimRef.current);
  }, [waveformActive]);

  const runDemoSequence = async () => {
    // Step 1: Recording / Voice
    setStep('recording');
    setWaveformActive(true);
    await sleep(2500);

    // Step 2: Transcript appears
    setWaveformActive(false);
    setStep('transcript');
    const words = DEMO_WOW_SEQUENCE.transcript.split(' ');
    for (let i = 0; i < words.length; i++) {
      setTranscript(words.slice(0, i + 1).join(' '));
      await sleep(45);
    }
    await sleep(800);

    // Step 3: Entities appear one by one
    setStep('entities');
    for (let i = 0; i < DEMO_WOW_SEQUENCE.entities.length; i++) {
      setVisibleEntities(i + 1);
      await sleep(300);
    }
    await sleep(600);

    // Step 4: Memory card
    setStep('memorycard');
    setCardVisible(true);
    await sleep(1200);

    // Step 5: Timeline
    setStep('timeline');
    setTimelineVisible(true);
    await sleep(1000);

    // Step 6: Generated prose appears
    setStep('prose');
    const proseWords = DEMO_WOW_SEQUENCE.generatedProse.split(' ');
    for (let i = 0; i < proseWords.length; i++) {
      setProseText(proseWords.slice(0, i + 1).join(' '));
      await sleep(25);
    }
    await sleep(800);

    // Step 7: Playback indicator
    setStep('playback');
    setIsPlaying(true);
    setWaveformActive(true);
    await sleep(3000);

    // Step 8: Legacy
    setWaveformActive(false);
    setIsPlaying(false);
    setStep('legacy');
  };

  const resetSequence = () => {
    clearTimeout(animRef.current);
    setStep('idle');
    setTranscript('');
    setVisibleEntities(0);
    setCardVisible(false);
    setTimelineVisible(false);
    setProseText('');
    setIsPlaying(false);
    setWaveformActive(false);
  };

  const hasStarted = step !== 'idle';
  const showTranscript = ['transcript', 'entities', 'memorycard', 'timeline', 'prose', 'playback', 'legacy'].includes(step);
  const showEntities = ['entities', 'memorycard', 'timeline', 'prose', 'playback', 'legacy'].includes(step);
  const showCard = ['memorycard', 'timeline', 'prose', 'playback', 'legacy'].includes(step);
  const showTimeline = ['timeline', 'prose', 'playback', 'legacy'].includes(step);
  const showProse = ['prose', 'playback', 'legacy'].includes(step);
  const showLegacy = step === 'legacy';

  return (
    <section
      ref={sectionRef}
      id="wow-sequence"
      className="relative py-32 px-6 min-h-screen"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="mb-20">
          <div className="archival-label mb-6" style={{ letterSpacing: '0.25em' }}>
            THE EXPERIENCE
          </div>
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-primary"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
          >
            Watch a memory{' '}
            <em className="text-gold not-italic">come alive.</em>
          </h2>
        </div>

        {/* Main demo area */}
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          {/* Arthur's question bar */}
          <div className="border-b border-[var(--border-subtle)] px-8 py-6 flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 border border-gold flex items-center justify-center">
                <span className="text-gold text-[10px] tracking-wider font-medium" style={{ fontFamily: 'var(--font-body)' }}>A</span>
              </div>
            </div>
            <div>
              <div className="archival-label mb-2 text-gold">ARTHUR</div>
              <p
                className="text-secondary text-base leading-[1.7] max-w-2xl"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
              >
                &ldquo;{DEMO_WOW_SEQUENCE.question}&rdquo;
              </p>
            </div>
          </div>

          {/* Content area */}
          <div className="p-8">
            {!hasStarted && (
              <div className="flex flex-col items-center justify-center py-20 gap-8">
                <p className="archival-label" style={{ letterSpacing: '0.2em' }}>
                  RAMESH SHARMA &nbsp;·&nbsp; MUMBAI &nbsp;·&nbsp; 2024
                </p>
                <button
                  onClick={runDemoSequence}
                  className="group flex items-center gap-4 px-8 py-5 border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all duration-300"
                  aria-label="Begin the memory demonstration"
                >
                  <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                      <path d="M3 2l9 5-9 5V2z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] tracking-[0.2em] uppercase font-medium">
                    Begin a Memory
                  </span>
                </button>
                <p className="text-muted text-sm" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                  A demonstration using pre-recorded voice
                </p>
              </div>
            )}

            {hasStarted && (
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Left column — voice + transcript */}
                <div>
                  {/* Waveform */}
                  <div className="mb-8">
                    <div className="archival-label mb-4">
                      {step === 'recording' ? '● RECORDING' : step === 'playback' ? '▶ PLAYBACK' : 'VOICE'}
                    </div>
                    <div
                      className="flex items-end gap-[2px] h-16"
                      role="img"
                      aria-label="Audio waveform"
                    >
                      {waveHeights.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm transition-all duration-100"
                          style={{
                            height: `${(waveformActive ? h : 0.15) * 100}%`,
                            background: waveformActive
                              ? `rgba(201, 168, 76, ${0.4 + h * 0.6})`
                              : 'var(--border-medium)',
                          }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Transcript */}
                  {showTranscript && (
                    <div className="transition-all duration-500">
                      <div className="archival-label mb-3">TRANSCRIPT</div>
                      <p
                        className="text-primary text-sm leading-[1.9] font-light"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {transcript}
                        {step === 'transcript' && (
                          <span className="inline-block w-0.5 h-4 bg-gold ml-0.5 animate-pulse-gold" aria-hidden="true"/>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Entities */}
                  {showEntities && (
                    <div className="mt-8">
                      <div className="archival-label mb-4">DISCOVERED</div>
                      <div className="flex flex-wrap gap-2">
                        {DEMO_WOW_SEQUENCE.entities.slice(0, visibleEntities).map((entity, i) => (
                          <span
                            key={i}
                            className={`entity-chip ${ENTITY_COLORS[entity.type]} transition-all duration-300`}
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <span aria-hidden="true">{ENTITY_ICONS[entity.type]}</span>
                            {entity.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column — memory card + prose */}
                <div>
                  {/* Memory Card */}
                  {showCard && (
                    <div
                      className={`memory-card transition-all duration-700 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    >
                      <div className="archival-label mb-4">MEMORY</div>
                      <h3
                        className="font-display text-2xl font-medium text-primary leading-tight"
                        style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                      >
                        {DEMO_WOW_SEQUENCE.memoryTitle}
                      </h3>
                      <div className="mt-3 flex items-center gap-4 text-muted text-sm">
                        <span>{DEMO_WOW_SEQUENCE.memoryYear}</span>
                        <span>·</span>
                        <span>{DEMO_WOW_SEQUENCE.memoryLocation}</span>
                      </div>

                      {/* Entities in card */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {DEMO_WOW_SEQUENCE.entities.slice(0, 4).map((e, i) => (
                          <span key={i} className={`entity-chip ${ENTITY_COLORS[e.type]}`}>
                            {e.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timeline node */}
                  {showTimeline && (
                    <div
                      className={`mt-6 flex items-center gap-4 transition-all duration-500 ${
                        timelineVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                    >
                      <div className="archival-label">ADDED TO TIMELINE</div>
                      <div className="flex items-center gap-2">
                        <div className="h-px w-12 bg-[var(--border-medium)]" />
                        <div className="timeline-node" aria-hidden="true"/>
                        <span className="text-gold text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                          {DEMO_WOW_SEQUENCE.memoryYear}
                        </span>
                        <div className="h-px w-12 bg-[var(--border-medium)]" />
                      </div>
                    </div>
                  )}

                  {/* Generated Prose */}
                  {showProse && (
                    <div className="mt-6">
                      <div className="archival-label mb-4">MEMOIR PROSE</div>
                      <p
                        className="text-secondary text-sm leading-[1.9]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {proseText}
                        {step === 'prose' && (
                          <span className="inline-block w-0.5 h-3.5 bg-gold ml-0.5 animate-pulse-gold" aria-hidden="true"/>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Legacy */}
                  {showLegacy && (
                    <div className="mt-8 p-6 border border-gold border-opacity-30 bg-[rgba(201,168,76,0.04)] transition-all duration-700">
                      <div className="archival-label mb-3 text-gold">ADDED TO FAMILY BOOK</div>
                      <div className="flex items-center gap-3">
                        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" aria-hidden="true">
                          <rect x="1" y="1" width="30" height="38" rx="1" stroke="var(--accent-gold)" strokeWidth="1" fill="none" opacity="0.5"/>
                          <rect x="5" y="1" width="1" height="38" fill="var(--accent-gold)" opacity="0.3"/>
                          <line x1="9" y1="10" x2="26" y2="10" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.4"/>
                          <line x1="9" y1="15" x2="26" y2="15" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.3"/>
                          <line x1="9" y1="20" x2="22" y2="20" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.3"/>
                        </svg>
                        <div>
                          <div className="text-primary text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                            The Sharma Story
                          </div>
                          <div className="text-muted text-xs mt-1">1942 — 2024</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom controls */}
          {hasStarted && (
            <div className="border-t border-[var(--border-subtle)] px-8 py-4 flex justify-between items-center">
              <div className="archival-label">
                {step === 'recording' && '● VOICE CAPTURE'}
                {step === 'transcript' && 'TRANSCRIBING'}
                {step === 'entities' && 'DISCOVERING MEMORIES'}
                {step === 'memorycard' && 'FORMING MEMORY'}
                {step === 'timeline' && 'ENTERING ARCHIVE'}
                {step === 'prose' && 'GENERATING MEMOIR'}
                {step === 'playback' && '▶ ORIGINAL VOICE'}
                {step === 'legacy' && '✓ PRESERVED'}
              </div>
              <button
                onClick={resetSequence}
                className="archival-label hover:text-primary transition-colors duration-300"
              >
                RESET
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
