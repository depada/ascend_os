/* eslint-disable react-hooks/refs */
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useController,
  useForm,
  type Control,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  onboardingSchema,
  splitLines,
  type OnboardingDefaults,
  type OnboardingInput,
  weeklyReviewDayOptions,
} from "@/lib/onboarding";
import { cn } from "@/lib/utils";

type OnboardingFormProps = {
  initialValues: OnboardingDefaults;
};

const steps = [
  {
    title: "Identity",
    description: "Capture where you are now and where you are becoming.",
    fields: ["currentIdentity", "desiredIdentity"] as const,
  },
  {
    title: "Goals and domains",
    description:
      "Build the mission layer for your life without locking it to one domain.",
    fields: ["primaryGoals", "domains"] as const,
  },
  {
    title: "Skills, languages, tools",
    description:
      "Separate abilities, language systems, and the tools you execute with.",
    fields: ["skills", "languages", "platforms"] as const,
  },
  {
    title: "Execution settings",
    description: "Define your cadence, capacity, and operating style.",
    fields: [
      "dailyMinimums",
      "constraints",
      "weeklyReviewDay",
      "intensityLevel",
      "preferredExecutionStyle",
      "availableTimePerDayMinutes",
      "availableTimePerWeekMinutes",
    ] as const,
  },
  {
    title: "Review and save",
    description: "Confirm the profile before storing it in MySQL.",
    fields: [] as const,
  },
] as const;

const stepFields = steps.map((step) => step.fields) as Array<
  readonly Path<OnboardingInput>[]
>;

const identityInputClassName =
  "min-h-28 w-full resize-none rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/30 focus:bg-white/[0.07]";

const tagInputClassName =
  "min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/30 focus:bg-white/[0.07]";

const numberInputClassName =
  "h-14 w-full rounded-3xl border border-white/10 bg-white/5 px-4 text-lg font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/30 focus:bg-white/[0.07]";

