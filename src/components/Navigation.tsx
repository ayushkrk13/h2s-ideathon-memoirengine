'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

const NAV_ITEMS = [
  { label: 'Explore', href: '/explore' },
  { label: 'Archive', href: '#timeline' },
  { label: 'Memories', href: '#wow-sequence' },
  { label: 'Chapters', href: '#chapters' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-[var(--border-subtle)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="MemoirEngine home">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="2" fill="var(--accent-amber)" />
            <line x1="14" y1="14" x2="14" y2="4" stroke="var(--accent-amber)" strokeWidth="1.2" opacity="0.8" />
            <line x1="14" y1="14" x2="7" y2="7" stroke="var(--accent-amber)" strokeWidth="1" opacity="0.6" />
            <line x1="14" y1="14" x2="21" y2="7" stroke="var(--accent-amber)" strokeWidth="1" opacity="0.6" />
            <line x1="14" y1="14" x2="5" y2="18" stroke="var(--accent-amber)" strokeWidth="1" opacity="0.45" />
            <line x1="14" y1="14" x2="23" y2="18" stroke="var(--accent-amber)" strokeWidth="1" opacity="0.45" />
            <circle cx="14" cy="4" r="1.5" fill="var(--accent-amber)" opacity="0.7" />
            <circle cx="7" cy="7" r="1.5" fill="var(--accent-amber)" opacity="0.55" />
            <circle cx="21" cy="7" r="1.5" fill="var(--accent-amber)" opacity="0.55" />
          </svg>
          <span
            className="text-[14px] font-semibold text-primary group-hover:text-amber transition-colors duration-200"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
          >
            MemoirEngine
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/archive" className="btn-primary text-xs py-2 px-4">
              My Archive →
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-secondary hover:text-primary text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/login" className="btn-primary text-xs py-2 px-4">
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-0.5 rounded bg-primary transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 rounded bg-primary transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 rounded bg-primary transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[var(--border-subtle)] px-5 py-5 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="py-2.5 text-sm font-medium text-secondary hover:text-primary border-b border-[var(--border-subtle)] last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-2 mt-3">
            <Link href="/login" className="btn-secondary flex-1 justify-center text-sm py-2.5" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link href="/login" className="btn-primary flex-1 justify-center text-sm py-2.5" onClick={() => setMenuOpen(false)}>Start Free</Link>
          </div>
        </div>
      )}
    </header>
  );
}
