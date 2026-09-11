'use client';
import { useState, useEffect, useMemo } from 'react';
import { useFamilyStore, useAuthStore } from '@/lib/store';
import { RELATIONSHIP_OPTIONS } from '@/lib/publicData';
import { sleep } from '@/lib/utils';

export default function AddMemberModal({ onClose }: { onClose: () => void }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  // Primitive selectors only
  const activeFamilyId = useFamilyStore(s => s.activeFamilyId);
  const addMember      = useFamilyStore(s => s.addMember);
  const allMembers     = useFamilyStore(s => s.members);
  const { user }       = useAuthStore();

  const existingMembers = useMemo(
    () => allMembers.filter(m => m.familyId === activeFamilyId),
    [allMembers, activeFamilyId]
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [savedName, setSavedName] = useState('');

  const [form, setForm] = useState({
    name: '', relationship: 'Father', birth: '', death: '',
    birthplace: '', bio: '',
    parentIds: [] as string[],
    spouseIds: [] as string[],
    childrenIds: [] as string[],
  });

  const toggleRelation = (key: 'parentIds' | 'spouseIds' | 'childrenIds', id: string) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter(v => v !== id) : [...f[key], id],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !activeFamilyId) return;
    setSaving(true);
    await sleep(400);
    addMember({
      familyId: activeFamilyId,
      name: form.name.trim(),
      relationship: form.relationship,
      birth: form.birth ? parseInt(form.birth) : undefined,
      death: form.death ? parseInt(form.death) : undefined,
      birthplace: form.birthplace || undefined,
      bio: form.bio || undefined,
      parentIds: form.parentIds,
      spouseIds: form.spouseIds,
      childrenIds: form.childrenIds,
      addedBy: user?.id ?? 'unknown',
    });
    setSavedName(form.name.trim());
    setSaving(false);
    setSaved(true);
    await sleep(1000);
    onClose();
  };

  if (!hydrated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28,20,16,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg flex flex-col rounded-2xl shadow-[var(--shadow-lg)]"
        style={{
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          maxHeight: 'calc(100vh - 2rem)',
        }}
        role="dialog" aria-modal="true" aria-label="Add family member">

        <div className="flex-shrink-0 flex items-center justify-between px-7 py-5 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="font-display text-lg font-semibold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Add Family Member</h2>
            <p className="text-muted text-xs mt-0.5">Build your family tree one person at a time</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-primary text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)]" aria-label="Close">×</button>
        </div>

        {saved ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'var(--accent-green-bg)', border: '2px solid var(--accent-green)' }}>✓</div>
            <div className="font-display text-lg font-medium text-primary" style={{ fontFamily: 'var(--font-display)' }}>
              {savedName} added to the family tree
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1">
            <div className="overflow-y-auto flex-1 px-7 py-5 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="field-label">Full Name *</label>
                  <input placeholder="e.g. Ramesh Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoFocus />
                </div>
                <div className="col-span-2">
                  <label className="field-label">Relationship to subject</label>
                  <select value={form.relationship} onChange={e => setForm(f => ({ ...f, relationship: e.target.value }))}>
                    {RELATIONSHIP_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Birth Year</label>
                  <input type="number" placeholder="e.g. 1942" min="1800" max="2099" value={form.birth} onChange={e => setForm(f => ({ ...f, birth: e.target.value }))} />
                </div>
                <div>
                  <label className="field-label">Death Year (if applicable)</label>
                  <input type="number" placeholder="e.g. 2019" min="1800" max="2099" value={form.death} onChange={e => setForm(f => ({ ...f, death: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="field-label">Birthplace</label>
                  <input placeholder="e.g. Varanasi, India" value={form.birthplace} onChange={e => setForm(f => ({ ...f, birthplace: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="field-label">Short Biography</label>
                  <textarea rows={3} placeholder="A few sentences about this person..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                </div>
              </div>

              {existingMembers.length > 0 && (
                <div>
                  <div className="label mb-3">CONNECT TO EXISTING MEMBERS</div>
                  {(['parentIds','spouseIds','childrenIds'] as const).map(key => (
                    <div key={key} className="mb-4">
                      <label className="field-label capitalize">{key === 'parentIds' ? 'Parents' : key === 'spouseIds' ? 'Spouse / Partner' : 'Children'}</label>
                      <div className="flex flex-wrap gap-2">
                        {existingMembers.map(m => (
                          <button type="button" key={m.id}
                            onClick={() => toggleRelation(key, m.id)}
                            className={`pill-tab text-xs ${form[key].includes(m.id) ? 'pill-tab-active' : 'pill-tab-inactive'}`}>
                            {m.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex items-center justify-between px-7 py-5 border-t border-[var(--border-subtle)] gap-3">
              <button type="button" onClick={onClose} className="btn-secondary text-sm">Cancel</button>
              <button type="submit" disabled={saving || !form.name.trim()} className="btn-primary text-sm disabled:opacity-50">
                {saving ? 'Adding...' : 'Add to Family Tree'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
