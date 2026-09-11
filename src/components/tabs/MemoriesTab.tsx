'use client';
import { useFamilyStore } from '@/lib/store';
import type { Memory } from '@/lib/store';
import { useState, useMemo } from 'react';

export default function MemoriesTab({ onAddMemory }: { onAddMemory: () => void }) {
  // Read only primitives from store — no arrays in selectors
  const activeFamilyId = useFamilyStore(s => s.activeFamilyId);
  const allMemories = useFamilyStore(s => s.memories);
  const allMembers  = useFamilyStore(s => s.members);
  const removeMemory = useFamilyStore(s => s.removeMemory);

  // Derive in useMemo — only recalculates when source data changes
  const memories = useMemo(
    () => allMemories
      .filter(m => m.familyId === activeFamilyId)
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
    [allMemories, activeFamilyId]
  );

  const members = useMemo(
    () => allMembers.filter(m => m.familyId === activeFamilyId),
    [allMembers, activeFamilyId]
  );

  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(
    () => memories.filter(m =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.transcript.toLowerCase().includes(search.toLowerCase()) ||
      (m.location ?? '').toLowerCase().includes(search.toLowerCase())
    ),
    [memories, search]
  );

  const getMemberName = (id: string) => allMembers.find(m => m.id === id)?.name ?? id;

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--accent-amber-bg)' }}>🎙</div>
        <div>
          <div className="font-display text-xl font-medium text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>No memories yet</div>
          <p className="text-secondary text-sm max-w-sm">Start by recording a voice memory or typing one in. Every story matters.</p>
        </div>
        <button onClick={onAddMemory} className="btn-primary">Add Your First Memory</button>
        <div className="text-muted text-xs">or</div>
        <a href="/interview" className="btn-secondary text-sm">🎙 Start Voice Interview with Arthur</a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 20 20" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <input
            style={{ paddingLeft: 38 }}
            type="search"
            placeholder="Search memories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="label ml-auto">{filtered.length} MEMORIES</div>
        <button onClick={onAddMemory} className="btn-primary text-xs py-2 px-4">+ Add Memory</button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(mem => (
          <MemoryCard
            key={mem.id}
            memory={mem}
            expanded={expanded === mem.id}
            onToggle={() => setExpanded(expanded === mem.id ? null : mem.id)}
            onDelete={() => {
              if (window.confirm(`Delete "${mem.title}"? This cannot be undone.`)) {
                removeMemory(mem.id);
                if (expanded === mem.id) setExpanded(null);
              }
            }}
            getMemberName={getMemberName}
          />
        ))}
      </div>

      {filtered.length === 0 && search && (
        <div className="text-center py-16 text-muted">No memories match &ldquo;{search}&rdquo;</div>
      )}
    </div>
  );
}

function MemoryCard({
  memory, expanded, onToggle, onDelete, getMemberName,
}: {
  memory: Memory;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  getMemberName: (id: string) => string;
}) {
  return (
    <div className="memory-card">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="label mb-1">
            {memory.year ? memory.year : memory.yearApprox ?? 'No date'}{memory.location ? ` · ${memory.location}` : ''}
          </div>
          <h3 className="font-display text-base font-semibold text-primary leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {memory.title}
          </h3>
        </div>
        {!memory.isPublic && (
          <span className="badge badge-muted flex-shrink-0" style={{ fontSize: 9 }}>PRIVATE</span>
        )}
      </div>

      {(memory.people.length > 0 || memory.peopleFreeText.length > 0) && (
        <div className="flex flex-wrap gap-1 mb-3">
          {memory.people.map(id => (
            <span key={id} className="entity-chip entity-person">{getMemberName(id)}</span>
          ))}
          {memory.peopleFreeText.map(p => (
            <span key={p} className="entity-chip entity-person">{p}</span>
          ))}
        </div>
      )}

      {/* Photo thumbnails */}
      {memory.photoUrls.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {memory.photoUrls.slice(0, 3).map((url, i) => (
            <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-[var(--border-subtle)]" />
          ))}
          {memory.photoUrls.length > 3 && (
            <div className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-medium text-muted border border-[var(--border-subtle)]"
              style={{ background: 'var(--bg-secondary)' }}>
              +{memory.photoUrls.length - 3}
            </div>
          )}
        </div>
      )}

      <p className={`text-secondary text-sm leading-[1.7] ${expanded ? '' : 'line-clamp-3'}`}
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
        &ldquo;{memory.transcript}&rdquo;
      </p>

      {expanded && (memory.objects.length > 0 || memory.emotions.length > 0 || memory.places.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1">
          {memory.places.map(p => <span key={p} className="entity-chip entity-place">{p}</span>)}
          {memory.objects.map(o => <span key={o} className="entity-chip entity-object">{o}</span>)}
          {memory.emotions.map(e => <span key={e} className="entity-chip entity-emotion">{e}</span>)}
        </div>
      )}

      {expanded && memory.prose && (
        <div className="mt-4 p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
          <div className="label mb-2">MEMOIR PROSE</div>
          <p className="text-primary text-sm leading-[1.8]" style={{ fontFamily: 'var(--font-display)' }}>
            {memory.prose.slice(0, 400)}...
          </p>
        </div>
      )}

      {expanded && memory.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {memory.tags.map(t => <span key={t} className="badge badge-muted text-xs">{t}</span>)}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <button onClick={onToggle} className="text-xs font-medium text-amber hover:underline">
          {expanded ? '▲ Show less' : '▼ Read more'}
        </button>
        <button onClick={onDelete} className="text-xs text-muted hover:text-[var(--accent-rose)] transition-colors" aria-label="Delete memory">
          Delete
        </button>
      </div>
    </div>
  );
}
