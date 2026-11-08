import { Bot, MessageSquareText, RefreshCw, User } from 'lucide-react';

const chatThreads = [
  { customer: 'Priya Nair', preview: 'The delayed order is resolved—can you send the updated ETA?', status: 'Resolved' },
  { customer: 'Marcus Lee', preview: 'I need a human agent to review the shipment delay.', status: 'Escalated' },
  { customer: 'Alicia Gomez', preview: 'I still cannot reset my multi-factor authentication.', status: 'Open' },
];

const transcript = [
  { type: 'customer', author: 'Priya Nair', text: 'I wanted an update on my delayed order. The product arrived late and I was frustrated by the lack of status updates.' },
  { type: 'agent', author: 'AI Agent', text: 'I’m seeing a previous order delay for this customer and the delivery policy indicates a replacement may be eligible. I can help with the latest shipment update.' },
  { type: 'customer', author: 'Priya Nair', text: 'Thanks, I’d prefer an email summary after resolution.' },
  { type: 'agent', author: 'AI Agent', text: 'Understood. I’ve identified the relevant memory and will include the update in the summary. No unnecessary repeat questions are needed.' },
];

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">AI Support Chat</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Customer conversations</h1>
        </div>
        <button className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white">New conversation</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Inbox</h2>
            <RefreshCw className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-2">
            {chatThreads.map((thread) => (
              <button key={thread.customer} className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{thread.customer}</div>
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-300">{thread.status}</span>
                </div>
                <div className="mt-2 text-sm text-slate-400">{thread.preview}</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-lg font-semibold text-white">Priya Nair • Enterprise</div>
              <div className="text-sm text-slate-400">Order delay • sentiment: frustrated</div>
            </div>
            <div className="flex gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-violet-500/10 px-2 py-1 text-violet-200">Memory recalled</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-200">Policy source used</span>
            </div>
          </div>

          <div className="space-y-4 rounded-xl bg-slate-950/60 p-4">
            {transcript.map((entry) => (
              <div key={entry.text} className={`flex gap-3 ${entry.type === 'agent' ? 'justify-end' : ''}`}>
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
              value="I’d like the latest carrier update and a summary for the support ticket."
              readOnly
              className="w-full bg-transparent text-sm text-slate-300 outline-none"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
