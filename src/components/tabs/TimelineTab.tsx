'use client';
import { useFamilyStore } from '@/lib/store';
import type { TimelineEvent } from '@/lib/store';
import { useState, useMemo } from 'react';

const TYPE_COLOR: Record<string, string> = {
  birth: 'badge-green', death: 'badge-muted', marriage: 'badge-rose',
  education: 'badge-indigo', career: 'badge-amber',
  migration: 'badge-muted', milestone: 'badge-amber', memory: 'badge-indigo',
};

export default function TimelineTab() {
  const activeFamilyId   = useFamilyStore(s => s.activeFamilyId);
  const allTimeline      = useFamilyStore(s => s.timeline);
  const addTimelineEvent = useFamilyStore(s => s.addTimelineEvent);

  const events = useMemo(
    () => allTimeline
      .filter(e => e.familyId === activeFamilyId)
      .sort((a, b) => a.year - b.year),
    [allTimeline, activeFamilyId]
  );

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    year: '', title: '', description: '',
    type: 'milestone' as TimelineEvent['type'],
    significance: 'normal' as TimelineEvent['significance'],
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.year || !form.title) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    addTimelineEvent({
      familyId: activeFamilyId!,
      year: parseInt(form.year),
      title: form.title,
      description: form.description,
      type: form.type,
      significance: form.significance,
      personIds: [],
    });
    setForm({ year: '', title: '', description: '', type: 'milestone', significance: 'normal' });
    setShowForm(false);
    setSaving(false);
  };

  if (events.length === 0 && !showForm) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--accent-amber-bg)' }}>📅</div>
        <div>
          <div className="font-display text-xl font-medium text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>Build your family timeline</div>
          <p className="text-secondary text-sm max-w-sm">Add births, migrations, marriages, milestones — any moment that shaped your family&apos;s story.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add First Timeline Event</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="label">{events.length} EVENTS</div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs py-2 px-4">
          {showForm ? '× Cancel' : '+ Add Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card mb-8">
          <div className="label mb-4">NEW TIMELINE EVENT</div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="field-label">Year *</label>
              <input type="number" placeholder="e.g. 1975" value={form.year}
                onChange={e => setForm(f => ({ ...f, year: e.target.value }))} min="1800" max="2099" />
            </div>
            <div>
              <label className="field-label">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as TimelineEvent['type'] }))}>
                {['birth','death','marriage','education','career','migration','milestone','memory'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="field-label">Title *</label>
            <input type="text" placeholder="e.g. Family migrates to Mumbai" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="mb-4">
            <label className="field-label">Description</label>
            <textarea rows={2} placeholder="Add more context..." value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="mb-5">
            <label className="field-label">Significance</label>
            <div className="flex gap-2">
              {(['normal','major','defining'] as const).map(s => (
                <button type="button" key={s}
                  onClick={() => setForm(f => ({ ...f, significance: s }))}
                  className={`pill-tab text-xs ${form.significance === s ? 'pill-tab-active' : 'pill-tab-inactive'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
            {saving ? 'Adding...' : 'Add to Timeline'}
          </button>
        </form>
      )}

      <div className="relative border-l-2 border-[var(--border-subtle)] pl-8 flex flex-col gap-0">
        {events.map(event => (
          <div key={event.id} className="relative pb-8">
            <div className={`absolute -left-[41px] ${event.significance === 'defining' ? 'timeline-node large' : 'timeline-node'}`} aria-hidden="true" />
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-xl font-light" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-amber)', letterSpacing: '-0.02em' }}>
                    {event.year}
                  </span>
                  <span className={`badge ${TYPE_COLOR[event.type] ?? 'badge-muted'}`}>{event.type}</span>
                  {event.significance === 'defining' && <span className="badge badge-rose">Defining moment</span>}
                </div>
                <div className="font-medium text-primary text-sm">{event.title}</div>
                {event.description && (
                  <p className="text-secondary text-xs mt-1 leading-[1.7]">{event.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
