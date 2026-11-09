'use client';

import { Search, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

type KnowledgeArticle = {
  id: string;
  title: string;
  category: string;
  source?: string | null;
  updated_at?: string | null;
  summary?: string | null;
  updatedAt?: string | null;
};

export default function DashboardKnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetch('/api/knowledge');
        const payload = (await response.json()) as KnowledgeArticle[];
        setArticles(Array.isArray(payload) ? payload : []);
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : 'Unable to load knowledge base';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadArticles();
  }, []);

  const handleAddArticle = () => {
    setArticles((current) => [
      {
        id: `KB-${Date.now().toString().slice(-4)}`,
        title: 'Follow-up credit and replacement policy',
        category: 'Billing',
        source: 'Ops Team',
        updatedAt: 'Today',
        summary: 'When a repeat fulfillment issue is confirmed, support can offer account credit and replacement review in the same case workflow.',
      },
      ...current,
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">Knowledge Base</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Grounded support content</h1>
        </div>
        <button type="button" onClick={handleAddArticle} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950">Add article</button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-slate-300">Loading knowledge articles…</div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">{error}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <div key={article.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-200">{article.category}</span>
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
              </div>
              <div className="mt-4 text-lg font-semibold text-white">{article.title}</div>
              <div className="mt-2 text-sm text-slate-400">{article.source ?? 'Ops Team'} • updated {article.updatedAt ?? article.updated_at ?? 'recently'}</div>
              <p className="mt-4 text-sm text-slate-300">{article.summary ?? 'No summary available.'}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Search className="h-3.5 w-3.5" /> Retrievable by RAG pipeline
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
