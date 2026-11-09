'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isConfigured = Boolean(supabase);

  useEffect(() => {
    if (!isConfigured || !supabase) {
      return;
    }

    const client = supabase;
    let active = true;

    const finalizeAuth = async () => {
      const { error: exchangeError } = await client.auth.exchangeCodeForSession(window.location.href);
      if (!active) {
        return;
      }

      if (exchangeError) {
        setError(exchangeError.message || 'Authentication callback failed.');
        return;
      }

      router.replace('/dashboard');
    };

    void finalizeAuth();

    return () => {
      active = false;
    };
  }, [isConfigured, router]);

  const statusMessage = error ?? 'Finalizing your Supabase session and redirecting you to the workspace.';

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-blue-950/20">
        <div className="text-sm uppercase tracking-[0.2em] text-blue-300">Authentication</div>
        <h1 className="mt-4 text-3xl font-semibold text-white">{error ? 'Authentication issue' : 'Callback complete'}</h1>
        <p className="mt-3 text-sm text-slate-300">{statusMessage}</p>
        {error ? (
          <Link href="/login" className="mt-6 inline-flex rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white">Return to sign in</Link>
        ) : (
          <Link href="/dashboard" className="mt-6 inline-flex rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white">Continue to dashboard</Link>
        )}
      </div>
    </main>
  );
}
