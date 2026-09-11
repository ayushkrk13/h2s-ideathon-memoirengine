'use client';
import { PUBLIC_FAMILIES } from '@/lib/publicData';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import TreeWatermark from '@/components/TreeWatermark';
import { useState, useRef, useEffect } from 'react';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => { setVisible(true); }, []);

  const filtered = PUBLIC_FAMILIES.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.tagline.toLowerCase().includes(search.toLowerCase()) ||
    f.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <TreeWatermark side="right" opacity={0.04} scale={0.9} />
      <Navigation />

      {/* Hero */}
      <div
        className="pt-32 pb-20 px-6 text-center"
        style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}
      >
        <div className="label mb-4">PUBLIC ARCHIVES</div>
        <h1
          className="font-display text-4xl md:text-6xl font-light text-primary leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
        >
          Browse Family<br />
          <em className="not-italic text-amber">Biographies</em>
        </h1>
        <p className="text-secondary text-lg max-w-xl mx-auto mb-10" style={{ fontFamily: 'var(--font-display)' }}>
          Families who have chosen to share their stories publicly. Read, be moved, be inspired.
        </p>

        {/* Search */}
        <div className="max-w-lg mx-auto relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 20 20" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <input
            style={{ paddingLeft: 44 }}
            type="search"
            placeholder="Search by family name, location, era..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search family archives"
          />
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-[1300px] mx-auto px-6 pb-24" aria-label="Family archive listings">
        <div className="mb-8 flex items-center justify-between">
          <div className="label">{filtered.length} FAMILIES</div>
          <div className="label text-amber">PUBLICLY SHARED</div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((family, i) => (
            <div
              key={family.id}
              className="card group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
              style={{
                animationDelay: `${i * 60}ms`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(16px)',
                transition: `opacity 0.5s ${i * 0.05}s, transform 0.5s ${i * 0.05}s`,
              }}
              role="article"
            >
              {/* Cover gradient */}
              <div
                className="h-28 rounded-lg mb-5 flex items-end p-4"
                style={{ background: family.coverGradient }}
              >
                <div className="label text-xs" style={{ color: family.accentColor }}>
                  {family.years}
                </div>
              </div>

              <h2 className="font-display text-xl font-medium text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {family.name}
              </h2>
              <p className="text-secondary text-sm leading-[1.6] mb-4">
                {family.tagline}
              </p>

              <div className="flex items-center gap-2 text-muted text-xs mb-5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 2C5.8 2 4 3.8 4 6c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z"/>
                  <circle cx="8" cy="6" r="1.5" strokeWidth={1.5}/>
                </svg>
                <span>{family.location}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex gap-3">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-primary">{family.memoryCount}</div>
                    <div className="label" style={{ fontSize: 9 }}>MEMORIES</div>
                  </div>
                  <div className="w-px bg-[var(--border-subtle)]" />
                  <div className="text-center">
                    <div className="text-sm font-semibold text-primary">{family.memberCount}</div>
                    <div className="label" style={{ fontSize: 9 }}>MEMBERS</div>
                  </div>
                </div>
                <Link
                  href={`/family/${family.id}`}
                  className="text-xs font-medium flex items-center gap-1 transition-colors duration-200"
                  style={{ color: family.accentColor }}
                  aria-label={`Explore ${family.name}`}
                >
                  Explore
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 14 14" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h8M7 3l4 4-4 4" />
                  </svg>
                </Link>
              </div>

              {/* Featured memory */}
              <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div className="label mb-1" style={{ fontSize: 9 }}>FEATURED MEMORY</div>
                <div className="text-xs text-secondary" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                  "{family.featuredMemory}" · {family.featuredYear}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-muted">
            <div className="text-4xl mb-4">🌳</div>
            <div className="font-display text-lg">No families match your search.</div>
          </div>
        )}
      </main>
    </div>
  );
}