export function OnboardingForm({ initialValues }: OnboardingFormProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const values = form.getValues() as OnboardingDefaults;
  const progressPercent = (activeStep / (steps.length - 1)) * 100;

  const validateStep = async (stepIndex: number) => {
    const fields = stepFields[stepIndex];

    if (fields.length === 0) {
      return true;
    }

    return form.trigger(fields);
  };

  const goToStep = async (targetStep: number) => {
    setErrorMessage(null);

    if (targetStep < activeStep) {
      setActiveStep(targetStep);
      return;
    }

    if (targetStep === activeStep) {
      return;
    }

    if (targetStep === activeStep + 1) {
      const isValid = await validateStep(activeStep);

      if (!isValid) {
        return;
      }

      setActiveStep(targetStep);
    }
  };

  const goNext = async () => {
    await goToStep(Math.min(activeStep + 1, steps.length - 1));
  };

  const goBack = () => {
    setErrorMessage(null);
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const onSubmit = (payload: OnboardingInput) => {
    setErrorMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        setErrorMessage(body.message ?? "Unable to save onboarding right now.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] text-white shadow-[0_24px_100px_-52px_rgba(15,23,42,1)]">
      <CardHeader className="space-y-5 border-b border-white/10 p-6 sm:p-7 xl:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-sky-100">
            <Sparkles className="h-4 w-4" />
            Sprint 2
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Step {activeStep + 1} of {steps.length}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <CardTitle className="text-3xl text-white sm:text-[2rem]">
              {steps[activeStep].title}
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7 text-slate-400">
              {steps[activeStep].description}
            </CardDescription>
          </div>

          <div className="space-y-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,0.95),rgba(59,130,246,0.95))] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
              {steps.map((step, index) => {
                const isComplete = index < activeStep;
                const isCurrent = index === activeStep;
                const isLocked = index > activeStep + 1;

                return (
                  <button
                    aria-current={isCurrent ? "step" : undefined}
                    key={step.title}
                    className={cn(
                      "group flex min-w-0 items-start gap-3 rounded-2xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
                      isComplete &&
                        "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
                      isCurrent &&
                        "border-sky-400/30 bg-sky-400/10 text-white shadow-[0_18px_48px_-30px_rgba(56,189,248,0.7)]",
                      !isComplete &&
                        !isCurrent &&
                        !isLocked &&
                        "border-white/12 bg-white/5 text-slate-200 hover:border-sky-400/25 hover:bg-sky-400/6",
                      isLocked &&
                        "cursor-not-allowed border-white/8 bg-white/4 text-slate-500",
                    )}
                    disabled={isLocked}
                    type="button"
                    onClick={() => void goToStep(index)}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                        isComplete &&
                          "border-emerald-400/30 bg-emerald-400/15 text-emerald-100",
                        isCurrent &&
                          "border-sky-400/30 bg-sky-400/15 text-sky-100",
                        !isComplete &&
                          !isCurrent &&
                          "border-white/10 bg-white/6 text-slate-400",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 space-y-1">
                      <span className="block text-sm font-medium leading-5 text-white">
                        {step.title}
                      </span>
                      <span className="block text-xs leading-5 text-slate-400 group-hover:text-slate-300">
                        {step.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6 sm:p-7 xl:p-8">
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {activeStep === 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              <IdentityCard
                control={form.control}
                description="Describe the version of you that is operating right now. Keep it concrete and honest."
                helper="Example: I am a busy professional rebuilding discipline across health, work, and family life."
                label="Where you are now"
                name="currentIdentity"
                placeholder="I am currently..."
                title="Current identity"
              />

              <IdentityCard
                control={form.control}
                description="Describe the identity you are actively becoming. Keep it aspirational but believable."
                helper="Example: I am becoming a calm, fit, focused operator with a repeatable execution system."
                label="Where you are becoming"
                name="desiredIdentity"
                placeholder="I am becoming..."
                title="Desired identity"
              />
            </div>
          ) : null}

          {activeStep === 1 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              <TagField
                control={form.control}
                description="Capture the outcomes that matter most right now. One goal per chip, with a clear target in plain language."
                helper="Examples: launch a business, lose 15 pounds, build a portfolio, pass an exam."
                label="Primary goals"
                name="primaryGoals"
                placeholder="Type a goal and press Enter"
                suggestions={[
                  "Build a sustainable routine",
                  "Complete a certification",
                  "Improve fitness consistency",
                  "Increase income",
                ]}
                title="Primary goals"
              />

              <TagField
                control={form.control}
                description="Choose the life areas that should guide your execution. Add any custom domain that fits your life."
                helper="Examples: Career, Fitness, Finance, Learning, Discipline, Spirituality, Content Creation, Business, Social Life, Networking, Exam Prep."
                label="Life domains"
                name="domains"
                placeholder="Type a domain and press Enter"
                suggestions={[
                  "Career",
                  "Fitness",
                  "Finance",
                  "Learning",
                  "Discipline",
                  "Spirituality",
                  "Content Creation",
                  "Business",
                  "Social Life",
                  "Networking",
                  "Exam Prep",
                  "Custom",
                ]}
                title="Life domains"
              />
            </div>
          ) : null}

          {activeStep === 2 ? (
            <div className="space-y-5">
              <TagField
                control={form.control}
                description="Abilities you are building or sharpening. Think actions and capacities, not identities."
                helper="Examples: planning, writing, coaching, analysis, cooking, strength training."
                label="Skills"
                name="skills"
                placeholder="Type a skill and press Enter"
                suggestions={[
                  "Planning",
                  "Writing",
                  "Analysis",
                  "Coaching",
                  "Strength training",
                  "Cooking",
                ]}
                title="Skills"
              />

              <div className="grid gap-5 xl:grid-cols-2">
                <TagField
                  control={form.control}
                  description="Spoken languages or language systems you use. This can include human languages or programming languages."
                  helper="Examples: English, Spanish, French, TypeScript, Python, SQL."
                  label="Languages"
                  name="languages"
                  placeholder="Type a language and press Enter"
                  suggestions={[
                    "English",
                    "Spanish",
                    "French",
                    "TypeScript",
                    "Python",
                    "SQL",
                  ]}
                  title="Languages"
                />

                <TagField
                  control={form.control}
                  description="Apps, platforms, ecosystems, and tools that support execution."
                  helper="Examples: iPhone, Android, Mac, Notion, Google Workspace, GitHub, Figma, Stripe."
                  label="Platforms / tools"
                  name="platforms"
                  placeholder="Type a tool or platform and press Enter"
                  suggestions={[
                    "iPhone",
                    "Android",
                    "Mac",
                    "Notion",
                    "Google Workspace",
                    "GitHub",
                    "Figma",
                    "Stripe",
                  ]}
                  title="Platforms / tools"
                />
              </div>
            </div>
          ) : null}

          {activeStep === 3 ? (
            <div className="space-y-5">
              <TagField
                control={form.control}
                description="Small non-negotiables that define a successful day. These should be simple, measurable, and realistic."
                helper="Examples: 10 minutes planning, 20 minutes movement, 1 focus block, 1 review note."
                label="Daily minimums"
                name="dailyMinimums"
                placeholder="Type a minimum commitment and press Enter"
                suggestions={[
                  "10 minutes planning",
                  "20 minutes movement",
                  "1 focus block",
                  "1 review note",
                ]}
                title="Daily minimums"
              />

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <Card className="min-w-0 border-white/10 bg-[linear-gradient(180deg,rgba(14,20,36,0.95),rgba(8,15,28,0.95))] text-white">
                  <CardHeader className="space-y-2 p-6 pb-4">
                    <CardTitle className="text-2xl text-white">
                      Constraints
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      List the real-world limits that shape your schedule,
                      energy, and execution style.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6 pt-0">
                    <textarea
                      className={cn(
                        "min-h-32 w-full resize-y rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/30 focus:bg-white/[0.07]",
                      )}
                      id="constraints"
                      placeholder={
                        "Caregiving responsibilities\nLimited evening energy\nTravel schedule\nShared device access"
                      }
                      rows={5}
                      {...form.register("constraints")}
                    />
                    <p className="text-xs leading-6 text-slate-500">
                      One constraint per line. Leave this empty if nothing is
                      shaping the system yet.
                    </p>
                    {form.formState.errors.constraints ? (
                      <p className="text-sm text-rose-300">
                        {form.formState.errors.constraints.message}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>

                <div className="space-y-5">
                  <ChoiceCardGrid
                    control={form.control}
                    description="How aggressive should the system feel?"
                    label="Intensity level"
                    name="intensityLevel"
                    options={intensityOptions}
                    title="Intensity level"
                  />

                  <ChoiceCardGrid
                    control={form.control}
                    description="Pick the operating mode that best matches your personality and schedule."
                    label="Preferred execution style"
                    name="preferredExecutionStyle"
                    options={executionStyleCardOptions}
                    title="Preferred execution style"
                  />
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <ChoiceCardGrid
                  control={form.control}
                  description="Choose the weekly anchor that best supports reflection and course correction."
                  label="Weekly review day"
                  name="weeklyReviewDay"
                  options={weeklyDayOptions}
                  title="Weekly review day"
                  variant="chips"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <NumberCardField
                    control={form.control}
                    description="How much time can you usually spend in a day?"
                    helper="Use whole minutes. A number like 45, 60, or 90 keeps the profile easy to read."
                    label="Available time per day"
                    name="availableTimePerDayMinutes"
                    title="Available time per day"
                    unit="minutes / day"
                  />

                  <NumberCardField
                    control={form.control}
                    description="How much time can you commit across the week?"
                    helper="Use whole minutes. This can be larger than the daily average because the week may vary."
                    label="Available time per week"
                    name="availableTimePerWeekMinutes"
                    title="Available time per week"
                    unit="minutes / week"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {activeStep === 4 ? (
            <div className="space-y-5">
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,20,36,0.95),rgba(8,15,28,0.95))] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                      Final review
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      Confirm your execution profile
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                      This summary reflects the data that will be stored for
                      your onboarding profile.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <SummaryCard
                    label="Current identity"
                    value={values.currentIdentity}
                  />
                  <SummaryCard
                    label="Desired identity"
                    value={values.desiredIdentity}
                  />
                  <SummaryCard
                    label="Primary goals"
                    value={splitLines(values.primaryGoals).join(" · ")}
                  />
                  <SummaryCard
                    label="Life domains"
                    value={splitLines(values.domains).join(" · ")}
                  />
                  <SummaryCard
                    label="Skills"
                    value={splitLines(values.skills).join(" · ")}
                  />
                  <SummaryCard
                    label="Languages"
                    value={splitLines(values.languages).join(" · ")}
                  />
                  <SummaryCard
                    label="Platforms / tools"
                    value={splitLines(values.platforms).join(" · ")}
                  />
                  <SummaryCard
                    label="Execution settings"
                    value={`${values.weeklyReviewDay} · ${values.intensityLevel} · ${values.preferredExecutionStyle}`}
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <SummaryCard
                    label="Daily minimums"
                    value={splitLines(values.dailyMinimums).join(" · ")}
                  />
                  <SummaryCard
                    label="Constraints"
                    value={
                      splitLines(values.constraints).join(" · ") || "None added"
                    }
                  />
                </div>

                <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
                  <p className="font-medium text-white">Time capacity</p>
                  <p className="mt-2">
                    {values.availableTimePerDayMinutes} minutes per day ·{" "}
                    {values.availableTimePerWeekMinutes} minutes per week
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
            <Button
              disabled={activeStep === 0 || isPending}
              type="button"
              variant="outline"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {activeStep < steps.length - 1 ? (
                <Button disabled={isPending} type="button" onClick={goNext}>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button className="min-w-40" disabled={isPending} type="submit">
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Save profile
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const intensityOptions = [
  {
    value: "LOW",
    title: "Low",
    description: "Stable, sustainable, and light on pressure.",
  },
  {
    value: "MODERATE",
    title: "Moderate",
    description: "Balanced execution with enough stretch to grow.",
  },
  {
    value: "HIGH",
    title: "High",
    description: "Aggressive pace with stronger commitments.",
  },
] as const;

const weeklyDayOptions = weeklyReviewDayOptions.map((option) => ({
  value: option.value,
  title: option.label,
}));

const executionStyleCardOptions = [
  {
    value: "STRUCTURED",
    title: "Structured blocks",
    description: "Plan the day in clear execution blocks.",
  },
  {
    value: "FLEXIBLE",
    title: "Flexible flow",
    description: "Keep the system loose and responsive.",
  },
  {
    value: "SPRINTS",
    title: "Daily sprints",
    description: "Short bursts of concentrated progress.",
  },
  {
    value: "HABIT_FIRST",
    title: "Habit-first",
    description: "Anchor execution around repeatable habits.",
  },
  {
    value: "DEEP_WORK",
    title: "Deep work",
    description: "Protect longer blocks for focused output.",
  },
] as const;

function IdentityCard({
  control,
  title,
  label,
  description,
  helper,
  placeholder,
  name,
}: {
  control: Control<OnboardingInput>;
  title: string;
  label: string;
  description: string;
  helper: string;
  placeholder: string;
  name: Path<OnboardingInput>;
}) {
  const { field, fieldState } = useController({ control, name });

  return (
    <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(14,20,36,0.95),rgba(8,15,28,0.95))] text-white shadow-[0_20px_70px_-48px_rgba(56,189,248,0.55)] min-w-0">
      <CardHeader className="space-y-2 p-6 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200/70">
            {label}
          </p>
          <CardTitle className="mt-2 text-2xl text-white">{title}</CardTitle>
        </div>
        <CardDescription className="max-w-xl text-slate-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-6 pt-0">
        <textarea
          className={identityInputClassName}
          placeholder={placeholder}
          rows={5}
          value={typeof field.value === "string" ? field.value : ""}
          onBlur={field.onBlur}
          onChange={field.onChange}
          name={field.name}
          ref={field.ref}
        />
        <p className="text-xs leading-6 text-slate-500">{helper}</p>
        {fieldState.error ? (
          <p className="text-sm text-rose-300">{fieldState.error.message}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function TagField({
  control,
  title,
  label,
  description,
  helper,
  placeholder,
  suggestions,
  name,
}: {
  control: Control<OnboardingInput>;
  title: string;
  label: string;
  description: string;
  helper: string;
  placeholder: string;
  suggestions: readonly string[];
  name: Path<OnboardingInput>;
}) {
  const { field, fieldState } = useController({ control, name });
  const [draft, setDraft] = useState("");
  const values = splitLines(typeof field.value === "string" ? field.value : "");

  const commit = (nextValues: string[]) => {
    field.onChange(nextValues.join("\n"));
  };

  const addValue = (rawValue: string) => {
    const nextValue = rawValue.trim();

    if (!nextValue) {
      return;
    }

    if (
      values.some((value) => value.toLowerCase() === nextValue.toLowerCase())
    ) {
      setDraft("");
      return;
    }

    commit([...values, nextValue]);
    setDraft("");
  };

  const removeValue = (rawValue: string) => {
    commit(values.filter((value) => value !== rawValue));
  };

  return (
    <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(14,20,36,0.95),rgba(8,15,28,0.95))] text-white shadow-[0_20px_70px_-48px_rgba(14,165,233,0.35)] min-w-0">
      <CardHeader className="space-y-2 p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200/70">
              {label}
            </p>
            <CardTitle className="mt-2 text-2xl text-white">{title}</CardTitle>
          </div>
          <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
            {values.length} items
          </div>
        </div>
        <CardDescription className="text-slate-400">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-6 pt-0 min-w-0">
        <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_36%),rgba(255,255,255,0.03)] p-4 min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {values.length > 0 ? (
              values.map((value) => (
                <button
                  className="group inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 text-sm text-slate-100 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-100"
                  key={value}
                  type="button"
                  onClick={() => removeValue(value)}
                >
                  <span className="min-w-0 break-words text-left">{value}</span>
                  <X className="h-3.5 w-3.5 text-slate-500 transition group-hover:text-rose-200" />
                </button>
              ))
            ) : (
              <div className="py-2 text-sm text-slate-500">
                Start by typing a value, then press Enter or add a suggestion.
              </div>
            )}

            <input
              className={tagInputClassName}
              placeholder={placeholder}
              value={draft}
              onBlur={field.onBlur}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addValue(draft);
                }
              }}
            />

            <Button
              className="h-11 shrink-0 px-4"
              disabled={!draft.trim()}
              type="button"
              variant="secondary"
              onClick={() => addValue(draft)}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium text-slate-200 transition hover:border-sky-400/25 hover:bg-sky-400/10 hover:text-white"
              key={suggestion}
              type="button"
              onClick={() => addValue(suggestion)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="min-w-0 break-words normal-case tracking-normal">
                {suggestion}
              </span>
            </button>
          ))}
        </div>

        <p className="text-xs leading-6 text-slate-500">{helper}</p>
        {fieldState.error ? (
          <p className="text-sm text-rose-300">{fieldState.error.message}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ChoiceCardGrid({
  control,
  title,
  label,
  description,
  options,
  name,
  variant = "cards",
}: {
  control: Control<OnboardingInput>;
  title: string;
  label: string;
  description: string;
  options: readonly { value: string; title: string; description?: string }[];
  name: Path<OnboardingInput>;
  variant?: "cards" | "chips";
}) {
  const { field, fieldState } = useController({ control, name });
  const selectedValue = String(field.value ?? "");

  return (
    <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(14,20,36,0.95),rgba(8,15,28,0.95))] text-white shadow-[0_20px_70px_-48px_rgba(14,165,233,0.32)] min-w-0">
      <CardHeader className="space-y-2 p-6 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200/70">
            {label}
          </p>
          <CardTitle className="mt-2 text-2xl text-white">{title}</CardTitle>
        </div>
        <CardDescription className="text-slate-400">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-6 pt-0 min-w-0">
        <div
          className={cn(
            "grid min-w-0 gap-3",
            variant === "chips" ? "sm:grid-cols-2" : "sm:grid-cols-1",
          )}
        >
          {options.map((option) => {
            const selected = selectedValue === option.value;

            return (
              <button
                aria-pressed={selected}
                className={cn(
                  variant === "chips"
                    ? "inline-flex min-w-0 items-center justify-center rounded-full border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                    : "min-w-0 rounded-3xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
                  selected
                    ? variant === "chips"
                      ? "border-sky-400/30 bg-sky-400/12 text-white shadow-[0_18px_36px_-28px_rgba(56,189,248,0.7)]"
                      : "border-sky-400/30 bg-sky-400/10 text-white shadow-[0_18px_44px_-28px_rgba(56,189,248,0.75)]"
                    : "border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/25 hover:bg-sky-400/6",
                )}
                key={option.value}
                type="button"
                onClick={() => field.onChange(option.value)}
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <span className="min-w-0 text-sm font-medium leading-6">
                    {option.title}
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                      selected
                        ? "border-sky-400/30 bg-sky-400/15 text-sky-100"
                        : "border-white/10 bg-white/5 text-slate-500",
                    )}
                  >
                    {selected ? "✓" : ""}
                  </span>
                </div>
                {variant !== "chips" && option.description ? (
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {option.description}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>

        {fieldState.error ? (
          <p className="text-sm text-rose-300">{fieldState.error.message}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function NumberCardField({
  control,
  title,
  label,
  description,
  helper,
  unit,
  name,
}: {
  control: Control<OnboardingInput>;
  title: string;
  label: string;
  description: string;
  helper: string;
  unit: string;
  name: Path<OnboardingInput>;
}) {
  const { field, fieldState } = useController({ control, name });

  return (
    <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(14,20,36,0.95),rgba(8,15,28,0.95))] text-white shadow-[0_20px_70px_-48px_rgba(14,165,233,0.3)] min-w-0">
      <CardHeader className="space-y-2 p-6 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200/70">
            {label}
          </p>
          <CardTitle className="mt-2 text-2xl text-white">{title}</CardTitle>
        </div>
        <CardDescription className="text-slate-400">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-6 pt-0 min-w-0">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 min-w-0">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end">
            <input
              className={numberInputClassName}
              min={0}
              step={15}
              type="number"
              value={typeof field.value === "number" ? field.value : 0}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(Number(event.target.value))}
              ref={field.ref}
            />
            <span className="pb-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 sm:pb-3">
              {unit}
            </span>
          </div>
        </div>

        <p className="text-xs leading-6 text-slate-500">{helper}</p>
        {fieldState.error ? (
          <p className="text-sm text-rose-300">{fieldState.error.message}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 min-w-0">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white">
        {value || "Not set"}
      </p>
    </div>
  );
}
