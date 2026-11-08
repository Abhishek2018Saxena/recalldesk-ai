import { Clock3 } from 'lucide-react';

const timeline = [
  { title: 'Delayed order followed up', detail: 'Customer reported a late shipment and asked for the latest delivery ETA.', time: '2 days ago' },
  { title: 'AI memory retained', detail: 'The previous shipment issue and preference for email follow-up were stored in Hindsight memory.', time: '1 day ago' },
  { title: 'Human escalation accepted', detail: 'A support agent accepted the escalation and reviewed the shipment timeline.', time: '4 hours ago' },
  { title: 'Ticket resolved', detail: 'The replacement order was scheduled and a final email summary was sent.', time: '30 min ago' },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Conversation History</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Recent support interactions</h1>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="mb-4 flex items-center gap-2 text-slate-200">
          <Clock3 className="h-5 w-5 text-cyan-300" />
          Timeline
        </div>
        <div className="space-y-4">
          {timeline.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-cyan-400" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-white">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.time}</div>
                </div>
                <div className="mt-2 text-sm text-slate-300">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
