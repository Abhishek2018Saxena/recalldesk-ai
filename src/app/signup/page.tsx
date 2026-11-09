'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', company: '', role: '', password: '', confirmPassword: '' });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.includes('@')) {
      setError('Please provide a valid name and work email.');
      return;
    }

    if (form.password.length < 8 || form.password !== form.confirmPassword) {
      setError('Password must be at least 8 characters and match the confirmation field.');
      return;
    }

    if (!accepted) {
      setError('You must accept the terms before creating your account.');
      return;
    }

    if (!supabase) {
      setError('Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel to create an account.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_AUTH_REDIRECT_URL || (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:3000/auth/callback');

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            company: form.company.trim(),
            role: form.role.trim(),
          },
          emailRedirectTo: redirectTo,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user && !data.session) {
        setError('Account created. Check your email inbox and confirm the address before signing in.');
        return;
      }

      router.replace('/dashboard');
      router.refresh();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Account creation failed. Please check your details and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-blue-950/20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">RecallDesk AI</div>
              <div className="text-xl font-semibold text-white">Create your workspace</div>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            Already have an account? <Link href="/login" className="font-medium text-blue-300">Sign in</Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Full name</label>
            <input value={form.fullName} onChange={(event) => handleChange('fullName', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Work email</label>
            <input value={form.email} onChange={(event) => handleChange('email', event.target.value)} type="email" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Company name</label>
            <input value={form.company} onChange={(event) => handleChange('company', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Job role</label>
            <input value={form.role} onChange={(event) => handleChange('role', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
            <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus-within:border-blue-500">
              <input value={form.password} onChange={(event) => handleChange('password', event.target.value)} type={showPassword ? 'text' : 'password'} className="w-full bg-transparent outline-none" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="ml-2 text-slate-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Confirm password</label>
            <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus-within:border-blue-500">
              <input value={form.confirmPassword} onChange={(event) => handleChange('confirmPassword', event.target.value)} type={showConfirm ? 'text' : 'password'} className="w-full bg-transparent outline-none" />
              <button type="button" onClick={() => setShowConfirm((value) => !value)} className="ml-2 text-slate-400">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={accepted} onChange={() => setAccepted((value) => !value)} className="rounded border-slate-600 bg-slate-900" />
              I agree to the platform terms, security policies, and privacy controls.
            </label>
          </div>

          {error ? <div className="md:col-span-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div> : null}

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70">{loading ? 'Creating account…' : 'Create account'}</button>
            <button type="button" onClick={() => router.push('/login')} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200">Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
}
