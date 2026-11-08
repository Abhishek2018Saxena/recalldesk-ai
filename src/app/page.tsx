import Link from 'next/link';
import { ArrowRight, CheckCircle2, Lock, MessageSquareText, ShieldCheck, Sparkles } from 'lucide-react';
import { productHighlights, workflowSteps, pageMeta } from '@/lib/mock-data';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-6">
        <header className="mb-14 flex items-center justify-between rounded-full border border-slate-800 bg-slate-900/70 px-4 py-3 backdrop-blur-sm">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">RecallDesk</div>
              <div className="text-lg font-semibold text-white">AI</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="#features">Features</Link>
            <Link href="#workflow">Workflow</Link>
            <Link href="#security">Security</Link>
            <Link href="#pricing">Pricing</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 md:inline-flex">
              Sign In
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-900/30">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="grid gap-12 pb-20 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">
              <ShieldCheck className="h-4 w-4" />
              Enterprise customer support memory
            </div>
            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              {pageMeta.subtitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              An intelligent AI support platform that remembers every customer interaction, understands context, and delivers personalized support through persistent AI memory.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-medium text-white">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-100">
                Explore Demo
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-medium text-slate-200">
                Sign In
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> AI memory recall</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Knowledge-grounded answers</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Human escalation routing</div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-blue-950/20">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Demo workspace</div>
                <div className="mt-1 text-lg font-semibold text-white">Northstar Labs</div>
              </div>
              <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-200">
                Live demo
              </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex items-start gap-3 rounded-xl bg-slate-900 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-200">
                  <MessageSquareText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Customer: Priya Nair</div>
                  <div className="mt-1 text-sm text-slate-300">“I’m still waiting on the delayed order update. The previous agent left me without an ETA.”</div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-200">AI memory used</div>
                <div className="mt-2 text-sm text-slate-200">The AI remembers a prior delayed shipment, a preferred email summary, and the delivery policy for replacement eligibility.</div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-900 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 text-violet-200">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Knowledge-grounded answer</div>
                  <div className="mt-1 text-sm text-slate-300">Delivery exceptions beyond 7 business days may qualify for a replacement or service credit after review.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="mb-10 text-center">
            <div className="text-sm uppercase tracking-[0.2em] text-blue-300">Platform benefits</div>
            <h2 className="mt-3 text-3xl font-semibold text-white">Built for the realities of enterprise customer support</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {productHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="py-20">
          <div className="mb-10 max-w-2xl">
            <div className="text-sm uppercase tracking-[0.2em] text-purple-300">Operational workflow</div>
            <h2 className="mt-3 text-3xl font-semibold text-white">From customer query to grounded resolution</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-sm font-medium text-blue-200">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="security" className="py-20">
          <div className="grid gap-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-emerald-300">Enterprise readiness</div>
              <h2 className="mt-3 text-3xl font-semibold text-white">Security, trust, and customer isolation built in.</h2>
              <ul className="mt-6 space-y-4 text-sm text-slate-300">
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" /> Role-based workspace access and server-side authorization checks.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" /> Customer memory isolation and demo labeling for safe evaluation.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" /> Secure configuration placeholders only; secrets are never exposed in the frontend.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Microsoft ecosystem</div>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-2"><span>Teams</span><span className="text-emerald-300">Connected</span></div>
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-2"><span>Outlook</span><span className="text-amber-300">Demo mode</span></div>
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-2"><span>Entra ID</span><span className="text-sky-300">Config required</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="mb-10 text-center">
            <div className="text-sm uppercase tracking-[0.2em] text-amber-300">Flexible rollout</div>
            <h2 className="mt-3 text-3xl font-semibold text-white">Designed for teams that need trust, speed, and control</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {['Pilot', 'Scale', 'Enterprise'].map((plan, index) => (
              <div key={plan} className={`rounded-3xl border p-6 ${index === 2 ? 'border-blue-500/40 bg-blue-500/8' : 'border-slate-800 bg-slate-900/80'}`}>
                <div className="text-sm uppercase tracking-[0.2em] text-slate-400">{plan}</div>
                <div className="mt-5 text-4xl font-semibold text-white">{index === 0 ? 'Starter' : index === 1 ? 'Growth' : 'Full stack'}</div>
                <p className="mt-3 text-sm text-slate-300">
                  {index === 0
                    ? 'For focused proof-of-value teams validating AI support operations.'
                    : index === 1
                      ? 'For support organizations scaling across channels and workflows.'
                      : 'For enterprise teams requiring governance, integrations, and memory isolation.'}
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-200">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Shared AI memory workspace</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Knowledge base and ticket routing</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Escalation and audit controls</li>
                </ul>
                <Link href="/signup" className="mt-8 inline-flex w-full justify-center rounded-full bg-blue-500 px-4 py-3 text-sm font-medium text-white">
                  {index === 2 ? 'Talk to sales' : 'Get started'}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
