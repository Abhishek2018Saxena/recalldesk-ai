import { escalations } from '@/lib/mock-data';

export default function DashboardEscalationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-rose-300">Human Escalations</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Escalation review queue</h1>
      </div>

      <div className="space-y-4">
        {escalations.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-lg font-semibold text-white">{item.id}</div>
                <div className="text-sm text-slate-400">Customer {item.customerId}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose-500/10 px-2 py-1 text-xs text-rose-200">{item.priority}</span>
                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-200">{item.status}</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{item.reason}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="rounded-full bg-slate-800 px-2 py-1">Sentiment: {item.sentiment}</span>
              <span className="rounded-full bg-slate-800 px-2 py-1">Created {item.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
