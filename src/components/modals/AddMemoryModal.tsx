'use client';
import { useState, useEffect, useMemo } from 'react';
import { useFamilyStore } from '@/lib/store';
import { EMOTION_OPTIONS, MEMORY_TAGS } from '@/lib/publicData';
import { sleep } from '@/lib/utils';

export default function AddMemoryModal({ onClose }: { onClose: () => void }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  // Primitive selectors only — no arrays
  const activeFamilyId = useFamilyStore(s => s.activeFamilyId);
  const addMemory      = useFamilyStore(s => s.addMemory);
  const allMembers     = useFamilyStore(s => s.members);

  const members = useMemo(
    () => allMembers.filter(m => m.familyId === activeFamilyId),
    [allMembers, activeFamilyId]
  );

  const [inputTab, setInputTab] = useState<'text' | 'voice'>('text');
  const [saving, setSaving] = useState(false);
  const [waveActive, setWaveActive] = useState(false);
  const [waveHeights, setWaveHeights] = useState(() =>
    Array.from({ length: 36 }, () => Math.random() * 0.5 + 0.1)
  );
  const [photoDataUrls, setPhotoDataUrls] = useState<string[]>([]);

  // Animate waveform when recording
  useEffect(() => {
    if (!waveActive) return;
    const interval = setInterval(() => {
      setWaveHeights(prev => prev.map(h => Math.max(0.05, Math.min(1, h + (Math.random() - 0.5) * 0.3))));
    }, 80);
    return () => clearInterval(interval);
  }, [waveActive]);

  const [form, setForm] = useState({
    title: '', year: '', yearApprox: '', location: '', transcript: '',
    people: [] as string[], peopleFreeText: '',
    objects: '', emotions: [] as string[], places: '', tags: [] as string[],
    isPublic: false,
  });

  const toggleArray = (key: 'people' | 'emotions' | 'tags', val: string) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setPhotoDataUrls(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const simulateVoice = async () => {
    setWaveActive(true);
    await sleep(3000);
    setWaveActive(false);
    setInputTab('text');
    setForm(f => ({
      ...f,
      transcript: f.transcript || 'I remember the mornings most clearly. The sound of the temple bells at five, then my mother lighting the lamp in the kitchen. My father would already be sitting with his chai, reading. There was a particular quality to the early-morning light — it came through the east window and lit up the dust motes in the air.',
      title: f.title || 'Morning Light',
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.transcript || !activeFamilyId) return;
    setSaving(true);
    await sleep(400);
    addMemory({
      familyId: activeFamilyId,
      title: form.title,
      year: form.year ? parseInt(form.year) : undefined,
      yearApprox: form.yearApprox || undefined,
      location: form.location || undefined,
      transcript: form.transcript,
      people: form.people,
      peopleFreeText: form.peopleFreeText.split(',').map(s => s.trim()).filter(Boolean),
      objects: form.objects.split(',').map(s => s.trim()).filter(Boolean),
      emotions: form.emotions,
      places: form.places.split(',').map(s => s.trim()).filter(Boolean),
      tags: form.tags,
      photoUrls: photoDataUrls,
      isPublic: form.isPublic,
      addedBy: 'current-user',
    });
    setSaving(false);
    onClose();
  };

  if (!hydrated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28,20,16,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl flex flex-col rounded-2xl shadow-[var(--shadow-lg)]"
        style={{
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          maxHeight: 'calc(100vh - 2rem)',
        }}
        role="dialog" aria-modal="true" aria-label="Add a new memory">

        {/* Header — sticky */}
        <div className="flex-shrink-0 flex items-center justify-between px-7 py-5 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="font-display text-lg font-semibold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Add a Memory</h2>
            <p className="text-muted text-xs mt-0.5">Type it in or record your voice</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-primary text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)]" aria-label="Close">×</button>
        </div>

        {/* Input method tabs — sticky */}
        <div className="flex-shrink-0 flex gap-2 px-7 pt-5">
          <button onClick={() => setInputTab('text')} className={`pill-tab flex items-center gap-2 ${inputTab === 'text' ? 'pill-tab-active' : 'pill-tab-inactive'}`}>✏️ Write</button>
          <button onClick={() => setInputTab('voice')} className={`pill-tab flex items-center gap-2 ${inputTab === 'voice' ? 'pill-tab-active' : 'pill-tab-inactive'}`}>🎙 Voice</button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1">
          <div className="overflow-y-auto flex-1 px-7 py-5 flex flex-col gap-5">

            {/* Voice tab */}
            {inputTab === 'voice' && (
              <div className="flex flex-col items-center gap-5 py-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="label text-amber">RECORD YOUR MEMORY</div>
                <div className="flex items-end gap-[2px] h-16 w-full max-w-xs" aria-label="Waveform" role="img">
                  {waveHeights.map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm"
                      style={{
                        height: `${(waveActive ? h : 0.08) * 100}%`,
                        background: waveActive ? `rgba(217,119,6,${0.35 + h * 0.5})` : 'var(--border-subtle)',
                        transition: waveActive ? 'height 0.08s' : 'height 0.4s',
                      }} />
                  ))}
                </div>
                <button type="button" onClick={simulateVoice} disabled={waveActive}
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${waveActive ? 'border-[var(--accent-rose)] bg-[var(--accent-rose-bg)]' : 'border-[var(--accent-amber)] hover:bg-[var(--accent-amber-bg)]'}`}
                  aria-label={waveActive ? 'Recording...' : 'Start recording'}>
                  {waveActive
                    ? <div className="w-4 h-4 rounded-sm animate-pulse" style={{ background: 'var(--accent-rose)' }} />
                    : <div className="w-5 h-5 rounded-full" style={{ background: 'var(--accent-amber)' }} />}
                </button>
                <p className="text-muted text-xs text-center">{waveActive ? '● Recording... please wait' : 'Tap to start. Or use the demo voice below.'}</p>
                {!waveActive && (
                  <button type="button" onClick={simulateVoice} className="btn-secondary text-xs">Use Demo Voice</button>
                )}
              </div>
            )}

            {/* Core fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="field-label">Memory Title *</label>
                <input placeholder="e.g. The First Radio, 1952" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="field-label">Year</label>
                <input type="number" placeholder="e.g. 1968" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} min="1800" max="2099" />
              </div>
              <div>
                <label className="field-label">Location</label>
                <input placeholder="e.g. Varanasi, India" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="field-label">The Memory (in their words) *</label>
              <textarea rows={5} placeholder="Write the memory as it was told, or paste a transcript..." value={form.transcript} onChange={e => setForm(f => ({ ...f, transcript: e.target.value }))} required />
            </div>

            {/* Photo upload */}
            <div>
              <label className="field-label">Photographs</label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-[var(--border-medium)] cursor-pointer hover:border-[var(--accent-amber)] hover:bg-[var(--accent-amber-bg)] transition-colors">
                <span className="text-xl">📷</span>
                <div>
                  <div className="text-sm font-medium text-primary">Upload photos</div>
                  <div className="text-xs text-muted">JPG, PNG, WebP — multiple allowed</div>
                </div>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
              </label>
              {photoDataUrls.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {photoDataUrls.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-[var(--border-subtle)]" />
                      <button type="button"
                        onClick={() => setPhotoDataUrls(p => p.filter((_, j) => j !== i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--accent-rose)] text-white text-xs flex items-center justify-center"
                        aria-label="Remove photo">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* People from tree */}
            {members.length > 0 && (
              <div>
                <label className="field-label">People in this memory (from family tree)</label>
                <div className="flex flex-wrap gap-2">
                  {members.map(m => (
                    <button type="button" key={m.id}
                      onClick={() => toggleArray('people', m.id)}
                      className={`pill-tab text-xs ${form.people.includes(m.id) ? 'pill-tab-active' : 'pill-tab-inactive'}`}>
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="field-label">Other people mentioned (comma-separated)</label>
              <input placeholder="e.g. Masterji Tripathi, Pandit Girish" value={form.peopleFreeText} onChange={e => setForm(f => ({ ...f, peopleFreeText: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Objects mentioned</label>
                <input placeholder="e.g. Murphy Radio, brass lamp" value={form.objects} onChange={e => setForm(f => ({ ...f, objects: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Places mentioned</label>
                <input placeholder="e.g. Varanasi, Ganga ghat" value={form.places} onChange={e => setForm(f => ({ ...f, places: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="field-label">Emotions in this memory</label>
              <div className="flex flex-wrap gap-2">
                {EMOTION_OPTIONS.map(em => (
                  <button type="button" key={em}
                    onClick={() => toggleArray('emotions', em)}
                    className={`pill-tab text-xs ${form.emotions.includes(em) ? 'pill-tab-active' : 'pill-tab-inactive'}`}>
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Memory tags</label>
              <div className="flex flex-wrap gap-2">
                {MEMORY_TAGS.map(tag => (
                  <button type="button" key={tag}
                    onClick={() => toggleArray('tags', tag)}
                    className={`pill-tab text-xs ${form.tags.includes(tag) ? 'pill-tab-active' : 'pill-tab-inactive'}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition-colors">
              <input type="checkbox" checked={form.isPublic} onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))} style={{ width: 'auto', borderRadius: 4 }} />
              <div>
                <div className="text-sm font-medium text-primary">Make this memory public</div>
                <div className="text-xs text-muted">Visible on your public archive page</div>
              </div>
            </label>
          </div>

          {/* Footer — sticky */}
          <div className="flex-shrink-0 flex items-center justify-between px-7 py-5 border-t border-[var(--border-subtle)] gap-3">
            <button type="button" onClick={onClose} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.title || !form.transcript} className="btn-primary text-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
