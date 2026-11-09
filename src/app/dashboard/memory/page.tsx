'use client';

import { Eye, Search, ShieldOff, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { memoryItems } from '@/lib/mock-data';

export default function DashboardMemoryPage() {
  const [memoryList, setMemoryList] = useState(memoryItems);
  const [selectedId, setSelectedId] = useState(memoryItems[0]?.id ?? '');

  const selectedMemory = memoryList.find((memory) => memory.id === selectedId) ?? memoryList[0];

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
        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
          <Search className="h-4 w-4" /> Search memories
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm uppercase tracking-[0.18em] text-slate-400">Hindsight connection: demo fallback</div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-200">
            <ShieldOff className="h-3.5 w-3.5" /> Not live connected
          </div>
        </div>

        {selectedMemory ? (
          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">Selected memory</div>
            <div className="text-lg font-semibold text-white">{selectedMemory.title}</div>
            <p className="mt-2 text-sm text-slate-300">{selectedMemory.summary}</p>
          </div>
        ) : null}

        <div className="space-y-3">
          {memoryList.map((memory) => (
            <div key={memory.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-white">{memory.title}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">{memory.category} • {memory.customerId}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">{memory.status}</span>
                  <button type="button" onClick={() => setSelectedId(memory.id)} className="rounded-lg border border-slate-700 p-2 text-slate-300"><Eye className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleDelete(memory.id)} className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-2 text-rose-200"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300">{memory.summary}</p>
              <div className="mt-3 text-xs text-slate-500">Created {memory.createdAt} • Updated {memory.updatedAt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
