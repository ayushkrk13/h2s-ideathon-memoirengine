'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DEMO_WOW_SEQUENCE, DEMO_SUBJECT } from '@/lib/demoData';
import { sleep } from '@/lib/utils';
import TreeWatermark from '@/components/TreeWatermark';

const ARTHUR_QUESTIONS = [
  "You once told me about the house where you grew up. What do you remember hearing there in the mornings?",
  "Tell me about a person who shaped who you became. What is the first moment you think of?",
  "There must have been an object — something ordinary — that had a particular importance. What comes to mind?",
  "When did you first feel that you were no longer a child? Was there a single moment?",
  "What is a place that exists mainly in memory now — somewhere that is gone but that you still carry?",
  "Tell me about a meal that matters. Not the best meal. The one that has a story.",
];

export default function InterviewPage() {
  const router = useRouter();
  const [questionIdx, setQuestionIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [waveHeights, setWaveHeights] = useState<number[]>([]);
  const [phase, setPhase] = useState<'ready' | 'listening' | 'processing' | 'done'>('ready');
  const waveRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    setWaveHeights(Array.from({ length: 40 }, () => Math.random() * 0.5 + 0.1));
  }, []);

  useEffect(() => {
    if (isRecording) {
      waveRef.current = setInterval(() => {
        setWaveHeights(prev => prev.map(h => Math.max(0.05, Math.min(1, h + (Math.random() - 0.5) * 0.3))));
      }, 70);
    } else {
      clearInterval(waveRef.current);
    }
    return () => clearInterval(waveRef.current);
  }, [isRecording]);

  const handleRecord = async () => {
    if (phase === 'listening') {
      // Stop recording
      setIsRecording(false);
      setPhase('processing');
      await sleep(1200);
      // Use demo transcript for question 0
      if (questionIdx === 0) {
        setTranscript(DEMO_WOW_SEQUENCE.transcript);
      } else {
        setTranscript("The memory that comes to me most clearly... it was the kind of thing that seemed ordinary at the time. But years later, when you look back, you realise it was everything.");
      }
      setPhase('done');
      setHasSpoken(true);
    } else if (phase === 'ready') {
      setPhase('listening');
      setIsRecording(true);
    }
  };

  const nextQuestion = () => {
    setQuestionIdx(prev => Math.min(prev + 1, ARTHUR_QUESTIONS.length - 1));
    setPhase('ready');
    setTranscript('');
    setHasSpoken(false);
    setIsRecording(false);
  };

  const question = ARTHUR_QUESTIONS[questionIdx];

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'var(--bg-primary)', fontFamily: 'var(--font-body)' }}
    >
      <TreeWatermark side="left" opacity={0.03} scale={0.85} />
      {/* Minimal header */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-8 border-b border-[var(--border-subtle)]"
        style={{ background: 'rgba(15,14,12,0.95)' }}>
        <button
          onClick={() => router.push('/archive')}
          className="archival-label hover:text-gold transition-colors duration-200 cursor-pointer"
        >
          ← ARCHIVE
        </button>
        <div className="archival-label">{questionIdx + 1} / {ARTHUR_QUESTIONS.length}</div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-14" aria-label="Memory interview with Arthur">
        <div className="w-full max-w-2xl">
          {/* Subject name */}
          <div
            className="font-display text-sm text-secondary mb-16 text-center"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
          >
            {DEMO_SUBJECT.name}
          </div>

          {/* Arthur identity */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 border border-gold flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-xs font-medium">A</span>
            </div>
            <div className="archival-label text-gold">ARTHUR</div>
          </div>

          {/* Question */}
          <h1
            className="font-display text-2xl md:text-3xl text-primary font-light leading-[1.6]"
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', letterSpacing: '-0.01em' }}
          >
            &ldquo;{question}&rdquo;
          </h1>

          {/* Waveform area */}
          <div className="mt-16">
            <div
              className="flex items-end gap-[3px] h-20 w-full"
              role="img"
              aria-label={isRecording ? 'Recording waveform active' : 'Waveform inactive'}
            >
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${(isRecording ? h : 0.12) * 100}%`,
                    background: isRecording
                      ? `rgba(201, 168, 76, ${0.3 + h * 0.7})`
                      : 'var(--border-subtle)',
                    transition: isRecording ? 'height 0.07s' : 'height 0.5s ease-out',
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          {/* Live transcript */}
          {phase === 'processing' && (
            <div className="mt-8 archival-label animate-pulse-gold">PROCESSING...</div>
          )}

          {transcript && phase === 'done' && (
            <div className="mt-8">
              <div className="archival-label mb-3">TRANSCRIPT</div>
              <p
                className="text-secondary text-base leading-[1.8]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {transcript}
              </p>
            </div>
          )}

          {/* Record button */}
          <div className="mt-12 flex items-center gap-6">
            {phase !== 'done' && (
              <button
                onClick={handleRecord}
                className={`group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? 'bg-[rgba(139,74,58,0.3)] border-2 border-terracotta'
                    : 'border-2 border-gold hover:bg-[rgba(201,168,76,0.1)]'
                }`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                aria-pressed={isRecording}
              >
                {isRecording ? (
                  <div className="w-4 h-4 rounded-sm bg-[#c87c6a]" aria-hidden="true"/>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gold" aria-hidden="true"/>
                )}
                {isRecording && (
                  <div
                    className="absolute inset-0 rounded-full border-2 border-[#c87c6a] opacity-50"
                    style={{ animation: 'pulseGold 1.5s ease-in-out infinite' }}
                    aria-hidden="true"
                  />
                )}
              </button>
            )}

            {!isRecording && phase === 'ready' && (
              <span className="archival-label text-muted">TAP TO SPEAK</span>
            )}

            {isRecording && (
              <span className="archival-label text-[#c87c6a]">TAP TO STOP · RECORDING</span>
            )}

            {phase === 'done' && (
              <div className="flex items-center gap-4">
                <div className="archival-label text-gold">✓ SAVED TO ARCHIVE</div>
                {questionIdx < ARTHUR_QUESTIONS.length - 1 && (
                  <button
                    onClick={nextQuestion}
                    className="archival-label text-muted hover:text-primary transition-colors duration-300 ml-6"
                  >
                    NEXT QUESTION →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Use demo mode */}
          {phase === 'ready' && (
            <div className="mt-16 flex items-center gap-4">
              <div className="h-px flex-1 bg-[var(--border-subtle)]" aria-hidden="true"/>
              <span className="archival-label text-muted">OR</span>
              <div className="h-px flex-1 bg-[var(--border-subtle)]" aria-hidden="true"/>
            </div>
          )}

          {phase === 'ready' && (
            <button
              onClick={async () => {
                // Start waveform animation first, then await
                setPhase('listening');
                setIsRecording(true);
                await sleep(2500);
                setIsRecording(false);
                setPhase('processing');
                await sleep(1000);
                setTranscript(questionIdx === 0 ? DEMO_WOW_SEQUENCE.transcript : "The memory comes to me clearly now... it was one of those small moments that carries an entire world inside it. My father was there, and the light was particular — that late-afternoon light that only exists in one place you've loved.");
                setPhase('done');
                setHasSpoken(true);
              }}
              className="mt-6 w-full py-4 border border-[var(--border-medium)] text-muted text-[10px] tracking-[0.15em] uppercase font-medium hover:border-[var(--accent-gold-dim)] hover:text-secondary transition-all duration-300"
            >
              Use Demo Voice (Pre-Recorded)
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
