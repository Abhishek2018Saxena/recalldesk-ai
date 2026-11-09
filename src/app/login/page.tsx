'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Login form submit fired', { email: email.trim(), passwordLength: password.length });
    setLoading(true);
    setError('');

    if (!email.trim() || !email.includes('@') || password.length < 8) {
      console.log('Login validation failed', { email: email.trim(), passwordLength: password.length });
      setError('Enter a valid work email and a password with at least 8 characters.');
      setLoading(false);
      return;
    }

    if (!supabase) {
      console.log('Supabase client missing during login attempt');
      setError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment before signing in.');
      setLoading(false);
      return;
    }

    try {
      console.log('Calling supabase.auth.signInWithPassword');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      console.log('Supabase auth response', { signInData, signInError });

      if (signInError) {
        throw signInError;
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check after login', { session, sessionError });

      if (sessionError) {
        throw sessionError;
      }

      if (!session || !signInData.user) {
        throw new Error('The sign-in request succeeded, but the session was not created. Please verify your Supabase auth settings and redirect configuration.');
      }

      console.log('Redirecting to dashboard after successful login');
      router.replace('/dashboard');
      router.refresh();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Login failed. Please check your credentials and try again.';
      console.error('Login submit failed', caughtError);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Sign in button clicked');
    if (event.currentTarget.form) {
      event.currentTarget.form.requestSubmit();
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
                <div className="text-sm uppercase tracking-[0.18em] text-blue-300">Secure sign-in</div>
                <h1 className="mt-2 text-3xl font-semibold text-white">Sign in to your workspace</h1>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                <div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4" /> Supabase auth enabled</div>
                <p className="mt-2 text-emerald-50/90">Use the email and password for your RecallDesk workspace account.</p>
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

              <button type="submit" onClick={handleSignInClick} disabled={loading} className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
