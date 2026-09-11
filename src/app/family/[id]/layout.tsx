import { PUBLIC_FAMILIES } from '@/lib/publicData';

export function generateStaticParams() {
  return PUBLIC_FAMILIES.map((family) => ({
    id: family.id,
  }));
}

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
