'use client';

import { Eye, Search, ShieldOff, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type MemoryRecord = {
  id: string;
  customer_id?: string | null;
  title: string;
  category: string;
  summary: string;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export default function DashboardMemoryPage() {
  const [memoryList, setMemoryList] = useState<MemoryRecord[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMemory = async () => {
      try {
        const response = await fetch('/api/memory');
        const payload = (await response.json()) as MemoryRecord[];
        const items = Array.isArray(payload) ? payload : [];
        setMemoryList(items);
        setSelectedId(items[0]?.id ?? '');
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : 'Unable to load memory items';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadMemory();
  }, []);

  const filteredMemory = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return memoryList;
    }

    return memoryList.filter((memory) => {
      const searchText = [memory.title, memory.summary, memory.category, memory.customer_id ?? ''].join(' ').toLowerCase();
      return searchText.includes(normalized);
    });
  }, [memoryList, query]);

  const selectedMemory = filteredMemory.find((memory) => memory.id === selectedId) ?? filteredMemory[0] ?? null;

  const handleDelete = (id: string) => {
    setMemoryList((current) => current.filter((memory) => memory.id !== id));
    if (selectedId === id) {
      const nextList = memoryList.filter((memory) => memory.id !== id);
      setSelectedId(nextList[0]?.id ?? '');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-fuchsia-300">AI Memory Centre</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Long-term memory and recall</h1>
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-64 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            placeholder="Search memories"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm uppercase tracking-[0.18em] text-slate-400">Hindsight connection: demo fallback</div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-200">
            <ShieldOff className="h-3.5 w-3.5" /> Not live connected
          </div>
        </div>

        {loading ? (
          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-slate-300">Loading memory records…</div>
        ) : error ? (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">{error}</div>
        ) : selectedMemory ? (
          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">Selected memory</div>
            <div className="text-lg font-semibold text-white">{selectedMemory.title}</div>
            <p className="mt-2 text-sm text-slate-300">{selectedMemory.summary}</p>
          </div>
        ) : null}

        <div className="space-y-3">
          {filteredMemory.map((memory) => (
            <div key={memory.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-white">{memory.title}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">{memory.category} • {memory.customer_id ?? 'Unknown customer'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">{memory.status ?? 'active'}</span>
                  <button type="button" onClick={() => setSelectedId(memory.id)} className="rounded-lg border border-slate-700 p-2 text-slate-300"><Eye className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleDelete(memory.id)} className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-2 text-rose-200"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300">{memory.summary}</p>
              <div className="mt-3 text-xs text-slate-500">Created {memory.created_at ?? 'n/a'} • Updated {memory.updated_at ?? 'n/a'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
