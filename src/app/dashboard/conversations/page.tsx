import { Clock3 } from 'lucide-react';
import Link from 'next/link';
import { conversations } from '@/lib/mock-data';

export default function DashboardConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Conversation History</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Recent support interactions</h1>
      </div>

      <div className="space-y-4">
        {conversations.map((conversation) => (
          <Link key={conversation.id} href={`/dashboard/conversations/${conversation.id}`} className="block rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-blue-500/30">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-lg font-semibold text-white">{conversation.title}</div>
                <div className="mt-1 text-sm text-slate-400">{conversation.id} • Customer {conversation.customerId}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200">{conversation.status}</span>
                <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-violet-200">{conversation.sentiment}</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300">{conversation.summary}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="rounded-full bg-slate-800 px-2 py-1">Memory: {conversation.memoryUsed ? 'used' : 'not used'}</span>
              <span className="rounded-full bg-slate-800 px-2 py-1">Knowledge: {conversation.knowledgeUsed ? 'used' : 'not used'}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {conversation.lastUpdated}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
