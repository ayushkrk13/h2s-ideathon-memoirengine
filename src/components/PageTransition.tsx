'use client';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div style={{ opacity: show ? 1 : 0, transition: 'opacity 0.3s ease' }}>
      {children}
    </div>
  );
}
