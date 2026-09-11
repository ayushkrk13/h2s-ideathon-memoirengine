'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useFamilyStore } from '@/lib/store';
import TreeWatermark from '@/components/TreeWatermark';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { addFamily, setActiveFamily } = useFamilyStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (tab === 'signup' && !name) { setError('Please enter your name.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    const user = {
      id: Math.random().toString(36).slice(2),
      name: tab === 'signup' ? name : email.split('@')[0],
      email,
      createdAt: new Date().toISOString(),
    };

    // If signing up, create a default family archive
    if (tab === 'signup') {
      const family = addFamily({
        name: `The ${name.split(' ').pop()} Family`,
        tagline: 'A living archive — just getting started.',
        ownerId: user.id,
        memberIds: [user.id],
        isPublic: false,
      });
      setActiveFamily(family.id);
    }

    login(user);
    setLoading(false);
    router.push('/archive');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left panel — brand */}
      <div
        className="hidden lg:flex flex-col justify-between w-[44%] p-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1c1410 0%, #2d1f12 50%, #3d2a18 100%)' }}
      >
        <TreeWatermark side="right" opacity={0.07} scale={0.9} />
        <Link href="/" className="flex items-center gap-3">
          <LogoIcon color="#d97706" />
          <span className="text-white text-[15px] font-medium" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>MemoirEngine</span>
        </Link>

        <div>
          <h1
            className="text-white text-4xl xl:text-5xl font-light leading-[1.2]"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
          >
            Every family has<br />
            <em className="not-italic" style={{ color: '#fbbf24' }}>a story worth</em><br />
            preserving.
          </h1>
          <p className="mt-8 text-[rgba(255,255,255,0.55)] text-base leading-[1.8]" style={{ fontFamily: 'var(--font-display)' }}>
            MemoirEngine captures voices, moments and relationships — and turns them into a living archive your family can explore for generations.
          </p>
          <div className="mt-12 flex flex-col gap-4">
            {[
              { n: '10,000+', l: 'memories preserved' },
              { n: '2,400+', l: 'families using MemoirEngine' },
              { n: '98%', l: 'said it brought them closer' },
            ].map(s => (
              <div key={s.n} className="flex items-center gap-4">
                <span style={{ fontFamily: 'var(--font-display)', color: '#fbbf24', fontSize: 24, fontWeight: 300 }}>{s.n}</span>
                <span className="text-[rgba(255,255,255,0.45)] text-sm">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[rgba(255,255,255,0.25)] text-xs" style={{ letterSpacing: '0.1em' }}>
          © 2024 MEMOIRENGINE
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <LogoIcon color="var(--accent-amber)" />
            <span className="font-display font-medium text-primary text-sm">MemoirEngine</span>
          </Link>

          {/* Tabs */}
          <div className="flex gap-0 mb-10 border-b border-[var(--border-subtle)]">
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`pb-4 pr-8 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${
                  tab === t
                    ? 'text-amber border-[var(--accent-amber)]'
                    : 'text-secondary border-transparent hover:text-primary'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {tab === 'signup' && (
              <div>
                <label className="field-label">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Mehta"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="field-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[var(--accent-rose-bg)] text-[var(--accent-rose)] text-sm border border-[rgba(190,74,58,0.2)]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center mt-2 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {tab === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                tab === 'login' ? 'Sign In to Archive' : 'Create My Archive'
              )}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              <span className="text-muted text-xs">or</span>
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            </div>

            <button
              type="button"
              onClick={() => {
                const demoUser = { id: 'demo-' + Date.now(), name: 'Guest Explorer', email: 'guest@memoirengine.com', createdAt: new Date().toISOString() };
                const family = addFamily({ name: 'My Family Archive', tagline: 'A living archive.', ownerId: demoUser.id, memberIds: [demoUser.id], isPublic: false });
                setActiveFamily(family.id);
                login(demoUser);
                router.push('/archive');
              }}
              className="btn-secondary justify-center text-sm"
            >
              Continue as Guest
            </button>
          </form>

          <p className="mt-8 text-center text-muted text-xs leading-[1.7]">
            By continuing, you agree to our Terms of Service.<br />
            Your family data is private and never used to train AI.
          </p>
        </div>
      </div>
    </div>
  );
}

function LogoIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="2" fill={color} />
      <line x1="14" y1="14" x2="14" y2="4" stroke={color} strokeWidth="1.2" opacity="0.8" />
      <line x1="14" y1="14" x2="7" y2="7" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="14" y1="14" x2="21" y2="7" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="14" y1="14" x2="5" y2="18" stroke={color} strokeWidth="1" opacity="0.45" />
      <line x1="14" y1="14" x2="23" y2="18" stroke={color} strokeWidth="1" opacity="0.45" />
      <circle cx="14" cy="4" r="1.5" fill={color} opacity="0.7" />
      <circle cx="7" cy="7" r="1.5" fill={color} opacity="0.55" />
      <circle cx="21" cy="7" r="1.5" fill={color} opacity="0.55" />
    </svg>
  );
}
