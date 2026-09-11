'use client';
import { PUBLIC_FAMILIES } from '@/lib/publicData';
import Navigation from '@/components/Navigation';
import TreeWatermark from '@/components/TreeWatermark';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PublicFamilyPage() {
  const params = useParams();
  const family = PUBLIC_FAMILIES.find(f => f.id === params.id);

  if (!family) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navigation />
        <div className="flex items-center justify-center pt-40 flex-col gap-4">
          <div className="font-display text-2xl text-primary">Family archive not found.</div>
          <Link href="/explore" className="btn-secondary text-sm">← Back to Explore</Link>
        </div>
      </div>
    );
  }

  // Simulate 3 chapters for the public family
  const chapters = [
    { title: 'The Roots', years: `${parseInt(family.years) } — ${parseInt(family.years) + 20}`, mems: Math.floor(family.memoryCount * 0.3) },
    { title: 'The Journey', years: `${parseInt(family.years) + 20} — ${parseInt(family.years) + 45}`, mems: Math.floor(family.memoryCount * 0.4) },
    { title: 'The Legacy', years: `${parseInt(family.years) + 45} — Present`, mems: Math.floor(family.memoryCount * 0.3) },
  ];

  // Simulate timeline milestones
  const milestones = [
    { year: parseInt(family.years), label: 'Family archive begins', type: 'defining' },
    { year: parseInt(family.years) + 8, label: family.featuredMemory, type: 'major' },
    { year: parseInt(family.years) + 20, label: 'Second generation', type: 'major' },
    { year: parseInt(family.years) + 38, label: 'Migration', type: 'defining' },
    { year: parseInt(family.years) + 55, label: 'Third generation', type: 'major' },
    { year: 2024, label: 'Archive continues', type: 'milestone' },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <TreeWatermark side="right" opacity={0.038} scale={0.95} />
      <Navigation />

      {/* Hero */}
      <div
        className="pt-24 pb-16 px-6"
        style={{ background: family.coverGradient, borderBottom: `1px solid var(--border-subtle)` }}
      >
        <div className="max-w-[900px] mx-auto">
          <Link href="/explore" className="label hover:text-primary transition-colors mb-6 inline-flex items-center gap-1">
            ← ALL FAMILIES
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-6 mt-4">
            <div>
              <h1
                className="font-display text-4xl md:text-5xl font-light text-primary leading-[1.1]"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
              >
                {family.name}
              </h1>
              <p className="mt-3 text-secondary text-lg" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                {family.tagline}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="badge badge-amber">{family.years}</span>
                <span className="badge badge-muted">{family.location}</span>
                <span className="badge badge-green">{family.memoryCount} memories</span>
                <span className="badge badge-indigo">{family.memberCount} family members</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-16">
        {/* Featured memory */}
        <div className="memory-card mb-12">
          <div className="label mb-3 text-amber">FEATURED MEMORY</div>
          <h2 className="font-display text-2xl font-medium text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {family.featuredMemory}
          </h2>
          <div className="text-muted text-sm mb-5">{family.featuredYear} · {family.location.split('→')[0].trim()}</div>
          <p className="text-secondary text-sm leading-[1.9]" style={{ fontFamily: 'var(--font-display)' }}>
            This memory was shared by a member of {family.name}. It captures a moment that the family has chosen to preserve and share publicly as part of their living archive.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="entity-chip entity-year">{family.featuredYear}</span>
            <span className="entity-chip entity-place">{family.location.split('→')[0].trim()}</span>
            <span className="entity-chip entity-emotion">Nostalgia</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <div className="label mb-6">FAMILY TIMELINE</div>
          <div className="relative border-l-2 border-[var(--border-subtle)] pl-8 flex flex-col gap-8">
            {milestones.map((m, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[41px] ${m.type === 'defining' ? 'timeline-node large' : 'timeline-node'}`} aria-hidden="true" />
                <div className="label mb-1">{m.year}</div>
                <div className="text-primary text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div className="mb-12">
          <div className="label mb-6">CHAPTERS</div>
          <div className="flex flex-col gap-4">
            {chapters.map((ch, i) => (
              <div key={i} className="card flex items-center justify-between">
                <div>
                  <div className="font-display text-lg font-medium text-primary mb-1" style={{ fontFamily: 'var(--font-display)' }}>{ch.title}</div>
                  <div className="label">{ch.years} · {ch.mems} memories</div>
                </div>
                <button className="btn-secondary text-xs py-2 px-4">Read Chapter</button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to start your own */}
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, var(--accent-amber-bg) 0%, var(--bg-secondary) 100%)', border: '1.5px solid var(--border-subtle)' }}
        >
          <div className="font-display text-xl font-medium text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Inspired? Start your family&apos;s archive.
          </div>
          <p className="text-secondary text-sm mb-6">Your family has stories too. It takes only one voice to begin.</p>
          <Link href="/login" className="btn-primary">Begin My Family Archive</Link>
        </div>
      </div>
    </div>
  );
}
