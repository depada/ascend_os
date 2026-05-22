import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowRight, Sparkles } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildOnboardingDefaults } from "@/lib/onboarding";
import { OnboardingForm } from "@/components/forms/onboarding-form";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      onboardingCompleted: true,
      name: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (user.onboardingCompleted) {
    redirect("/dashboard");
  }

  const profile = await prisma.userProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      items: true,
    },
  });

  const initialValues = buildOnboardingDefaults(profile);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_28%),linear-gradient(180deg,#050816_0%,#070b14_45%,#050816_100%)] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1760px] gap-6 lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] xl:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] lg:items-start">
        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(3,7,18,0.94),rgba(15,23,42,0.9))] p-5 shadow-[0_30px_120px_-60px_rgba(14,165,233,0.32)] lg:self-start xl:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_28%),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[auto,72px_72px,72px_72px] opacity-35" />
          <div className="relative space-y-5 xl:space-y-6">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-200 shadow-lg shadow-sky-950/20">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-wide text-white xl:text-base">
                  AscendOS
                </p>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Sprint 2 onboarding
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-sky-100">
                Build your execution profile
              </p>
              <h1 className="max-w-md text-3xl font-semibold tracking-tight text-white sm:text-[2.65rem] xl:text-[2.5rem] xl:leading-tight">
                Define your current state, desired state, and the rules for how
                you execute.
              </h1>
              <p className="max-w-md text-sm leading-7 text-slate-300">
                This profile stays domain-agnostic. Capture the goals, domains,
                skills, languages, platforms, and constraints that shape your
                life without locking the product to any one career or geography.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ["Identity", "Current and desired identity"],
                ["Goals", "Primary goals and domains"],
                ["Capability", "Skills, languages, and platforms"],
                ["Cadence", "Daily minimums and review rhythm"],
              ].map(([title, description]) => (
                <div
                  className="rounded-3xl border border-white/10 bg-white/5 p-3.5"
                  key={title}
                >
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="font-medium text-white">
                  Logged in as{" "}
                  {user.name ?? session.user.email ?? "execution operator"}
                </p>
                <p className="mt-1 text-slate-400">
                  You can review and revise this later.
                </p>
              </div>
              <Link
                className="inline-flex items-center gap-2 text-sky-200 transition-colors hover:text-white"
                href="/dashboard"
              >
                Skip for now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="flex items-start justify-center lg:pt-0">
          <div className="w-full max-w-[1180px]">
            <OnboardingForm initialValues={initialValues} />
          </div>
        </section>
      </div>
    </main>
  );
}
