'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { supabase } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(!supabase);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }
      if (!data.session) {
        router.replace('/login');
        return;
      }
      setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) {
        return;
      }
      if (event === 'SIGNED_OUT') {
        router.replace('/login');
        return;
      }
      if (session) {
        setReady(true);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (!ready && supabase) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Checking session…</div>;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
