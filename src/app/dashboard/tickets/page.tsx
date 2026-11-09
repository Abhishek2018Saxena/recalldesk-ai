'use client';

import { useState } from 'react';
import { tickets, type Ticket } from '@/lib/mock-data';

export default function DashboardTicketsPage() {
  const [ticketList, setTicketList] = useState(tickets);

  const handleCreateTicket = () => {
    const newTicket: Ticket = {
      id: `TCK-${Math.floor(Math.random() * 9000 + 1000)}`,
      customerId: 'C-4401',
      subject: 'Follow-up review for multi-factor reset',
      category: 'Access',
      priority: 'Medium',
      status: 'Open',
      assignedTo: 'A. Singh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      summary: 'Support created a fresh case after the customer reported a new account access problem during onboarding.',
    };

    setTicketList((current) => [newTicket, ...current]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">Ticket Management</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Operations queue</h1>
        </div>
        <button type="button" onClick={handleCreateTicket} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950">Create ticket</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-300">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {ticketList.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-950/40">
                <td className="px-4 py-3 font-medium text-white">{ticket.id}</td>
                <td className="px-4 py-3">{ticket.customerId}</td>
                <td className="px-4 py-3">{ticket.category}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-200">{ticket.priority}</span></td>
                <td className="px-4 py-3"><span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-200">{ticket.status}</span></td>
                <td className="px-4 py-3">{ticket.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
