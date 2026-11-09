'use client';

import { Bot, MessageSquareText, SendHorizonal, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { conversationThreadData, customers, memoryItems } from '@/lib/mock-data';

const STORAGE_KEY = 'recalldesk-chat-session';
const defaultTranscript = [
  { type: 'customer', author: 'Priya Nair', text: 'I’m still waiting on the delayed order update. The previous issue was not resolved clearly.' },
  { type: 'agent', author: 'AI Agent', text: 'I have the earlier delivery issue and your email follow-up preference in memory. I’m checking the shipment policy and ETA next.' },
  { type: 'customer', author: 'Priya Nair', text: 'Please include the latest status and send a brief summary by email when resolved.' },
  { type: 'agent', author: 'AI Agent', text: 'Understood. I’ll keep the response grounded in the delivery policy and the prior order context.' },
] as const;

export default function DashboardChatPage() {
  const [draft, setDraft] = useState('I’d like the latest carrier update and a summary for the support ticket.');
  const [status, setStatus] = useState('Memory recall active');
  const [messages, setMessages] = useState<Array<{ type: 'customer' | 'agent' | 'system'; author: string; text: string }>>(() => {
    if (typeof window === 'undefined') return [...defaultTranscript];
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [...defaultTranscript];
    try {
      const parsed = JSON.parse(stored) as Array<{ type: 'customer' | 'agent' | 'system'; author: string; text: string }>;
      return parsed.length ? parsed : [...defaultTranscript];
    } catch {
      return [...defaultTranscript];
    }
  });
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const customer = useMemo(() => customers[0], []);

  const createNewConversation = () => {
    setMessages([
      { type: 'customer', author: 'Priya Nair', text: 'I would like a fresh update on my delayed order and a brief follow-up summary.' },
      { type: 'agent', author: 'AI Agent', text: 'I’ve opened a new conversation and I’m checking the most recent memory and shipping guidance before responding.' },
    ]);
    setDraft('');
    setStatus('Fresh conversation started');
    setError(null);
  };

  const handleEscalate = () => {
    setMessages((current) => [
      ...current,
      { type: 'system', author: 'System', text: 'Escalation created: a human support case is being prepared with the customer’s memory and issue summary attached.' },
    ]);
    setStatus('Escalation queued for human support');
  };

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage = { type: 'customer' as const, author: customer.name, text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setDraft('');
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          customerName: customer.name,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'The AI backend did not respond successfully.');
      }

      setMessages((current) => [
        ...current,
        {
          type: 'agent',
          author: 'AI Agent',
          text: payload.answer || 'I’m unable to provide a grounded response right now.',
        },
      ]);
      setStatus(payload.mode === 'live' ? 'Live AI backend active' : 'Demo adapter active — live Hindsight not configured');
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unknown AI backend error';
      setError(message);
      setMessages((current) => [
        ...current,
        {
          type: 'system',
          author: 'System',
          text: `AI request failed: ${message}. Please verify the backend provider settings or continue in demo mode.`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-300">AI Support Chat</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Customer conversations</h1>
        </div>
        <button type="button" onClick={createNewConversation} className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white">New conversation</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Inbox</h2>
            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">3 live</span>
          </div>
          <div className="space-y-2">
            {conversationThreadData.map((thread) => (
              <button key={thread.customer} type="button" className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-left transition hover:border-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-white">{thread.customer}</div>
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-300">{thread.status}</span>
                </div>
                <div className="mt-2 text-sm text-slate-400">{thread.preview}</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex flex-col gap-3 border-b border-slate-800 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-lg font-semibold text-white">{customer.name} • {customer.tier}</div>
              <div className="text-sm text-slate-400">Issue: order delay • sentiment: frustrated • {status}</div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full bg-violet-500/10 px-2 py-1 text-violet-200">Memory recalled</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-200">Policy source used</span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4 rounded-xl bg-slate-950/60 p-4">
              {messages.map((entry, index) => (
                <div key={`${entry.author}-${entry.text}-${index}`} className={`flex gap-3 ${entry.type === 'agent' ? 'justify-end' : ''}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${entry.type === 'agent' ? 'bg-blue-500/20 text-blue-200' : 'bg-slate-800 text-slate-100'}`}>
                    {entry.type === 'agent' ? <Bot className="h-4 w-4" /> : entry.type === 'system' ? <MessageSquareText className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${entry.type === 'agent' ? 'bg-blue-500/10 text-slate-100' : entry.type === 'system' ? 'bg-amber-500/10 text-amber-100' : 'bg-slate-800 text-slate-200'}`}>
                    <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">{entry.author}</div>
                    <div className="text-sm">{entry.text}</div>
                  </div>
                </div>
              ))}

              {isSending ? (
                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-300">
                  <MessageSquareText className="h-5 w-5 text-slate-400" />
                  AI is drafting a response...
                </div>
              ) : null}

              {error ? <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div> : null}
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Customer</div>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center justify-between"><span>Name</span><span className="text-white">{customer.name}</span></div>
                  <div className="flex items-center justify-between"><span>Tier</span><span className="text-white">{customer.tier}</span></div>
                  <div className="flex items-center justify-between"><span>Region</span><span className="text-white">{customer.region}</span></div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Memory context</div>
                <div className="space-y-2 text-sm text-slate-300">
                  {memoryItems.slice(0, 2).map((memory) => (
                    <div key={memory.id} className="rounded-lg border border-slate-800 bg-slate-900 p-2">
                      <div className="font-medium text-white">{memory.title}</div>
                      <div className="mt-1 text-xs text-slate-400">{memory.source}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Knowledge</div>
                <div className="text-sm text-slate-300">Delivery exceptions and replacement policy. Source: Operations Manual • updated 2026-11-01.</div>
              </div>

              <button type="button" onClick={handleEscalate} className="w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-medium text-white">Escalate to human support</button>
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSend();
            }}
            className="mt-5 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-3"
          >
            <MessageSquareText className="h-5 w-5 text-slate-400" />
            <input value={draft} onChange={(event) => setDraft(event.target.value)} className="w-full bg-transparent text-sm text-slate-200 outline-none" placeholder="Type your reply…" />
            <button type="submit" disabled={isSending} className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
              <SendHorizonal className="h-4 w-4" /> {isSending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
