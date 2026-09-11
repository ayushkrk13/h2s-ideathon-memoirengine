'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProblemStatement from '@/components/ProblemStatement';
import WowSequence from '@/components/WowSequence';
import MemoryGraphSection from '@/components/MemoryGraphSection';
import TimelineSection from '@/components/TimelineSection';
import ChapterPreview from '@/components/ChapterPreview';
import PhotoWall from '@/components/PhotoWall';
import BookGeneration from '@/components/BookGeneration';
import PrivacySection from '@/components/PrivacySection';
import FinalCTA from '@/components/FinalCTA';
// Lenis smooth scroll — loaded client-side only
const SmoothScrollProvider = dynamic(() => import('@/components/SmoothScrollProvider'), {
  ssr: false,
});

export default function HomePage() {
  // Scroll-driven background color shift
  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      const progress = Math.min(y / 2000, 1);
      document.documentElement.style.setProperty(
        '--bg-scroll',
        `hsl(${36 - progress * 4}, ${85 - progress * 10}%, ${98 - progress * 4}%)`
      );
      document.documentElement.style.setProperty(
        '--bg-primary',
        `hsl(${36 - progress * 4}, ${85 - progress * 10}%, ${98 - progress * 4}%)`
      );
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
      // Reset on unmount
      document.documentElement.style.removeProperty('--bg-primary');
    };
  }, []);

  return (
    <SmoothScrollProvider>
      <Navigation />
      <main id="main" role="main">
        <HeroSection />
        <ProblemStatement />
        <WowSequence />
        <MemoryGraphSection />
        <TimelineSection />
        <ChapterPreview />
        <PhotoWall />
        <BookGeneration />
        <PrivacySection />
        <FinalCTA />
      </main>
    </SmoothScrollProvider>
  );
}
