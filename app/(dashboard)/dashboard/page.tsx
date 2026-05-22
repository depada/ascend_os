import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle2, Flame, Target, TrendingUp, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const cards = [
  { title: "Today’s Focus", value: "Complete onboarding", icon: Target, description: "Set your current state, desired state, and active domains." },
  { title: "Active Goals", value: "0", icon: CheckCircle2, description: "No goals have been configured yet." },
  { title: "Execution Score", value: "—", icon: TrendingUp, description: "Your score will appear after onboarding." },
  { title: "Daily Completion", value: "0%", icon: TimerReset, description: "Nothing is being tracked yet." },
  { title: "Weekly Progress", value: "0 / 7", icon: Flame, description: "The weekly cadence starts after setup." },
  { title: "Time vs Effort", value: "—", icon: TrendingUp, description: "This chart will compare time capacity with intensity." },
  { title: "Domain Progress", value: "0 domains", icon: Target, description: "Career, fitness, finance, learning, and more." },
  { title: "Streaks", value: "0", icon: Flame, description: "Consistency signals will appear here." },
  { title: "Risk Warnings", value: "None", icon: AlertTriangle, description: "No configuration means no detected risks yet." },
  { title: "Suggested Next Actions", value: "Start onboarding", icon: ArrowRight, description: "Build the foundation before tracking execution." },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge className="mb-3 border-sky-400/20 bg-sky-400/10 text-sky-100">Dashboard</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your execution command center</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            This foundation is ready for onboarding. Until then, the dashboard stays intentionally empty and focused.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/onboarding">
            Start Onboarding
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="border-sky-400/20 bg-[linear-gradient(135deg,rgba(14,165,233,0.15),rgba(15,23,42,0.92))] text-white">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white">Complete onboarding to personalize your dashboard.</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Once onboarding is implemented, this card will evolve into a real state-aware summary.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/onboarding">Start Onboarding</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card className="border-white/10 bg-white/6 text-white" key={card.title}>
              <CardHeader className="space-y-4 p-6 pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="border-white/10 bg-white/6 text-slate-200">
                    Placeholder
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white">{card.title}</CardTitle>
                <CardDescription className="text-sm text-slate-400">{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <p className="text-3xl font-semibold tracking-tight text-white">{card.value}</p>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-1/4 rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,0.9),rgba(59,130,246,0.9))]" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}