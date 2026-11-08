import Link from 'next/link';

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-blue-950/20">
        <div className="text-sm uppercase tracking-[0.2em] text-blue-300">Authentication</div>
        <h1 className="mt-4 text-3xl font-semibold text-white">Callback complete</h1>
        <p className="mt-3 text-sm text-slate-300">In production this route would finalize the auth redirect from Supabase or Microsoft identity. In this demo environment, the session is created and the user can continue to the workspace.</p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white">Continue to dashboard</Link>
      </div>
    </main>
  );
}
