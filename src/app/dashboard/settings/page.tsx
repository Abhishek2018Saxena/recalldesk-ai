'use client';

import { useState } from 'react';
import { settings } from '@/lib/mock-data';

export default function DashboardSettingsPage() {
  const [config, setConfig] = useState(settings);
  const [savedAt, setSavedAt] = useState('Not saved yet');

  const handleFieldChange = (field: keyof typeof config, value: string) => {
    setConfig((current) => ({ ...current, [field]: value }));
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-300">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Workspace configuration</h1>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="text-xl font-semibold text-white">General settings</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <label className="block space-y-2">
              <span>Workspace</span>
              <input value={config.workspace} onChange={(event) => handleFieldChange('workspace', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-white outline-none" />
            </label>
            <label className="block space-y-2">
              <span>Organization</span>
              <input value={config.organization} onChange={(event) => handleFieldChange('organization', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-white outline-none" />
            </label>
            <label className="block space-y-2">
              <span>Environment</span>
              <input value={config.environment} onChange={(event) => handleFieldChange('environment', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-white outline-none" />
            </label>
            <label className="block space-y-2">
              <span>Time zone</span>
              <input value={config.timezone} onChange={(event) => handleFieldChange('timezone', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-white outline-none" />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="text-xl font-semibold text-white">Security posture</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">Server-side authorization enforced for all customer data access paths.</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">Secrets remain in environment variables and never exposed to the client.</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">Customer memory isolation and demo labeling are clearly visible to operators.</div>
          </div>
          <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200">
            <span>Last saved</span>
            <span className="text-emerald-200">{savedAt}</span>
          </div>
          <button type="submit" className="mt-5 w-full rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-950">Save changes</button>
        </div>
      </form>
    </div>
  );
}
