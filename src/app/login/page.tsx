'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setError('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setError('Please enter your password (at least 8 characters).');
      return;
    }

    if (!supabase) {
      setError(
        'Supabase is not configured. Check your environment variables and restart the application.'
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (loginError) {
        if (loginError.message.toLowerCase().includes('email not confirmed')) {
          throw new Error(
            'Your email is not confirmed yet. Please check your inbox or resend the confirmation email.'
          );
        }

        if (loginError.message.toLowerCase().includes('invalid login credentials')) {
          throw new Error(
            'Invalid email or password. Check your details or create an account first.'
          );
        }

        throw loginError;
      }

      if (!data.session || !data.user) {
        throw new Error(
          'Login did not create a valid session. Please try again.'
        );
      }

      router.replace('/dashboard');
      router.refresh();

    } catch (err) {
      console.error('Login error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please try again.'
      );
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
                <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                  RecallDesk AI
                </div>
                <div className="text-xl font-semibold text-white">
                  Customer Memory Platform
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-blue-300">
                  Secure sign-in
                </div>
                <h1 className="mt-2 text-3xl font-semibold text-white">
                  Sign in to your workspace
                </h1>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  Supabase authentication
                </div>
                <p className="mt-2 text-emerald-50/90">
                  Use your registered RecallDesk workspace email and password.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6 text-right text-sm text-slate-400">
              Need an account?{' '}
              <Link href="/signup" className="font-medium text-blue-300">
                Create one
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                  Work email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus-within:border-blue-500">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading}
                    className="w-full bg-transparent text-slate-100 outline-none"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="ml-2 text-slate-400"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-slate-600 bg-slate-900"
                  />
                  Remember me
                </label>

                <Link href="/forgot-password" className="text-blue-300">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-3 text-sm text-rose-200"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}