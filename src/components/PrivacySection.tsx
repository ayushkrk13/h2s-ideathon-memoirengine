'use client';

import { useRef, useEffect, useState } from 'react';

export default function PrivacySection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const pillars = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6L12 2z" stroke="var(--accent-gold)" strokeWidth="1" fill="none"/>
          <path d="M9 12l2 2 4-4" stroke="var(--accent-gold)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Source Provenance',
      body: 'Every generated word traces back to a specific timestamp in the original recording. Nothing is fabricated.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--accent-gold)" strokeWidth="1" fill="none"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="var(--accent-gold)" strokeWidth="1" strokeLinecap="round" fill="none"/>
          <circle cx="12" cy="16" r="1.5" fill="var(--accent-gold)" opacity="0.7"/>
        </svg>
      ),
      title: 'Private by Default',
      body: 'Your archive is private. You choose what to share, with whom, and when. Family data never trains AI models.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2a8 8 0 1 0 0 16A8 8 0 0 0 12 2z" stroke="var(--accent-gold)" strokeWidth="1" fill="none"/>
          <path d="M12 6v6l4 2" stroke="var(--accent-gold)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Always Original',
      body: 'The original voice recording is preserved alongside every AI-generated text. The voice is the truth.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="var(--accent-gold)" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <circle cx="9" cy="7" r="4" stroke="var(--accent-gold)" strokeWidth="1" fill="none"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="var(--accent-gold)" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="var(--accent-gold)" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Family Collaboration',
      body: 'Invite family members to contribute their own memories to the same living archive.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="privacy"
      className="relative py-32 px-6"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div
          className={`text-center mb-20 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="archival-label mb-6" style={{ letterSpacing: '0.25em' }}>TRUST & PROVENANCE</div>
          <h2
            className="font-display text-4xl md:text-5xl font-light text-primary"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
          >
            Memory deserves{' '}
            <em className="text-gold not-italic">honesty.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[var(--border-subtle)]">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className={`p-10 border-r last:border-r-0 border-[var(--border-subtle)] border-b md:border-b-0 transition-all duration-1000 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-6">{pillar.icon}</div>
              <h3
                className="text-primary text-base font-medium mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {pillar.title}
              </h3>
              <p className="text-secondary text-sm leading-[1.75]">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
