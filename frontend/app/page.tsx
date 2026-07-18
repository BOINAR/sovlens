'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

export default function RootPage() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') router.replace('/gallery');
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  return <div className="min-h-screen flex items-center justify-center text-sv-text3 text-sm">Chargement…</div>;
}