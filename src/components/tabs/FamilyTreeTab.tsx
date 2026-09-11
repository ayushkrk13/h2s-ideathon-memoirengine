'use client';
import { useFamilyStore } from '@/lib/store';
import type { FamilyMember } from '@/lib/store';
import { useState, useMemo } from 'react';

const RELATIONSHIP_COLORS: Record<string, string> = {
  Self: 'badge-amber', Father: 'badge-muted', Mother: 'badge-muted',
  Son: 'badge-green', Daughter: 'badge-green', Brother: 'badge-indigo',
  Sister: 'badge-indigo', Husband: 'badge-rose', Wife: 'badge-rose',
  Grandfather: 'badge-muted', Grandmother: 'badge-muted',
};

export default function FamilyTreeTab({ onAddMember }: { onAddMember: () => void }) {
  const activeFamilyId = useFamilyStore(s => s.activeFamilyId);
  const allMembers   = useFamilyStore(s => s.members);
  const allMemories  = useFamilyStore(s => s.memories);
  const removeMember = useFamilyStore(s => s.removeMember);
  const updateMember = useFamilyStore(s => s.updateMember);

  const members = useMemo(
    () => allMembers.filter(m => m.familyId === activeFamilyId),
    [allMembers, activeFamilyId]
  );

  const memories = useMemo(
    () => allMemories.filter(m => m.familyId === activeFamilyId),
    [allMemories, activeFamilyId]
  );

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [editingBio, setEditingBio] = useState('');
  const [savingBio, setSavingBio] = useState(false);
  const [bioSaved, setBioSaved] = useState(false);

  const memoryCountByMember = useMemo(() => {
    const counts: Record<string, number> = {};
    memories.forEach(m => m.people.forEach(pid => {
      counts[pid] = (counts[pid] ?? 0) + 1;
    }));
    return counts;
  }, [memories]);

  const handleSaveBio = async () => {
    if (!selectedMember) return;
    setSavingBio(true);
    await new Promise(r => setTimeout(r, 300));
    updateMember(selectedMember.id, { bio: editingBio });
    setSelectedMember({ ...selectedMember, bio: editingBio });
    setSavingBio(false);
    setBioSaved(true);
    setTimeout(() => setBioSaved(false), 2500);
  };

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--accent-amber-bg)' }}>👪</div>
        <div>
          <div className="font-display text-xl font-medium text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>Build your family tree</div>
          <p className="text-secondary text-sm max-w-sm">Add family members to track who appears in memories and see how relationships connect across generations.</p>
        </div>
        <button onClick={onAddMember} className="btn-primary">Add First Family Member</button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="label">{members.length} MEMBERS</div>
          <button onClick={onAddMember} className="btn-primary text-xs py-2 px-4">+ Add Member</button>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map(member => {
            const memCount = memoryCountByMember[member.id] ?? 0;
            const isSelected = selectedMember?.id === member.id;
            return (
              <button
                key={member.id}
                onClick={() => {
                  setSelectedMember(isSelected ? null : member);
                  setEditingBio(member.bio ?? '');
                  setBioSaved(false);
                }}
                className={`card text-left transition-all duration-200 ${isSelected ? 'border-[var(--accent-amber)] shadow-[var(--shadow-md)]' : ''}`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="avatar w-10 h-10 text-sm flex-shrink-0"
                    style={{ background: isSelected ? 'var(--accent-amber)' : 'var(--accent-amber-bg)', color: isSelected ? '#fff' : 'var(--accent-amber)' }}
                    aria-hidden="true">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-primary truncate">{member.name}</div>
                    <span className={`badge text-xs ${RELATIONSHIP_COLORS[member.relationship] ?? 'badge-muted'}`}>
                      {member.relationship}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  {member.birth && <span>{member.birth}{member.death ? ` – ${member.death}` : ''}</span>}
                  {member.birthplace && <span>· {member.birthplace}</span>}
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="label" style={{ fontSize: 9 }}>{memCount} {memCount === 1 ? 'MEMORY' : 'MEMORIES'}</div>
                  {isSelected && <div className="text-amber text-xs font-medium">Selected ✓</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky top-20 self-start">
        {selectedMember ? (
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="avatar w-12 h-12 text-base" aria-hidden="true">
                  {selectedMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-primary">{selectedMember.name}</div>
                  <span className={`badge ${RELATIONSHIP_COLORS[selectedMember.relationship] ?? 'badge-muted'}`}>
                    {selectedMember.relationship}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-muted hover:text-primary text-lg leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)]" aria-label="Close">×</button>
            </div>

            <div className="flex flex-col gap-2 text-sm text-secondary mb-4">
              {selectedMember.birth && (
                <div className="flex justify-between">
                  <span className="label">BORN</span>
                  <span>{selectedMember.birth}{selectedMember.birthplace ? `, ${selectedMember.birthplace}` : ''}</span>
                </div>
              )}
              {selectedMember.death && (
                <div className="flex justify-between">
                  <span className="label">DIED</span>
                  <span>{selectedMember.death}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="label">MEMORIES</span>
                <span>{memoryCountByMember[selectedMember.id] ?? 0}</span>
              </div>
            </div>

            <div>
              <label className="field-label">Short Biography</label>
              <textarea rows={4} placeholder="Add a short biography..."
                value={editingBio}
                onChange={e => { setEditingBio(e.target.value); setBioSaved(false); }}
                className="resize-none text-sm" />
              <button onClick={handleSaveBio} disabled={savingBio}
                className={`w-full mt-3 justify-center text-sm py-2 ${bioSaved ? 'btn-secondary' : 'btn-primary'} disabled:opacity-50`}>
                {savingBio ? 'Saving...' : bioSaved ? '✓ Saved' : 'Save Biography'}
              </button>
            </div>

            <button
              onClick={() => {
                if (window.confirm(`Remove ${selectedMember.name} from the family tree?`)) {
                  removeMember(selectedMember.id);
                  setSelectedMember(null);
                }
              }}
              className="mt-3 w-full text-xs text-muted hover:text-[var(--accent-rose)] transition-colors text-center py-2">
              Remove from family tree
            </button>
          </div>
        ) : (
          <div className="card text-center py-10">
            <div className="text-3xl mb-3">👤</div>
            <div className="text-sm text-muted">Select a family member to view and edit their details.</div>
          </div>
        )}
      </div>
    </div>
  );
}
