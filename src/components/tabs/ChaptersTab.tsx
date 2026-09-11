'use client';
import { useFamilyStore } from '@/lib/store';
import { useState, useMemo } from 'react';

export default function ChaptersTab() {
  const activeFamilyId = useFamilyStore(s => s.activeFamilyId);
  const allChapters    = useFamilyStore(s => s.chapters);
  const allMemories    = useFamilyStore(s => s.memories);
  const addChapter     = useFamilyStore(s => s.addChapter);
  const updateChapter  = useFamilyStore(s => s.updateChapter);

  const chapters = useMemo(
    () => allChapters.filter(c => c.familyId === activeFamilyId),
    [allChapters, activeFamilyId]
  );

  const memories = useMemo(
    () => allMemories.filter(m => m.familyId === activeFamilyId),
    [allMemories, activeFamilyId]
  );

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', yearStart: '', yearEnd: '', location: '', prose: '' });
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    addChapter({
      familyId: activeFamilyId!,
      title: form.title,
      subtitle: form.subtitle || undefined,
      yearStart: form.yearStart ? parseInt(form.yearStart) : undefined,
      yearEnd: form.yearEnd ? parseInt(form.yearEnd) : undefined,
      location: form.location || undefined,
      memoryIds: [],
      prose: form.prose || undefined,
    });
    setForm({ title: '', subtitle: '', yearStart: '', yearEnd: '', location: '', prose: '' });
    setShowForm(false);
    setSaving(false);
  };

  if (chapters.length === 0 && !showForm) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--accent-amber-bg)' }}>📖</div>
        <div>
          <div className="font-display text-xl font-medium text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>Organise memories into chapters</div>
          <p className="text-secondary text-sm max-w-sm">Group memories by era or theme to create a readable family biography.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">Create First Chapter</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="label">{chapters.length} CHAPTERS</div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs py-2 px-4">
          {showForm ? '× Cancel' : '+ New Chapter'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card mb-8">
          <div className="label mb-4">NEW CHAPTER</div>
          <div className="mb-4">
            <label className="field-label">Chapter Title *</label>
            <input placeholder="e.g. The Early Years" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="mb-4">
            <label className="field-label">Subtitle</label>
            <input placeholder="e.g. Varanasi, 1942–1963" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="field-label">Year From</label>
              <input type="number" placeholder="1950" value={form.yearStart} onChange={e => setForm(f => ({ ...f, yearStart: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Year To</label>
              <input type="number" placeholder="1975" value={form.yearEnd} onChange={e => setForm(f => ({ ...f, yearEnd: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Location</label>
              <input placeholder="City, Country" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
          </div>
          <div className="mb-5">
            <label className="field-label">Chapter Introduction (optional)</label>
            <textarea rows={4} placeholder="Write a brief introduction to this chapter..." value={form.prose} onChange={e => setForm(f => ({ ...f, prose: e.target.value }))} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
            {saving ? 'Creating...' : 'Create Chapter'}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-5">
        {chapters.map((ch, i) => {
          const chMemories = memories.filter(m => ch.memoryIds.includes(m.id));
          const unassigned = memories.filter(m => !m.chapterId);
          const isExpanded = expanded === ch.id;
          return (
            <div key={ch.id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: 'var(--accent-amber-bg)', color: 'var(--accent-amber)' }} aria-hidden="true">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display text-lg font-medium text-primary" style={{ fontFamily: 'var(--font-display)' }}>{ch.title}</div>
                      {ch.subtitle && <div className="label mt-0.5">{ch.subtitle}</div>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {ch.yearStart && <span className="badge badge-amber">{ch.yearStart}{ch.yearEnd ? `–${ch.yearEnd}` : '+'}</span>}
                      {ch.location && <span className="badge badge-muted hidden sm:inline-flex">{ch.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="badge badge-muted">{chMemories.length} memories</span>
                    <button onClick={() => setExpanded(isExpanded ? null : ch.id)}
                      className="text-xs text-amber hover:underline">
                      {isExpanded ? '▲ Collapse' : '▼ Expand'}
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-[var(--border-subtle)]">
                  {ch.prose && (
                    <div className="memoir-prose mb-6" style={{ fontSize: 15 }}>
                      {ch.prose.split('\n\n').map((p, i) => <p key={i} style={{ marginTop: i > 0 ? '1em' : 0 }}>{p}</p>)}
                    </div>
                  )}

                  {/* Assign memories to this chapter */}
                  {unassigned.length > 0 && (
                    <div className="mb-4">
                      <div className="label mb-2">ADD MEMORIES TO THIS CHAPTER</div>
                      <div className="flex flex-col gap-2">
                        {unassigned.map(m => (
                          <button key={m.id}
                            onClick={() => updateChapter(ch.id, { memoryIds: [...ch.memoryIds, m.id] })}
                            className="flex items-center gap-3 p-3 rounded-lg text-left hover:bg-[var(--accent-amber-bg)] transition-colors border border-[var(--border-subtle)]">
                            <span className="text-amber text-lg">+</span>
                            <div>
                              <div className="text-sm font-medium text-primary">{m.title}</div>
                              <div className="text-xs text-muted">{m.year ?? ''}{m.location ? ` · ${m.location}` : ''}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {chMemories.length === 0 ? (
                    <p className="text-muted text-sm italic">No memories assigned yet.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="label mb-2">INCLUDED MEMORIES</div>
                      {chMemories.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                          <div>
                            <div className="text-sm font-medium text-primary">{m.title}</div>
                            <div className="text-xs text-muted mt-0.5">{m.year ?? m.yearApprox ?? ''}{m.location ? ` · ${m.location}` : ''}</div>
                          </div>
                          <button
                            onClick={() => updateChapter(ch.id, { memoryIds: ch.memoryIds.filter(id => id !== m.id) })}
                            className="text-xs text-muted hover:text-[var(--accent-rose)] transition-colors ml-4">
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
