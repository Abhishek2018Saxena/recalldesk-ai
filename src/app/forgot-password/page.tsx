'use client';

import Link from 'next/link';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('alicia@recalldesk.ai');
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
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
            <div className="text-xl font-semibold text-white">Recover access</div>
          </div>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-300"><CheckCircle2 className="h-5 w-5" /> Password reset email sent</div>
            <p className="text-sm text-slate-300">A reset link has been sent to {email}. Please check your inbox and follow the secure password update flow.</p>
            <Link href="/login" className="inline-flex rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">Work email</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white">Send reset link</button>
            <div className="text-center text-sm text-slate-400">
              Remembered it? <Link href="/login" className="font-medium text-blue-300">Go back</Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
