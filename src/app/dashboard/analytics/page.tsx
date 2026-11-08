import { CategoryBarChart, CategoryPieChart, OverviewAreaChart } from '@/components/charts';
import { analyticsTrend, categoryMix, overviewStats, sentimentBreakdown } from '@/lib/mock-data';

export default function DashboardAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-300">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Operational intelligence</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-sm text-slate-400">{stat.label}</div>
            <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
            <div className="mt-2 text-xs text-emerald-300">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="mb-3 text-xl font-semibold text-white">Conversation volume</h2>
          <OverviewAreaChart data={analyticsTrend} />
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="mb-3 text-xl font-semibold text-white">Sentiment distribution</h2>
          <CategoryPieChart data={sentimentBreakdown} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <h2 className="mb-3 text-xl font-semibold text-white">Volume by issue category</h2>
        <CategoryBarChart data={categoryMix} />
      </div>
    </div>
  );
}
