import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  birth?: number;
  death?: number;
  birthplace?: string;
  bio?: string;
  relationship: string; // e.g. "Father", "Mother", "Self", "Sibling", "Grandparent"
  parentIds: string[];
  spouseIds: string[];
  childrenIds: string[];
  photoUrl?: string;
  addedBy: string; // userId
  createdAt: string;
}

export interface Memory {
  id: string;
  familyId: string;
  title: string;
  year?: number;
  yearApprox?: string; // e.g. "early 1960s"
  location?: string;
  people: string[]; // FamilyMember ids
  peopleFreeText: string[]; // names not yet in tree
  objects: string[];
  emotions: string[];
  places: string[];
  transcript: string;
  prose?: string;
  audioUrl?: string;
  photoUrls: string[];
  tags: string[];
  chapterId?: string;
  isPublic: boolean;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  familyId: string;
  title: string;
  subtitle?: string;
  yearStart?: number;
  yearEnd?: number;
  location?: string;
  memoryIds: string[];
  prose?: string;
  createdAt: string;
}

export interface Family {
  id: string;
  name: string;
  tagline?: string;
  ownerId: string;
  memberIds: string[]; // user IDs who can contribute
  isPublic: boolean;
  coverPhotoUrl?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  familyId: string;
  year: number;
  title: string;
  description?: string;
  type: 'birth' | 'death' | 'marriage' | 'education' | 'career' | 'migration' | 'milestone' | 'memory';
  significance: 'normal' | 'major' | 'defining';
  memoryId?: string;
  personIds: string[];
}

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      updateUser: (updates) =>
        set((s) => ({ user: s.user ? { ...s.user, ...updates } : null })),
    }),
    { name: 'memoir-auth' }
  )
);

// ─── Family Data Store ────────────────────────────────────────────────────────

interface FamilyDataState {
  families: Family[];
  members: FamilyMember[];
  memories: Memory[];
  chapters: Chapter[];
  timeline: TimelineEvent[];
  activeFamilyId: string | null;

  // Families
  addFamily: (f: Omit<Family, 'id' | 'createdAt'>) => Family;
  updateFamily: (id: string, updates: Partial<Family>) => void;
  setActiveFamily: (id: string) => void;

  // Members
  addMember: (m: Omit<FamilyMember, 'id' | 'createdAt'>) => FamilyMember;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeMember: (id: string) => void;

  // Memories
  addMemory: (m: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => Memory;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  removeMemory: (id: string) => void;

  // Chapters
  addChapter: (c: Omit<Chapter, 'id' | 'createdAt'>) => Chapter;
  updateChapter: (id: string, updates: Partial<Chapter>) => void;

  // Timeline
  addTimelineEvent: (e: Omit<TimelineEvent, 'id'>) => void;

  // Selectors
  getActiveFamilyMemories: () => Memory[];
  getActiveFamilyMembers: () => FamilyMember[];
  getActiveFamilyTimeline: () => TimelineEvent[];
  getActiveFamilyChapters: () => Chapter[];
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const now = () => new Date().toISOString();

export const useFamilyStore = create<FamilyDataState>()(
  persist(
    (set, get) => ({
      families: [],
      members: [],
      memories: [],
      chapters: [],
      timeline: [],
      activeFamilyId: null,

      addFamily: (f) => {
        const family: Family = { ...f, id: uid(), createdAt: now() };
        set((s) => ({ families: [...s.families, family] }));
        return family;
      },
      updateFamily: (id, updates) =>
        set((s) => ({ families: s.families.map((f) => f.id === id ? { ...f, ...updates } : f) })),
      setActiveFamily: (id) => set({ activeFamilyId: id }),

      addMember: (m) => {
        const member: FamilyMember = { ...m, id: uid(), createdAt: now() };
        set((s) => ({ members: [...s.members, member] }));
        return member;
      },
      updateMember: (id, updates) =>
        set((s) => ({ members: s.members.map((m) => m.id === id ? { ...m, ...updates } : m) })),
      removeMember: (id) =>
        set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

      addMemory: (m) => {
        const memory: Memory = { ...m, id: uid(), createdAt: now(), updatedAt: now() };
        set((s) => ({ memories: [...s.memories, memory] }));
        return memory;
      },
      updateMemory: (id, updates) =>
        set((s) => ({
          memories: s.memories.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: now() } : m
          ),
        })),
      removeMemory: (id) =>
        set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),

      addChapter: (c) => {
        const chapter: Chapter = { ...c, id: uid(), createdAt: now() };
        set((s) => ({ chapters: [...s.chapters, chapter] }));
        return chapter;
      },
      updateChapter: (id, updates) =>
        set((s) => ({ chapters: s.chapters.map((c) => c.id === id ? { ...c, ...updates } : c) })),

      addTimelineEvent: (e) =>
        set((s) => ({ timeline: [...s.timeline, { ...e, id: uid() }] })),

      getActiveFamilyMemories: () => {
        const { memories, activeFamilyId } = get();
        return memories.filter((m) => m.familyId === activeFamilyId)
          .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      },
      getActiveFamilyMembers: () => {
        const { members, activeFamilyId } = get();
        return members.filter((m) => m.familyId === activeFamilyId);
      },
      getActiveFamilyTimeline: () => {
        const { timeline, activeFamilyId } = get();
        return timeline.filter((e) => e.familyId === activeFamilyId)
          .sort((a, b) => a.year - b.year);
      },
      getActiveFamilyChapters: () => {
        const { chapters, activeFamilyId } = get();
        return chapters.filter((c) => c.familyId === activeFamilyId);
      },
    }),
    { name: 'memoir-family-data' }
  )
);

// ─── UI Store ─────────────────────────────────────────────────────────────────

interface UIState {
  isRecording: boolean;
  isProcessing: boolean;
  transcript: string;
  wowStep: number;
  setRecording: (v: boolean) => void;
  setProcessing: (v: boolean) => void;
  setTranscript: (t: string) => void;
  setWowStep: (n: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isRecording: false,
  isProcessing: false,
  transcript: '',
  wowStep: 0,
  setRecording: (v) => set({ isRecording: v }),
  setProcessing: (v) => set({ isProcessing: v }),
  setTranscript: (t) => set({ transcript: t }),
  setWowStep: (n) => set({ wowStep: n }),
}));
