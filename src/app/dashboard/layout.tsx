'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const hasSession = document.cookie.split('; ').some((row) => row.startsWith('recalldesk_session='));
    if (!hasSession) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
