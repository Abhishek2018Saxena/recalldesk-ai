'use client';

import { Bot, MessageSquareText, SendHorizonal, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createConversationId, createMessage, getConversationStore, replaceConversationStore, type ConversationRecord } from '@/lib/conversation-store';
import { isDemoSessionActive } from '@/lib/demo-session';

const STORAGE_KEY = 'recalldesk-conversation-threads';

export default function DashboardChatPage() {
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState('I’d like the latest carrier update and a summary for the support ticket.');
  const [status, setStatus] = useState('Memory recall active');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      if (isDemoSessionActive()) {
        const seeded = getConversationStore();
        setConversations(seeded);
        setActiveConversationId((current) => current ?? seeded[0]?.id ?? null);
        return;
      }

      try {
        const response = await fetch('/api/conversations');
        const payload = (await response.json()) as ConversationRecord[];
        const seeded = Array.isArray(payload) && payload.length ? payload : [];
        setConversations(seeded);
        setActiveConversationId((current) => current ?? seeded[0]?.id ?? null);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        }
      } catch {
        if (typeof window === 'undefined') return;
        try {
          const stored = window.localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored) as ConversationRecord[];
            if (Array.isArray(parsed) && parsed.length) {
              setConversations(parsed);
              setActiveConversationId(parsed[0]?.id ?? null);
            }
          }
        } catch {
          // no-op: leave empty state and allow user to create one
        }
      }
    };

    void loadConversations();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && conversations.length) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      if (isDemoSessionActive()) {
        replaceConversationStore(conversations);
      }
    }
  }, [conversations]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0] ?? null,
    [activeConversationId, conversations],
  );

  const messages = activeConversation?.messages ?? [];

  const persistConversation = async (conversation: ConversationRecord) => {
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversation),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Conversation update failed.' }));
      throw new Error(payload.error || 'Conversation update failed.');
    }

    return (await response.json()) as ConversationRecord;
  };

  const createNewConversation = async () => {
    const customerName = 'Priya Nair';
    const newConversationId = createConversationId();
    const newConversation: ConversationRecord = {
      id: newConversationId,
      customerId: 'C-1048',
      customerName,
      title: 'Fresh support conversation',
      status: 'Open',
      sentiment: 'Neutral',
      lastUpdated: new Date().toISOString(),
      summary: 'Fresh conversation opened for a new support follow-up.',
      memoryUsed: false,
      knowledgeUsed: false,
      messages: [
        createMessage('customer', customerName, 'I would like a fresh update on my issue and a brief summary of the next steps.'),
        createMessage('agent', 'AI Agent', 'I’ve started a new conversation and am checking the current customer context before responding.'),
      ],
    };

    const nextConversations = [newConversation, ...conversations];
    setConversations(nextConversations);
    if (isDemoSessionActive()) {
      replaceConversationStore(nextConversations);
    }
    setActiveConversationId(newConversation.id);
    setDraft('');
    setStatus('Fresh conversation started');
    setError(null);

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConversation),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Failed to create new conversation.' }));
        throw new Error(payload.error || 'Failed to create new conversation.');
      }
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unknown conversation error';
      setError(message);
    }
  };

  const handleEscalate = () => {
    if (!activeConversation) return;

    const escalationMessage = createMessage('system', 'System', 'Escalation created: a human support case is being prepared with the customer’s memory and issue summary attached.');
    const updatedConversation: ConversationRecord = {
      ...activeConversation,
      status: 'Escalated',
      sentiment: 'Frustrated',
      lastUpdated: new Date().toISOString(),
      summary: 'Escalation queued for human support with the latest customer context attached.',
      messages: [...activeConversation.messages, escalationMessage],
    };

    setConversations((current) => current.map((conversation) => (conversation.id === activeConversation.id ? updatedConversation : conversation)));
    void persistConversation(updatedConversation).catch(() => undefined);
    setStatus('Escalation queued for human support');
  };

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!activeConversation || !trimmed || isSending) {
      return;
    }

    const userMessage = createMessage('customer', activeConversation.customerName, trimmed);
    const updatedConversation: ConversationRecord = {
      ...activeConversation,
      lastUpdated: new Date().toISOString(),
      summary: trimmed,
      messages: [...activeConversation.messages, userMessage],
    };

    setConversations((current) => current.map((conversation) => (conversation.id === activeConversation.id ? updatedConversation : conversation)));
    setDraft('');
    setIsSending(true);
    setError(null);

    try {
      const persistedConversation = await persistConversation(updatedConversation);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: persistedConversation.id,
          customerId: persistedConversation.customerId,
          customerName: persistedConversation.customerName,
          message: trimmed,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'The AI backend did not respond successfully.');
      }

      const agentMessage = createMessage('agent', 'AI Agent', payload.answer || 'I’m unable to provide a grounded response right now.');
      const finalConversation: ConversationRecord = {
        ...persistedConversation,
        memoryUsed: Boolean(payload.memoryUsed),
        knowledgeUsed: Boolean(payload.knowledgeUsed),
        messages: [...persistedConversation.messages, agentMessage],
        summary: payload.answer || persistedConversation.summary,
        lastUpdated: new Date().toISOString(),
      };

      setConversations((current) => current.map((conversation) => (conversation.id === activeConversation.id ? finalConversation : conversation)));
      setStatus(payload.mode === 'live' ? 'Live AI backend active' : 'Live AI backend active');
      await persistConversation(finalConversation);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unknown AI backend error';
      setError(message);
      const failureMessage = createMessage('system', 'System', `AI request failed: ${message}. Configure OPENAI_API_KEY or AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT in Vercel before retrying.`);
      const failedConversation: ConversationRecord = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, failureMessage],
      };
      setConversations((current) => current.map((conversation) => (conversation.id === activeConversation.id ? failedConversation : conversation)));
      await persistConversation(failedConversation).catch(() => undefined);
    } finally {
      setIsSending(false);
    }
  };

  const customerName = activeConversation?.customerName ?? 'Customer';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-300">AI Support Chat</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Customer conversations</h1>
        </div>
        <button type="button" onClick={() => void createNewConversation()} className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white">New conversation</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Inbox</h2>
            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">{conversations.length} live</span>
          </div>
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setActiveConversationId(conversation.id)}
                className={`w-full rounded-xl border p-3 text-left transition hover:border-slate-700 ${activeConversation?.id === conversation.id ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 bg-slate-950/60'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-white">{conversation.customerName}</div>
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-300">{conversation.status}</span>
                </div>
                <div className="mt-2 text-sm text-slate-400">{conversation.summary}</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          {activeConversation ? (
            <>
              <div className="mb-4 flex flex-col gap-3 border-b border-slate-800 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-lg font-semibold text-white">{customerName} • Enterprise</div>
                  <div className="text-sm text-slate-400">Issue: {activeConversation.title} • sentiment: {activeConversation.sentiment.toLowerCase()} • {status}</div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-violet-200">{activeConversation.memoryUsed ? 'Memory recalled' : 'No prior memory'}</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-200">{activeConversation.knowledgeUsed ? 'Policy source used' : 'Knowledge pending'}</span>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-4 rounded-xl bg-slate-950/60 p-4">
                  {messages.map((entry, index) => (
                    <div key={`${entry.id}-${index}`} className={`flex gap-3 ${entry.type === 'agent' ? 'justify-end' : ''}`}>
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
                      <div className="flex items-center justify-between"><span>Name</span><span className="text-white">{activeConversation.customerName}</span></div>
                      <div className="flex items-center justify-between"><span>ID</span><span className="text-white">{activeConversation.customerId}</span></div>
                      <div className="flex items-center justify-between"><span>Status</span><span className="text-white">{activeConversation.status}</span></div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Conversation ID</div>
                    <div className="text-sm text-slate-300">{activeConversation.id}</div>
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
            </>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-slate-300">No active conversation. Create a new one to start.</div>
          )}
        </section>
      </div>
    </div>
  );
}
