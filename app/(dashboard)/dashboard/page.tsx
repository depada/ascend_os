import Link from "next/link";
import { getServerSession } from "next-auth";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const profileKinds = {
  primaryGoal: "PRIMARY_GOAL",
  domain: "DOMAIN",
  skill: "SKILL",
  language: "LANGUAGE",
  platform: "PLATFORM",
} as const;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const profile = await prisma.userProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      items: true,
    },
  });

  const counts = profile?.items.reduce<Record<string, number>>(
    (accumulator, item) => {
      accumulator[item.kind] = (accumulator[item.kind] ?? 0) + 1;
      return accumulator;
    },
    {},
  );

  const currentIdentity =
    profile?.currentIdentity ?? session.user.name ?? "Execution operator";
  const desiredIdentity = profile?.desiredIdentity ?? "your desired identity";
  const primaryGoals =
    profile?.items
      .filter((item) => item.kind === profileKinds.primaryGoal)
      .slice(0, 3)
      .map((item) => item.value) ?? [];
  const domains =
    profile?.items
      .filter((item) => item.kind === profileKinds.domain)
      .slice(0, 3)
      .map((item) => item.value) ?? [];

  const summaryCards = [
    {
      title: "Current identity",
      value: currentIdentity,
      description: "Your present operating state.",
      icon: Target,
    },
    {
      title: "Desired identity",
      value: desiredIdentity,
      description: "The direction your profile is moving toward.",
      icon: CheckCircle2,
    },
    {
      title: "Primary goals",
      value: String(counts?.PRIMARY_GOAL ?? 0),
      description:
        primaryGoals.length > 0 ? primaryGoals.join(" · ") : "No goals yet.",
      icon: TrendingUp,
    },
    {
      title: "Life domains",
      value: String(counts?.DOMAIN ?? 0),
      description: domains.length > 0 ? domains.join(" · ") : "No domains yet.",
      icon: Flame,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="mb-3 border-sky-400/20 bg-sky-400/10 text-sky-100">
            Dashboard
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Welcome, {currentIdentity}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            You are building toward {desiredIdentity}. This dashboard stays
            focused on your execution profile until Sprint 3 begins.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/onboarding">
            Review onboarding
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="border-sky-400/20 bg-[linear-gradient(135deg,rgba(14,165,233,0.15),rgba(15,23,42,0.92))] text-white">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              Your execution profile is now the source of truth.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Current identity, goals, domains, skills, languages, platforms,
              and constraints are stored in MySQL.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/onboarding">Review profile</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              className="border-white/10 bg-white/6 text-white"
              key={card.title}
            >
              <CardHeader className="space-y-4 p-6 pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="border-white/10 bg-white/6 text-slate-200"
                  >
                    Profile
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white">
                  {card.title}
                </CardTitle>
                <p className="text-sm text-slate-400">{card.description}</p>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <p className="text-3xl font-semibold tracking-tight text-white">
                  {card.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-white/10 bg-white/6 text-white">
        <CardHeader className="space-y-3 p-6 pb-3">
          <CardTitle className="text-2xl text-white">
            Execution settings snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 pt-0 md:grid-cols-3">
          <KeyValue
            label="Weekly review day"
            value={profile?.weeklyReviewDay ?? "Not set"}
          />
          <KeyValue
            label="Intensity level"
            value={profile?.intensityLevel ?? "Not set"}
          />
          <KeyValue
            label="Preferred style"
            value={profile?.preferredExecutionStyle ?? "Not set"}
          />
          <KeyValue
            label="Daily time"
            value={
              profile
                ? `${profile.availableTimePerDayMinutes} minutes`
                : "Not set"
            }
          />
          <KeyValue
            label="Weekly time"
            value={
              profile
                ? `${profile.availableTimePerWeekMinutes} minutes`
                : "Not set"
            }
          />
          <KeyValue label="Active skills" value={String(counts?.SKILL ?? 0)} />
          <KeyValue label="Languages" value={String(counts?.LANGUAGE ?? 0)} />
          <KeyValue label="Platforms" value={String(counts?.PLATFORM ?? 0)} />
        </CardContent>
      </Card>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
