import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function formatYear(year: number): string {
  return year.toString();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateWaveformBars(count: number, amplitude: number[]): number[] {
  return Array.from({ length: count }, (_, i) => {
    const base = amplitude[i % amplitude.length] || 0.5;
    return base;
  });
}

// Simulate typing effect
export async function* typewriter(text: string, speed = 30): AsyncGenerator<string> {
  let current = '';
  for (const char of text) {
    current += char;
    yield current;
    await sleep(speed);
  }
}
