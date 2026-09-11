'use client';

import { useState, useEffect, useRef } from 'react';
import { useFamilyStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';

interface Photo {
  id: string;
  year: number;
  location: string;
  caption: string;
  people: string[];
  width: number;
  height: number;
  bgColor: string;
  tone: string;
}

const DEMO_PHOTOS: Photo[] = [
  { id: 'p1', year: 1955, location: 'Varanasi', caption: 'At school, Standard VII', people: ['Ramesh'], width: 220, height: 280, bgColor: '#1c1a16', tone: '#8a7a5a' },
  { id: 'p2', year: 1963, location: 'Varanasi Station', caption: 'The morning of departure', people: ['Ramesh', 'Father'], width: 260, height: 200, bgColor: '#18161200', tone: '#7a6a4a' },
  { id: 'p3', year: 1968, location: 'Allahabad', caption: 'University grounds', people: ['Ramesh', 'Savitri'], width: 240, height: 300, bgColor: '#1a1812', tone: '#6a5a3a' },
  { id: 'p4', year: 1970, location: 'Allahabad', caption: 'Wedding day', people: ['Ramesh', 'Savitri'], width: 280, height: 220, bgColor: '#1c1a10', tone: '#c9a84c' },
  { id: 'p5', year: 1975, location: 'Lucknow', caption: 'Priya, first week', people: ['Savitri', 'Priya'], width: 200, height: 260, bgColor: '#18171500', tone: '#8a7060' },
  { id: 'p6', year: 1983, location: 'Mumbai', caption: 'First day in the new flat', people: ['Ramesh', 'Savitri', 'Priya'], width: 300, height: 220, bgColor: '#1a1810', tone: '#7a6a4a' },
  { id: 'p7', year: 1990, location: 'Mumbai', caption: 'School ceremony, Principal', people: ['Ramesh'], width: 220, height: 280, bgColor: '#1c1a12', tone: '#c9a84c' },
  { id: 'p8', year: 2000, location: 'Mumbai', caption: 'Ananya, one day old', people: ['Priya', 'Ananya', 'Ramesh'], width: 260, height: 200, bgColor: '#18151200', tone: '#a08060' },
];

export default function PhotoWall() {
  const [developing, setDeveloping] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Pull real uploaded photos — useShallow prevents infinite loop from new array refs
  const uploadedPhotos = useFamilyStore(
    useShallow(s =>
      s.memories.flatMap(m =>
        m.photoUrls.map((url, i) => ({
          id: `mem-${m.id}-${i}`,
          year: m.year ?? 0,
          location: m.location ?? '',
          caption: m.title,
          url,
          isReal: true,
        }))
      ).slice(0, 8)
    )
  );

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Trigger development effect staggered
          DEMO_PHOTOS.forEach((photo, i) => {
            setTimeout(() => {
              setDeveloping(prev => new Set([...prev, photo.id]));
              setTimeout(() => {
                setRevealed(prev => new Set([...prev, photo.id]));
              }, 800);
            }, i * 200);
          });
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="photos"
      className="relative py-32 px-6"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div
          className={`mb-20 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="archival-label mb-6" style={{ letterSpacing: '0.25em' }}>
            THE PHOTOGRAPHS
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-light text-primary"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
          >
            Every photograph holds{' '}
            <em className="text-gold not-italic">a thousand words</em>
            <br />
            you haven&apos;t said yet.
          </h2>
        </div>

        {/* Real uploaded photos — shown first if present */}
        {uploadedPhotos.length > 0 && (
          <div className="mb-12">
            <div className="archival-label mb-4">YOUR UPLOADED PHOTOS</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {uploadedPhotos.map(photo => (
                <div
                  key={photo.id}
                  className="relative group cursor-pointer"
                  style={{ aspectRatio: '4/3' }}
                  onMouseEnter={() => setHoveredPhoto(photo.id)}
                  onMouseLeave={() => setHoveredPhoto(null)}
                >
                  <div className="photo-artifact w-full h-full overflow-hidden rounded-lg">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className={`absolute inset-0 flex flex-col justify-end p-3 transition-all duration-300 rounded-lg ${hoveredPhoto === photo.id ? 'opacity-100' : 'opacity-0'}`}
                      style={{ background: 'linear-gradient(to top, rgba(15,14,12,0.9) 0%, transparent 60%)' }}
                    >
                      <div className="archival-label mb-1">
                        {photo.year > 0 ? `${photo.year} · ` : ''}{photo.location}
                      </div>
                      <div className="text-primary text-xs" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                        {photo.caption}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo photo wall — masonry-like grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-200 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          role="list"
          aria-label="Family photograph archive"
        >
          {DEMO_PHOTOS.map((photo, i) => {
            const isDeveloping = developing.has(photo.id);
            const isRevealed = revealed.has(photo.id);
            const isHovered = hoveredPhoto === photo.id;

            return (
              <div
                key={photo.id}
                role="listitem"
                className={`relative cursor-pointer group transition-all duration-300 ${
                  i % 3 === 0 ? 'row-span-2' : ''
                }`}
                style={{
                  aspectRatio: i % 3 === 0 ? '3/4' : '4/3',
                }}
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
                tabIndex={0}
                onFocus={() => setHoveredPhoto(photo.id)}
                onBlur={() => setHoveredPhoto(null)}
                aria-label={`${photo.caption}, ${photo.year}, ${photo.location}`}
              >
                {/* Photo container */}
                <div className="photo-artifact w-full h-full overflow-hidden">
                  {/* Simulated photo content — sepia-toned abstract */}
                  <div
                    className="w-full h-full transition-all duration-700"
                    style={{
                      background: `
                        radial-gradient(ellipse at ${30 + i * 7}% ${40 + i * 5}%, ${photo.tone}40 0%, transparent 50%),
                        radial-gradient(ellipse at ${70 - i * 5}% ${60 + i * 3}%, ${photo.tone}20 0%, transparent 50%),
                        ${photo.bgColor}
                      `,
                      filter: isDeveloping
                        ? isRevealed ? 'none' : 'blur(4px) brightness(0.5)'
                        : 'blur(6px) brightness(0.2)',
                      transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >
                    {/* Film grain texture */}
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
                      }}
                      aria-hidden="true"
                    />
                    {/* Silhouette shapes to suggest human figures */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid slice"
                      aria-hidden="true"
                    >
                      {photo.people.length > 0 && (
                        <ellipse cx="50" cy="75" rx="25" ry="30" fill={`${photo.tone}30`}/>
                      )}
                      {photo.people.length > 1 && (
                        <ellipse cx="25" cy="75" rx="15" ry="20" fill={`${photo.tone}20`}/>
                      )}
                      <circle cx="50" cy="30" r="12" fill={`${photo.tone}25`}/>
                    </svg>
                  </div>

                  {/* Developing effect overlay */}
                  {!isRevealed && (
                    <div
                      className="absolute inset-0 bg-[var(--bg-surface)]"
                      style={{
                        opacity: isDeveloping ? 0 : 1,
                        transition: 'opacity 0.8s ease-out',
                      }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Photo info overlay on hover */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background: 'linear-gradient(to top, rgba(15,14,12,0.9) 0%, transparent 60%)',
                    }}
                  >
                    <div className="archival-label mb-1">
                      {photo.year} · {photo.location}
                    </div>
                    <div
                      className="text-primary text-sm"
                      style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
                    >
                      {photo.caption}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {photo.people.map(p => (
                        <span key={p} className="entity-chip entity-person" style={{ fontSize: '9px', padding: '2px 8px' }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Developing indicator */}
                  {isDeveloping && !isRevealed && (
                    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                      <div className="archival-label animate-pulse-gold">DEVELOPING</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Caption below */}
        <div
          className={`mt-16 text-center transition-all duration-1000 delay-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p
            className="text-secondary text-lg font-light"
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
          >
            Upload a photograph. Arthur will ask what it remembers.
          </p>
        </div>
      </div>
    </section>
  );
}
