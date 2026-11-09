'use client';

import { useEffect, useState } from 'react';
import { type ConversationRecord } from '@/lib/conversation-store';

export default function DashboardConversationDetailPage({ params }: { params: { id: string } }) {
  const [conversation, setConversation] = useState<ConversationRecord | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/conversations');
        const payload = (await response.json()) as ConversationRecord[];
        const match = (Array.isArray(payload) ? payload : []).find((entry) => entry.id === params.id) ?? null;
        setConversation(match);
      } catch {
        setConversation(null);
      }
    };

    void load();
  }, [params.id]);

  if (!conversation) {
    return <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300">Conversation not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Conversation</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{conversation.title}</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Customer</div>
              <div className="mt-2 text-lg font-medium text-white">{conversation.customerName} ({conversation.customerId})</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Summary</div>
              <p className="mt-2 text-sm text-slate-300">{conversation.summary}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Messages</div>
              <div className="mt-3 space-y-3">
                {conversation.messages.map((message, index) => (
                  <div key={`${message.id}-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
                    <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">{message.author}</div>
                    <div className="text-sm text-slate-200">{message.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Metadata</div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span>Status</span><span className="text-white">{conversation.status}</span></div>
            <div className="flex items-center justify-between"><span>Sentiment</span><span className="text-white">{conversation.sentiment}</span></div>
            <div className="flex items-center justify-between"><span>Updated</span><span className="text-white">{conversation.lastUpdated}</span></div>
            <div className="flex items-center justify-between"><span>Knowledge used</span><span className="text-white">{conversation.knowledgeUsed ? 'Yes' : 'No'}</span></div>
            <div className="flex items-center justify-between"><span>Conversation ID</span><span className="text-white">{conversation.id}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
