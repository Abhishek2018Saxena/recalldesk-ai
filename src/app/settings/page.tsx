import { settings } from '@/lib/mock-data';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-300">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Platform configuration</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="text-xl font-semibold text-white">Account profile</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span>Role</span><span className="text-white">{settings.role}</span></div>
            <div className="flex items-center justify-between"><span>Organization</span><span className="text-white">{settings.organization}</span></div>
            <div className="flex items-center justify-between"><span>Environment</span><span className="text-white">{settings.environment}</span></div>
            <div className="flex items-center justify-between"><span>Data retention</span><span className="text-white">{settings.dataRetentionDays} days</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="text-xl font-semibold text-white">Security posture</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">Server-side authorization enforced for all customer data access paths.</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">Secrets remain in environment variables and never exposed to the client.</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">Customer memory isolation and demo labels are applied before any response generation.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
