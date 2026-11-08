import { integrationStatus } from '@/lib/mock-data';

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">Integrations</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Connected services and readiness</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrationStatus.map((integration) => (
          <div key={integration.name} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-white">{integration.name}</div>
              <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200">{integration.status}</span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{integration.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
