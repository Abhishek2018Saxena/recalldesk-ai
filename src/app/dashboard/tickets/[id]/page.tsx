import { tickets } from '@/lib/mock-data';

export default function DashboardTicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = tickets.find((entry) => entry.id === params.id) ?? tickets[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">Ticket</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{ticket.id}</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-lg font-semibold text-white">{ticket.subject}</div>
          <p className="mt-4 text-sm text-slate-300">{ticket.summary}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300"><span className="text-slate-500">Category:</span> {ticket.category}</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300"><span className="text-slate-500">Priority:</span> {ticket.priority}</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300"><span className="text-slate-500">Status:</span> {ticket.status}</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300"><span className="text-slate-500">Assigned:</span> {ticket.assignedTo}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Timeline</div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span>Created</span><span className="text-white">{ticket.createdAt}</span></div>
            <div className="flex items-center justify-between"><span>Updated</span><span className="text-white">{ticket.updatedAt}</span></div>
            <div className="flex items-center justify-between"><span>Customer</span><span className="text-white">{ticket.customerId}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
