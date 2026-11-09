'use client';

import { Clock3, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { searchConversations, type ConversationRecord } from '@/lib/conversation-store';

export default function DashboardConversationsPage() {
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/conversations');
        const payload = (await response.json()) as ConversationRecord[];
        setConversations(Array.isArray(payload) ? payload : []);
      } catch {
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const filteredConversations = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return conversations;
    return searchConversations(conversations, trimmed);
  }, [conversations, query]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Conversation History</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Recent support interactions</h1>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
        <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
            placeholder="Search conversations by customer, message, keyword, or summary…"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} className="rounded-full border border-slate-700 p-1 text-slate-300">
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </label>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-slate-300">Loading conversations…</div>
      ) : filteredConversations.length ? (
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <Link key={conversation.id} href={`/dashboard/conversations/${conversation.id}`} className="block rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-blue-500/30">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-lg font-semibold text-white">{conversation.title}</div>
                  <div className="mt-1 text-sm text-slate-400">{conversation.id} • {conversation.customerName} ({conversation.customerId})</div>
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
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-6 text-center text-slate-300">
          No conversations match your search. Try a different customer name, keyword, or summary.
        </div>
      )}
    </div>
  );
}
