import Link from 'next/link';
import { customers, memoryItems, tickets } from '@/lib/mock-data';

export default function DashboardCustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = customers.find((entry) => entry.id === params.id) ?? customers[0];
  const customerTickets = tickets.filter((ticket) => ticket.customerId === customer.id);
  const customerMemories = memoryItems.filter((memory) => memory.customerId === customer.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">Customer</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{customer.name}</h1>
        </div>
        <Link href="/dashboard/customers" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">Back to customers</Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-semibold text-white">
                {customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-white">{customer.name}</div>
                <div className="text-sm text-slate-400">{customer.company}</div>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between"><span>Email</span><span className="text-white">{customer.email}</span></div>
              <div className="flex items-center justify-between"><span>Region</span><span className="text-white">{customer.region}</span></div>
              <div className="flex items-center justify-between"><span>Tier</span><span className="text-white">{customer.tier}</span></div>
              <div className="flex items-center justify-between"><span>Status</span><span className="text-white">{customer.status}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <h2 className="text-lg font-semibold text-white">AI memory</h2>
            <div className="mt-4 space-y-3">
              {customerMemories.map((memory) => (
                <div key={memory.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
                  <div className="font-medium text-white">{memory.title}</div>
                  <p className="mt-2">{memory.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <h2 className="text-lg font-semibold text-white">Recent ticket history</h2>
            <div className="mt-4 space-y-3">
              {customerTickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-white">{ticket.subject}</div>
                    <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-blue-200">{ticket.status}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">{ticket.summary}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <h2 className="text-lg font-semibold text-white">Customer preferences</h2>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">{customer.preference}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
