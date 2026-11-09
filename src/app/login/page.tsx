'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('alicia@recalldesk.ai');
  const [password, setPassword] = useState('demo-password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!email.includes('@') || password.length < 8) {
      setError('Use a valid work email and a password with at least 8 characters.');
      setLoading(false);
      return;
    }

    if (!supabase) {
      setError('Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel before signing in.');
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        throw signInError;
      }
      router.push('/dashboard');
      router.refresh();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Login failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-blue-950/20">
        <div className="grid lg:grid-cols-2">
          <div className="border-b border-slate-800 bg-slate-950/80 p-8 lg:border-b-0 lg:border-r">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">RecallDesk AI</div>
                <div className="text-xl font-semibold text-white">Customer Memory Platform</div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-blue-300">Demo access</div>
                <h1 className="mt-2 text-3xl font-semibold text-white">Sign in to your workspace</h1>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                <div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4" /> Demo login ready</div>
                <p className="mt-2 text-emerald-50/90">Use the prefilled admin demo account to enter the product immediately.</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6 text-right text-sm text-slate-400">
              Need an account? <Link href="/signup" className="font-medium text-blue-300">Create one</Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">Work email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none ring-0 transition focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus-within:border-blue-500">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent text-slate-100 outline-none"
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="ml-2 text-slate-400">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-600 bg-slate-900" /> Remember me</label>
                <Link href="/forgot-password" className="text-blue-300">Forgot password?</Link>
              </div>

              {error ? <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div> : null}

              <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              <button type="button" onClick={() => { document.cookie = 'recalldesk_session=demo-admin; path=/; max-age=86400'; router.push('/dashboard'); }} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200">
                Use demo login
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
