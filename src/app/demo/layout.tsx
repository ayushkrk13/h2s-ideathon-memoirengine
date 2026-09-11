import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Judge Demo — MemoirEngine',
  description: 'Competition presentation demo for MemoirEngine',
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
