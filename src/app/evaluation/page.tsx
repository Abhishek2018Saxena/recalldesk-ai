import { evaluationScenarios } from '@/lib/mock-data';

export default function EvaluationPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-300">AI Evaluation</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Quality assurance and memory recall tests</h1>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <h2 className="text-xl font-semibold text-white">Persistent memory scenario</h2>
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <div className="font-medium text-white">Session 1</div>
          <p className="mt-2">Customer reports a delayed order. The system stores the issue, previous sentiments, and delivery concern using Hindsight memory when connected.</p>
        </div>
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <div className="font-medium text-white">Session 2</div>
          <p className="mt-2">The same customer returns in a separate conversation and asks for an update. The AI should recognize the previous issue, recall the relevant memory, and avoid unnecessary repeated questions.</p>
        </div>
      </div>

      <div className="space-y-4">
        {evaluationScenarios.map((scenario) => (
          <div key={scenario.name} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold text-white">{scenario.name}</div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">{scenario.status}</span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-slate-950/60 p-3 text-sm text-slate-300">
                <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">Expected</div>
                {scenario.expected}
              </div>
              <div className="rounded-xl bg-slate-950/60 p-3 text-sm text-slate-300">
                <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">Actual</div>
                {scenario.actual}
              </div>
              <div className="rounded-xl bg-slate-950/60 p-3 text-sm text-slate-300">
                <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">Result</div>
                Pass: memory retrieval and knowledge grounding were correctly associated.
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
