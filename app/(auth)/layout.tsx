import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.2),transparent_28%),linear-gradient(180deg,#050816_0%,#09111f_100%)] px-8 py-10 text-white lg:border-b-0 lg:border-r lg:px-12 lg:py-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
        <div className="relative flex h-full flex-col justify-between gap-16">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-200 shadow-lg shadow-sky-950/20">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-semibold tracking-wide text-white">AscendOS</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Execution system</p>
            </div>
          </div>

          <div className="max-w-xl space-y-6">
            <p className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-sky-100">
              Private execution workspace
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Turn vague ambition into measurable execution.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Track who you are now, who you want to become, and what you are willing to invest across any domain that matters.
            </p>
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-sky-200 transition-colors hover:text-white"
              href="/"
            >
              Back to landing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Role-based", "Private by default"],
              ["Domain agnostic", "Career, fitness, finance, and more"],
              ["Built for motion", "Daily logs, reviews, and scorecards"],
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
        {children}
      </section>
    </main>
  );
}