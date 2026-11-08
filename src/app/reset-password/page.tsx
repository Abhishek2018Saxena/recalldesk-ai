'use client';

import Link from 'next/link';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length >= 8 && password === confirm) {
      setSuccess(true);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-blue-950/20">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">RecallDesk AI</div>
            <div className="text-xl font-semibold text-white">Set a new password</div>
          </div>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-300"><CheckCircle2 className="h-5 w-5" /> Password updated</div>
            <p className="text-sm text-slate-300">Your password was changed successfully. You can sign in with the new credentials.</p>
            <Link href="/login" className="inline-flex rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white">Sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">New password</label>
              <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="confirm" className="mb-2 block text-sm font-medium text-slate-200">Confirm password</label>
              <input id="confirm" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white">Update password</button>
          </form>
        )}
      </div>
    </main>
  );
}
