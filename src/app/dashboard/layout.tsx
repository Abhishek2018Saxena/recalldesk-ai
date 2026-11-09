'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { supabase } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      router.replace('/login');
      return;
    }

    const client = supabase;
    let active = true;

    const verifySession = async () => {
      const { data, error } = await client.auth.getSession();

      if (!active) {
        return;
      }

      if (error || !data.session) {
        router.replace('/login');
        return;
      }

      setReady(true);
    };

    void verifySession();

    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (!active) {
        return;
      }

      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/login');
        return;
      }

      setReady(true);
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
