'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import ArchiveDashboard from '@/components/ArchiveDashboard';
import TreeWatermark from '@/components/TreeWatermark';

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <div className="h-14 border-b border-[var(--border-subtle)] bg-white/80 animate-pulse" />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[var(--accent-amber)] border-t-transparent rounded-full animate-spin" />
          <div className="text-sm text-muted">Loading your archive...</div>
        </div>
      </div>
    </div>
  );
}

export default function ArchivePage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const { isLoggedIn } = useAuthStore();

  // Wait one tick for persisted store to hydrate before checking auth
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.push('/login');
    }
  }, [hydrated, isLoggedIn, router]);

  if (!hydrated) return <LoadingSkeleton />;
  if (!isLoggedIn) return <LoadingSkeleton />;

  return (
    <div className="relative overflow-hidden">
      <TreeWatermark side="right" opacity={0.032} scale={1.1} />
      <TreeWatermark side="left"  opacity={0.022} scale={0.7} />
      <ArchiveDashboard />
    </div>
  );
}
