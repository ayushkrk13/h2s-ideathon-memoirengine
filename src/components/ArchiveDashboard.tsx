'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useFamilyStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import Link from 'next/link';
import MemoriesTab from '@/components/tabs/MemoriesTab';
import FamilyTreeTab from '@/components/tabs/FamilyTreeTab';
import TimelineTab from '@/components/tabs/TimelineTab';
import ChaptersTab from '@/components/tabs/ChaptersTab';
import AddMemoryModal from '@/components/modals/AddMemoryModal';
import AddMemberModal from '@/components/modals/AddMemberModal';

type Tab = 'memories' | 'family-tree' | 'timeline' | 'chapters';

export default function ArchiveDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const { families, activeFamilyId, setActiveFamily, memoriesCount, membersCount } = useFamilyStore(
    useShallow(s => ({
      families: s.families,
      activeFamilyId: s.activeFamilyId,
      setActiveFamily: s.setActiveFamily,
      memoriesCount: s.memories.filter(m => m.familyId === s.activeFamilyId).length,
      membersCount: s.members.filter(m => m.familyId === s.activeFamilyId).length,
    }))
  );

  const [tab, setTab] = useState<Tab>('memories');
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeFamily = families.find(f => f.id === activeFamilyId);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'memories', label: 'Memories',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    },
    {
      id: 'family-tree', label: 'Family Tree',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3a2 2 0 104 0 2 2 0 00-4 0zm6 9a2 2 0 104 0 2 2 0 00-4 0zm-6 5a2 2 0 104 0 2 2 0 00-4 0zm6-5V7M8 7v4M8 7H5m11 5h-3"/></svg>,
    },
    {
      id: 'timeline', label: 'Timeline',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7"/></svg>,
    },
    {
      id: 'chapters', label: 'Chapters',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13"/></svg>,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-white/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="2" fill="var(--accent-amber)" />
              <line x1="14" y1="14" x2="14" y2="4" stroke="var(--accent-amber)" strokeWidth="1.2" opacity="0.8" />
              <line x1="14" y1="14" x2="7" y2="7" stroke="var(--accent-amber)" strokeWidth="1" opacity="0.6" />
              <line x1="14" y1="14" x2="21" y2="7" stroke="var(--accent-amber)" strokeWidth="1" opacity="0.6" />
            </svg>
            <span className="font-medium text-primary text-sm hidden sm:block" style={{ fontFamily: 'var(--font-display)' }}>MemoirEngine</span>
          </Link>

          {/* Family selector */}
          {families.length > 0 && (
            <select
              value={activeFamilyId ?? ''}
              onChange={e => setActiveFamily(e.target.value)}
              className="text-sm py-1.5 px-3 rounded-lg"
              style={{ width: 'auto', maxWidth: 200 }}
              aria-label="Switch family archive"
            >
              {families.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowAddMember(true)}
              className="btn-secondary text-xs py-2 px-3 hidden sm:flex"
              aria-label="Add family member"
            >
              + Member
            </button>
            <button
              onClick={() => setShowAddMemory(true)}
              className="btn-primary text-xs py-2 px-4"
              aria-label="Add a new memory"
            >
              + Memory
            </button>
            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-1"
                style={{ background: 'var(--accent-amber-bg)', color: 'var(--accent-amber)', border: '1.5px solid var(--accent-amber)' }}
                aria-label="User menu"
                aria-expanded={menuOpen}
              >
                {user?.name.slice(0, 2).toUpperCase()}
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-10 w-52 rounded-xl shadow-[var(--shadow-lg)] border border-[var(--border-subtle)] bg-white z-50 py-2"
                  role="menu"
                >
                  <div className="px-4 py-2 border-b border-[var(--border-subtle)]">
                    <div className="text-sm font-medium text-primary">{user?.name}</div>
                    <div className="text-xs text-muted">{user?.email}</div>
                  </div>
                  <Link href="/explore" className="flex items-center gap-2 px-4 py-2.5 text-sm text-secondary hover:bg-[var(--bg-secondary)] transition-colors" role="menuitem">
                    🌍 Explore Public Families
                  </Link>
                  <Link href="/interview" className="flex items-center gap-2 px-4 py-2.5 text-sm text-secondary hover:bg-[var(--bg-secondary)] transition-colors" role="menuitem">
                    🎙 Voice Interview
                  </Link>
                  <button
                    onClick={() => { logout(); router.push('/'); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--accent-rose)] hover:bg-[var(--accent-rose-bg)] transition-colors"
                    role="menuitem"
                  >
                    ← Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* No family state */}
      {!activeFamily && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
          <div className="text-5xl">🌳</div>
          <h2 className="font-display text-2xl font-medium text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            Start your family archive
          </h2>
          <p className="text-secondary text-base max-w-sm">
            Create your first family archive to begin adding memories, building your family tree and preserving stories.
          </p>
          <CreateFamilyInline />
        </div>
      )}

      {activeFamily && (
        <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6">
          {/* Archive header */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="font-display text-2xl font-medium text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                {activeFamily.name}
              </h1>
              {activeFamily.tagline && (
                <p className="text-secondary text-sm mt-1">{activeFamily.tagline}</p>
              )}
              <div className="flex gap-3 mt-3">
                <span className="badge badge-amber">{memoriesCount} memories</span>
                <span className="badge badge-muted">{membersCount} members</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/interview" className="btn-secondary text-xs py-2 px-4">
                🎙 Record Interview
              </Link>
              <Link href={`/family/${activeFamily.id}/book`} className="btn-secondary text-xs py-2 px-4 hidden sm:flex">
                📖 Generate Book
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1" role="tablist">
            {TABS.map(t => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`pill-tab flex items-center gap-2 ${tab === t.id ? 'pill-tab-active' : 'pill-tab-inactive'}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Tab content — all rendered, only visible one shown, avoids re-mount */}
          <div className="flex-1">
            <div role="tabpanel" aria-label="memories" className={tab === 'memories' ? '' : 'hidden'}>
              <MemoriesTab onAddMemory={() => setShowAddMemory(true)} />
            </div>
            <div role="tabpanel" aria-label="family-tree" className={tab === 'family-tree' ? '' : 'hidden'}>
              <FamilyTreeTab onAddMember={() => setShowAddMember(true)} />
            </div>
            <div role="tabpanel" aria-label="timeline" className={tab === 'timeline' ? '' : 'hidden'}>
              <TimelineTab />
            </div>
            <div role="tabpanel" aria-label="chapters" className={tab === 'chapters' ? '' : 'hidden'}>
              <ChaptersTab />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddMemory && <AddMemoryModal onClose={() => setShowAddMemory(false)} />}
      {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} />}

      {/* Click-away for menu */}
      {menuOpen && <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
    </div>
  );
}

function CreateFamilyInline() {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();
  const addFamily = useFamilyStore(s => s.addFamily);
  const setActiveFamily = useFamilyStore(s => s.setActiveFamily);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    const family = addFamily({
      name: name.trim(),
      tagline: '',
      ownerId: user!.id,
      memberIds: [user!.id],
      isPublic: false,
    });
    setActiveFamily(family.id);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleCreate} className="flex gap-3 w-full max-w-sm">
      <input placeholder="e.g. The Mehta Family" value={name} onChange={e => setName(e.target.value)} />
      <button type="submit" disabled={submitting} className="btn-primary text-sm flex-shrink-0 py-2.5">
        {submitting ? '...' : 'Create'}
      </button>
    </form>
  );
}
