import { Search, ShieldCheck } from 'lucide-react';
import { knowledgeBase } from '@/lib/mock-data';

export default function DashboardKnowledgePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">Knowledge Base</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Grounded support content</h1>
        </div>
        <button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950">Add article</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {knowledgeBase.map((article) => (
          <div key={article.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-200">{article.category}</span>
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="mt-4 text-lg font-semibold text-white">{article.title}</div>
            <div className="mt-2 text-sm text-slate-400">{article.source} • updated {article.updatedAt}</div>
            <p className="mt-4 text-sm text-slate-300">{article.summary}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Search className="h-3.5 w-3.5" /> Retrievable by RAG pipeline
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
