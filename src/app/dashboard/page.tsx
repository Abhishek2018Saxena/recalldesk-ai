import { Activity, ArrowUpRight, BellDot, BrainCircuit, Clock3, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { aiSignals, analyticsTrend, alertItems, customers, demoTimeline, memoryItems, overviewStats, tickets } from '@/lib/mock-data';

const toneMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-200 ring-blue-400/20',
  green: 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/20',
  amber: 'bg-amber-500/10 text-amber-200 ring-amber-400/20',
  purple: 'bg-violet-500/10 text-violet-200 ring-violet-400/20',
  rose: 'bg-rose-500/10 text-rose-200 ring-rose-400/20',
  cyan: 'bg-cyan-500/10 text-cyan-200 ring-cyan-400/20',
};

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-300">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Good morning, Alicia</h1>
          <p className="mt-2 text-sm text-slate-300">Here&apos;s what&apos;s happening across your support operations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">Last 7 days</div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-200">
            <ShieldCheck className="h-4 w-4" /> Demo mode active
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-200">
            <BrainCircuit className="h-4 w-4" /> Hindsight: Demo adapter
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-slate-400">{stat.label}</span>
              <span className={`rounded-full px-2 py-1 text-[10px] ring-1 ${toneMap[stat.tone]}`}>{stat.change}</span>
            </div>
            <div className="mt-4 text-3xl font-semibold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Support conversation trends</h2>
              <p className="text-sm text-slate-400">Conversations and successful resolutions</p>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">Last 7 days</div>
          </div>
          <div className="h-72 rounded-xl bg-slate-950/60 p-3">
            <div className="flex h-full items-end gap-4">
              {analyticsTrend.map((item) => (
                <div key={item.day} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <div className="flex w-full items-end justify-center gap-1">
                    <div className="w-1/2 rounded-t-md bg-blue-500/80" style={{ height: `${(item.conversations / 1400) * 100}%` }} />
                    <div className="w-1/2 rounded-t-md bg-emerald-500/80" style={{ height: `${(item.resolved / 1400) * 100}%` }} />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">AI service status</h2>
              <p className="text-sm text-slate-400">Connection health and readiness</p>
            </div>
            <Sparkles className="h-5 w-5 text-blue-300" />
          </div>
          <div className="space-y-4">
            {aiSignals.map((signal) => (
              <div key={signal.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>{signal.label}</span>
                  <span>{signal.value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className={`${signal.color} h-2 rounded-full`} style={{ width: signal.value }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent conversations</h2>
            <Link href="/dashboard/chat" className="text-sm text-blue-300">Open chat</Link>
          </div>
          <div className="space-y-3">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div>
                  <div className="font-medium text-white">{customer.name}</div>
                  <div className="text-xs text-slate-400">{customer.company} • {customer.lastSeen}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-violet-200">{customer.sentiment}</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Urgent tickets</h2>
            <BellDot className="h-5 w-5 text-amber-300" />
          </div>
          <div className="space-y-3">
            {tickets.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-white">{ticket.id}</div>
                  <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-amber-200">{ticket.priority}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{ticket.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Pending escalations</h2>
            <Activity className="h-5 w-5 text-rose-300" />
          </div>
          <div className="space-y-3 text-sm text-slate-200">
            {alertItems.map((item) => (
              <div key={item} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">AI memory activity</h2>
            <Sparkles className="h-5 w-5 text-violet-300" />
          </div>
          <div className="space-y-3">
            {memoryItems.map((memory) => (
              <div key={memory.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{memory.title}</div>
                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-violet-200">{memory.source}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{memory.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Knowledge updates</h2>
            <Clock3 className="h-5 w-5 text-emerald-300" />
          </div>
          <div className="space-y-3">
            {demoTimeline.map((entry) => (
              <div key={entry.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-medium text-white">{entry.title}</div>
                <div className="mt-2 text-sm text-slate-300">{entry.detail}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">{entry.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
