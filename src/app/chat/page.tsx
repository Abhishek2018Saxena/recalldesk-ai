'use client';

import { Bot, MessageSquareText, RefreshCw, SendHorizonal, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createConversationId, createMessage, type ConversationRecord } from '@/lib/conversation-store';

const STORAGE_KEY = 'recalldesk-simple-chat';

export default function ChatPage() {
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [selectedThread, setSelectedThread] = useState('Priya Nair');
  const [draft, setDraft] = useState('I’d like the latest carrier update and a summary for the support ticket.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/conversations');
        const payload = (await response.json()) as ConversationRecord[];
        if (Array.isArray(payload) && payload.length) {
          setConversations(payload);
          setSelectedThread(payload[0]?.customerName ?? 'Priya Nair');
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
          }
        }
      } catch {
        if (typeof window === 'undefined') return;
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as ConversationRecord[];
            if (Array.isArray(parsed) && parsed.length) {
              setConversations(parsed);
              setSelectedThread(parsed[0]?.customerName ?? 'Priya Nair');
            }
          } catch {
            // no-op
          }
        }
      }
    };

    void load();
  }, []);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.customerName === selectedThread) ?? conversations[0] ?? null,
    [conversations, selectedThread],
  );

  const messages = activeConversation?.messages ?? [];

  const handleSubmit = async () => {
    if (!draft.trim() || !activeConversation || loading) return;

    const userMessage = createMessage('customer', activeConversation.customerName, draft.trim());
    const updatedConversation: ConversationRecord = {
      ...activeConversation,
      messages: [...activeConversation.messages, userMessage],
      summary: draft.trim(),
      lastUpdated: new Date().toISOString(),
    };

    setConversations((current) => current.map((conversation) => (conversation.id === activeConversation.id ? updatedConversation : conversation)));
    setDraft('');
    setLoading(true);
    setError(null);

    try {
      const persistedConversation = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConversation),
      }).then((response) => response.json() as Promise<ConversationRecord>);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: persistedConversation.id,
          customerId: persistedConversation.customerId,
          customerName: persistedConversation.customerName,
          message: userMessage.text,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Backend error');
      }

      const agentMessage = createMessage('agent', 'AI Agent', payload.answer || 'I’m unable to provide a grounded response right now.');
      const nextConversation: ConversationRecord = {
        ...persistedConversation,
        messages: [...updatedConversation.messages, agentMessage],
        summary: payload.answer || updatedConversation.summary,
        lastUpdated: new Date().toISOString(),
      };

      setConversations((current) => current.map((conversation) => (conversation.id === activeConversation.id ? nextConversation : conversation)));
      await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextConversation),
      });
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Could not get a response';
      setError(message);
      const failureMessage = createMessage('system', 'System', `AI request failed: ${message}. Configure OPENAI_API_KEY or AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT in Vercel before retrying.`);
      const failedConversation: ConversationRecord = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, failureMessage],
      };
      setConversations((current) => current.map((conversation) => (conversation.id === activeConversation.id ? failedConversation : conversation)));
    } finally {
      setLoading(false);
    }
  };

  const handleThreadSelect = (customer: string) => {
    setSelectedThread(customer);
    setDraft('I’d like the latest carrier update and a summary for the support ticket.');
    setError(null);
  };

  const handleNewConversation = () => {
    const customerName = 'New Customer';
    const newConversation: ConversationRecord = {
      id: createConversationId(),
      customerId: 'C-9999',
      customerName,
      title: 'Fresh support conversation',
      status: 'Open',
      sentiment: 'Neutral',
      lastUpdated: new Date().toISOString(),
      summary: 'Fresh conversation opened.',
      memoryUsed: false,
      knowledgeUsed: false,
      messages: [
        createMessage('customer', customerName, 'I need a fresh follow-up on my case.'),
        createMessage('agent', 'AI Agent', 'I’ve started a new conversation and am checking the issue details before responding.'),
      ],
    };

    setConversations((current) => [newConversation, ...current]);
    setSelectedThread(customerName);
    setDraft('');
    setError(null);
    void fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConversation),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">AI Support Chat</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Customer conversations</h1>
        </div>
        <button type="button" onClick={handleNewConversation} className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white">New conversation</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Inbox</h2>
            <RefreshCw className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-2">
            {conversations.map((thread) => (
              <button key={thread.id} type="button" onClick={() => handleThreadSelect(thread.customerName)} className={`w-full rounded-xl border p-3 text-left ${selectedThread === thread.customerName ? 'border-blue-500/60 bg-blue-500/5' : 'border-slate-800 bg-slate-950/60'}`}>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{thread.customerName}</div>
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-300">{thread.status}</span>
                </div>
                <div className="mt-2 text-sm text-slate-400">{thread.summary}</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-lg font-semibold text-white">{selectedThread} • Enterprise</div>
              <div className="text-sm text-slate-400">{activeConversation?.title ?? 'No active conversation'} • sentiment: {activeConversation?.sentiment ?? 'neutral'}</div>
            </div>
            <div className="flex gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-violet-500/10 px-2 py-1 text-violet-200">Memory recalled</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-200">Policy source used</span>
            </div>
          </div>

          <div className="space-y-4 rounded-xl bg-slate-950/60 p-4">
            {messages.map((entry, index) => (
              <div key={`${entry.id}-${index}`} className={`flex gap-3 ${entry.type === 'agent' ? 'justify-end' : ''}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${entry.type === 'agent' ? 'bg-blue-500/20 text-blue-200' : 'bg-slate-800 text-slate-100'}`}>
                  {entry.type === 'agent' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${entry.type === 'agent' ? 'bg-blue-500/10 text-slate-100' : 'bg-slate-800 text-slate-200'}`}>
                  <div className="mb-1 text-xs uppercase tracking-[0.15em] text-slate-400">{entry.author}</div>
                  <div className="text-sm">{entry.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <MessageSquareText className="h-5 w-5 text-slate-400" />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-300 outline-none"
              placeholder="Type a customer message…"
            />
            <button type="button" disabled={loading} onClick={() => void handleSubmit()} className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              <SendHorizonal className="h-4 w-4" /> {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
          {error ? <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div> : null}
        </section>
      </div>
    </div>
  );
}
