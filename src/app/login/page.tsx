'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { setDemoSession } from '@/lib/demo-session';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinueDemo = () => {
    setError('');
    setDemoSession(true);
    router.replace('/dashboard');
    router.refresh();
  };

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
      setError('Password must contain at least 8 characters.');
      return;
    }

    // Verify Supabase client before making the request.
    const client = supabase;

    if (!client) {
      setError(
        'Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } =
        await client.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (loginError) {
        const message = loginError.message.toLowerCase();

        if (message.includes('invalid api key') || message.includes('apikey')) {
          throw new Error(
            'Invalid Supabase API key. Verify that your Project URL and Publishable key belong to the same Supabase project.'
          );
        }

        if (message.includes('email not confirmed')) {
          throw new Error(
            'Your email is not confirmed. Please check your inbox and confirm your account.'
          );
        }

        if (message.includes('invalid login credentials')) {
          throw new Error(
            'Incorrect email or password. Please check your login details.'
          );
        }

        throw loginError;
      }

      if (!data.user || !data.session) {
        throw new Error(
          'Login did not create a valid session. Please try again.'
        );
      }

      // Navigate only after Supabase confirms successful authentication.
      router.replace('/dashboard');
      router.refresh();

    } catch (err) {
      console.error('Supabase login error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while signing in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto grid min-h-[650px] max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">

        {/* Left section */}
        <section className="flex flex-col justify-between border-b border-slate-800 bg-slate-950 p-8 lg:border-b-0 lg:border-r">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/15 p-3 text-blue-400">
                <Sparkles className="h-6 w-6" />
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  RecallDesk AI
                </p>
                <p className="text-xs text-slate-400">
                  Customer Memory Platform
                </p>
              </div>
            </Link>
          </div>

          <div className="my-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
              Welcome back
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white">
              Every conversation remembers.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-slate-400">
              Continue managing customer conversations with intelligent
              memory, contextual support and a unified workspace.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-emerald-300">
                  Secure authentication
                </p>
                <p className="text-xs text-slate-400">
                  Your workspace is protected by Supabase Auth.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            RecallDesk AI · Intelligent Customer Support
          </p>
        </section>

        {/* Login section */}
        <section className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8 text-right text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Sign up
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">
              Sign in
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-4 focus-within:border-blue-500">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-3 text-white outline-none placeholder:text-slate-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="ml-2 text-slate-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in to RecallDesk'}
            </button>

            <button
              type="button"
              onClick={handleContinueDemo}
              className="mt-3 w-full rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3.5 font-semibold text-amber-200 transition hover:border-amber-400 hover:bg-amber-500/15"
            >
              Continue in Demo Mode
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            By signing in, you agree to use your authorized workspace account.
          </p>
        </section>
      </div>
    </main>
  );
}