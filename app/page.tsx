"use client";

import Link from "next/link";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Flame,
  Globe2,
  Layers3,
  LineChart,
  MapPinned,
  NotebookPen,
  PanelTop,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  { title: "Goal tracking", icon: Target },
  { title: "Domain-based execution", icon: Layers3 },
  { title: "Daily logs", icon: NotebookPen },
  { title: "Weekly reviews", icon: CheckCircle2 },
  { title: "Skill tracking", icon: BarChart3 },
  { title: "Language tracking", icon: Globe2 },
  { title: "Platform goals", icon: PanelTop },
  { title: "Networking/events", icon: Users },
  { title: "Hidden routes", icon: MapPinned },
  { title: "Time vs effort graph", icon: LineChart },
  { title: "AI-ready suggestions", icon: Sparkles },
  { title: "Execution streaks", icon: Flame },
];

const levels = [
  "Spark",
  "Initiate",
  "Builder",
  "Operator",
  "Relentless",
  "Apex",
];

const metrics = [
  { label: "Execution score", value: "82", delta: "+11" },
  { label: "Active goals", value: "14", delta: "3 domains" },
  { label: "Weekly streak", value: "19", delta: "days" },
];

const heroVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const, staggerChildren: 0.05 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function Home() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <main className="relative min-h-screen overflow-hidden">
          <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
            <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-200 shadow-lg shadow-sky-950/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">
                AscendOS
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Execution platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </header>

        <section className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div
            animate={reduceMotion ? undefined : "show"}
            className="space-y-8"
            initial={reduceMotion ? false : "hidden"}
            variants={heroVariants}
          >
            <div className="space-y-5">
              <motion.div variants={fadeUpVariants}>
                <Badge
                  variant="secondary"
                  className="w-fit border-sky-400/20 bg-sky-400/10 text-sky-100"
                >
                  Build your execution system
                </Badge>
              </motion.div>
              <motion.h1
                className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
                variants={fadeUpVariants}
              >
                AscendOS
              </motion.h1>
              <motion.p
                className="max-w-3xl text-2xl font-medium leading-9 text-slate-200 sm:text-[2rem] sm:leading-10"
                variants={fadeUpVariants}
              >
                Turn any desired state into tracked execution.
              </motion.p>
              <motion.p
                className="max-w-2xl text-base leading-8 text-slate-400 sm:text-lg"
                variants={fadeUpVariants}
              >
                A customizable command center for tracking goals, habits,
                skills, platforms, events, routes, reviews, and daily execution
                across career, fitness, finance, learning, spirituality,
                discipline, and any personal mission.
              </motion.p>
            </div>

            <motion.div className="flex flex-wrap gap-3" variants={fadeUpVariants}>
              <Button asChild size="lg">
                <Link href="/signup">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  className="rounded-3xl border border-white/10 bg-white/6 p-5"
                  key={metric.label}
                >
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <span className="text-3xl font-semibold text-white">
                      {metric.value}
                    </span>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                      {metric.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4">
            <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.96))] text-white">
              <CardHeader className="space-y-3">
                <Badge className="w-fit border-sky-400/20 bg-sky-400/10 text-sky-100">
                  Problem statement
                </Badge>
                <CardTitle className="text-2xl text-white sm:text-3xl">
                  Most people fail because their goals stay vague.
                </CardTitle>
                <CardDescription className="max-w-xl text-base text-slate-400">
                  AscendOS turns vague ambition into measurable execution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Time", "Available hours"],
                    ["Effort", "How hard you can push"],
                    ["State", "Where you are now"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/6 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        {label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-100">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
                    <span>Time vs effort</span>
                    <span>Execution-ready preview</span>
                  </div>
                  <div className="mt-4 grid grid-cols-12 items-end gap-2">
                    {[34, 52, 46, 60, 68, 82, 71, 55, 63, 77, 88, 94].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-full rounded-t-full bg-[linear-gradient(180deg,rgba(56,189,248,0.95),rgba(37,99,235,0.35))]"
                            style={{ height: `${height}px` }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Low effort</span>
                    <span>High execution</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/6 text-white">
              <CardHeader className="space-y-3">
                <Badge
                  variant="secondary"
                  className="w-fit border-white/10 bg-white/6 text-slate-200"
                >
                  Level system preview
                </Badge>
                <CardTitle className="text-2xl text-white">
                  Progress is visible from the first session.
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {levels.map((level, index) => (
                  <span
                    className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200"
                    key={level}
                  >
                    {index + 1}. {level}
                  </span>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-6 [content-visibility:auto] [contain-intrinsic-size:1px_1400px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge className="mb-3 w-fit border-white/10 bg-white/6 text-slate-200">
                Core capabilities
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Everything the execution layer needs, nothing wasteful.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Designed to support any goal domain without hardcoding a single
              career path, language, platform, or template.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  className="h-full border-white/10 bg-white/6 text-white transition-transform duration-300 hover:-translate-y-1 hover:border-sky-400/20 hover:bg-white/8"
                  key={feature.title}
                >
                  <CardContent className="flex h-full items-start gap-4 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-base font-medium text-white">
                        {feature.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {feature.title === "AI-ready suggestions"
                          ? "Foundation is prepared for future recommendation layers."
                          : "Structured for clarity, focus, and measurable progress."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] [content-visibility:auto] [contain-intrinsic-size:1px_900px]">
          <Card className="border-white/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.18),rgba(15,23,42,0.92))] text-white">
            <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
              <div className="space-y-4">
                <Badge className="w-fit border-sky-400/20 bg-sky-400/10 text-sky-100">
                  Execution mindset
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  A serious system for people who want compounding progress.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                AscendOS gives you a place to define identity, direction, goals,
                effort, time, and constraints before the work begins.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/6 text-white">
            <CardContent className="flex h-full flex-col justify-center gap-6 p-8">
              <Badge
                variant="secondary"
                className="w-fit border-white/10 bg-white/6 text-slate-200"
              >
                Closing CTA
              </Badge>
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Build your execution system.
                </h2>
                <p className="text-base leading-7 text-slate-400">
                  Create your account and start shaping a dashboard that
                  reflects your mission instead of forcing you into one.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/signup">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
          </div>
        </main>
      </LazyMotion>
    </MotionConfig>
  );
}
