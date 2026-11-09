'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type CustomerRecord = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  tier?: string | null;
  region?: string | null;
  status?: string | null;
  value?: string | null;
  preference?: string | null;
};

export default function DashboardCustomersPage() {
  const [query, setQuery] = useState('');
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        const payload = (await response.json()) as CustomerRecord[];
        setCustomers(Array.isArray(payload) ? payload : []);
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : 'Unable to load customers';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return customers;
    }

    return customers.filter((customer) => {
      const searchable = [customer.name, customer.id, customer.email ?? '', customer.phone ?? ''].join(' ').toLowerCase();
      return searchable.includes(normalized);
    });
  }, [customers, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">Customers</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Customer 360</h1>
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, ID, email or phone"
            className="w-64 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </label>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">Loading customers…</div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">{error}</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">No customers found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Link key={customer.id} href={`/dashboard/customers/${customer.id}`} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-blue-500/30 hover:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-semibold text-white">
                    {customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{customer.name}</div>
                    <div className="text-xs text-slate-400">{customer.id}</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-200">{customer.status}</span>
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-300">
                <div className="flex items-center justify-between"><span>Email</span><span className="text-slate-100">{customer.email ?? '—'}</span></div>
                <div className="flex items-center justify-between"><span>Phone</span><span className="text-slate-100">{customer.phone ?? '—'}</span></div>
                <div className="flex items-center justify-between"><span>Region</span><span className="text-slate-100">{customer.region ?? '—'}</span></div>
                <div className="flex items-center justify-between"><span>Tier</span><span className="text-slate-100">{customer.tier ?? '—'}</span></div>
                <div className="flex items-center justify-between"><span>Value</span><span className="text-slate-100">{customer.value ?? '—'}</span></div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Preference</div>
                <p className="mt-2">{customer.preference ?? 'No preference recorded.'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
