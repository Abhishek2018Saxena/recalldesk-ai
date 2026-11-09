'use client';

import { Activity, ArrowUpRight, MessageSquareText, ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OverviewAreaChart } from '@/components/charts';
import { analyticsTrend, customers, memoryItems, overviewStats, tickets } from '@/lib/mock-data';

const toneMap = {
  blue: 'bg-blue-500/10 text-blue-200 ring-blue-400/20',
  green: 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/20',
  amber: 'bg-amber-500/10 text-amber-200 ring-amber-400/20',
  purple: 'bg-violet-500/10 text-violet-200 ring-violet-400/20',
};

export default function OverviewPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">RecallDesk AI command center</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
          <ShieldCheck className="h-4 w-4" />
          Demo environment loaded
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{stat.label}</span>
              <span className={`rounded-full px-2 py-1 text-xs ring-1 ${toneMap[stat.tone as keyof typeof toneMap]}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Support demand</h2>
              <p className="text-sm text-slate-400">Weekly conversations and resolved cases</p>
            </div>
            <div className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Last 7 days</div>
          </div>
          <OverviewAreaChart data={analyticsTrend} />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">AI memory health</h2>
              <p className="text-sm text-slate-400">Recall accuracy and retention</p>
            </div>
            <Sparkles className="h-5 w-5 text-blue-300" />
          </div>
          <div className="mt-6 space-y-5">
            {[
              { label: 'Memory recall success', value: '94%', color: 'bg-emerald-400' },
              { label: 'Grounded answer rate', value: '91%', color: 'bg-blue-400' },
              { label: 'Escalation confidence', value: '88%', color: 'bg-violet-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Active cases</h2>
            <button type="button" onClick={() => router.push('/dashboard/tickets')} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">Open queue</button>
          </div>
          <div className="space-y-3">
            {tickets.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div>
                  <div className="text-sm font-medium text-slate-100">{ticket.subject}</div>
                  <div className="text-xs text-slate-400">{ticket.customerId} • {ticket.priority} priority</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="rounded-full bg-blue-500/10 px-2 py-1 text-blue-200">{ticket.status}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Customer pulse</h2>
            <Activity className="h-5 w-5 text-blue-300" />
          </div>
          <div className="space-y-3">
            {customers.map((customer) => (
              <div key={customer.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{customer.name}</div>
                  <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-200">{customer.status}</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">{customer.preference}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Memory recall highlights</h2>
            <MessageSquareText className="h-5 w-5 text-violet-300" />
          </div>
          <div className="space-y-3">
            {memoryItems.map((memory) => (
              <div key={memory.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{memory.title}</div>
                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs text-violet-200">{memory.source}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{memory.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="text-xl font-semibold text-white">Quick actions</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            <button type="button" onClick={() => router.push('/dashboard/chat')} className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-left">New conversation <ArrowUpRight className="h-4 w-4" /></button>
            <button type="button" onClick={() => router.push('/dashboard/tickets')} className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-left">Create ticket <ArrowUpRight className="h-4 w-4" /></button>
            <button type="button" onClick={() => router.push('/dashboard/escalations')} className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-left">Review escalations <ArrowUpRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
