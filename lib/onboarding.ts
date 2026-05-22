import type { UserProfile, UserProfileItem } from "@prisma/client";
import { z } from "zod";

export const weeklyReviewDayOptions = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
] as const;

export const intensityLevelOptions = [
  { label: "Low", value: "LOW" },
  { label: "Moderate", value: "MODERATE" },
  { label: "High", value: "HIGH" },
] as const;

export const executionStyleOptions = [
  { label: "Structured blocks", value: "STRUCTURED" },
  { label: "Flexible flow", value: "FLEXIBLE" },
  { label: "Daily sprints", value: "SPRINTS" },
  { label: "Habit-first", value: "HABIT_FIRST" },
  { label: "Deep work", value: "DEEP_WORK" },
] as const;

export const profileItemKinds = {
  primaryGoal: "PRIMARY_GOAL",
  domain: "DOMAIN",
  skill: "SKILL",
  language: "LANGUAGE",
  platform: "PLATFORM",
  dailyMinimum: "DAILY_MINIMUM",
  constraint: "CONSTRAINT",
} as const;

export type ProfileItemKind =
  (typeof profileItemKinds)[keyof typeof profileItemKinds];

export const onboardingSchema = z.object({
  currentIdentity: z
    .string()
    .trim()
    .min(2, "Current identity must be at least 2 characters.")
    .max(120),
  desiredIdentity: z
    .string()
    .trim()
    .min(2, "Desired identity must be at least 2 characters.")
    .max(120),
  primaryGoals: z
    .string()
    .trim()
    .refine((value) => splitLines(value).length > 0, {
      message: "Add at least one primary goal.",
    }),
  domains: z
    .string()
    .trim()
    .refine((value) => splitLines(value).length > 0, {
      message: "Add at least one life domain.",
    }),
  skills: z
    .string()
    .trim()
    .refine((value) => splitLines(value).length > 0, {
      message: "Add at least one skill.",
    }),
  languages: z
    .string()
    .trim()
    .refine((value) => splitLines(value).length > 0, {
      message: "Add at least one language.",
    }),
  platforms: z
    .string()
    .trim()
    .refine((value) => splitLines(value).length > 0, {
      message: "Add at least one platform or tool.",
    }),
  dailyMinimums: z
    .string()
    .trim()
    .refine((value) => splitLines(value).length > 0, {
      message: "Add at least one daily minimum.",
    }),
  constraints: z.string().trim().max(2000),
  weeklyReviewDay: z.enum(weeklyReviewDayOptions.map((option) => option.value)),
  intensityLevel: z.enum(intensityLevelOptions.map((option) => option.value)),
  preferredExecutionStyle: z.enum(
    executionStyleOptions.map((option) => option.value),
  ),
  availableTimePerDayMinutes: z
    .number()
    .int("Use a whole number of minutes.")
    .min(15, "Enter at least 15 minutes per day.")
    .max(1440, "Enter no more than 1440 minutes per day."),
  availableTimePerWeekMinutes: z
    .number()
    .int("Use a whole number of minutes.")
    .min(30, "Enter at least 30 minutes per week.")
    .max(10080, "Enter no more than 10080 minutes per week."),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export type OnboardingProfileSnapshot = UserProfile & {
  items: UserProfileItem[];
};

export type OnboardingDefaults = {
  currentIdentity: string;
  desiredIdentity: string;
  primaryGoals: string;
  domains: string;
  skills: string;
  languages: string;
  platforms: string;
  dailyMinimums: string;
  constraints: string;
  weeklyReviewDay: OnboardingInput["weeklyReviewDay"];
  intensityLevel: OnboardingInput["intensityLevel"];
  preferredExecutionStyle: OnboardingInput["preferredExecutionStyle"];
  availableTimePerDayMinutes: number;
  availableTimePerWeekMinutes: number;
};

export const defaultOnboardingValues: OnboardingDefaults = {
  currentIdentity: "",
  desiredIdentity: "",
  primaryGoals: "",
  domains: "",
  skills: "",
  languages: "",
  platforms: "",
  dailyMinimums: "",
  constraints: "",
  weeklyReviewDay: "MONDAY",
  intensityLevel: "MODERATE",
  preferredExecutionStyle: "STRUCTURED",
  availableTimePerDayMinutes: 60,
  availableTimePerWeekMinutes: 420,
};

export function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function joinLines(values: string[]) {
  return values.join("\n");
}

export function buildOnboardingDefaults(
  profile?: OnboardingProfileSnapshot | null,
): OnboardingDefaults {
  if (!profile) {
    return defaultOnboardingValues;
  }

  const itemsByKind = profile.items.reduce<Record<string, string[]>>(
    (accumulator, item) => {
      accumulator[item.kind] ??= [];
      accumulator[item.kind].push(item.value);
      return accumulator;
    },
    {},
  );

  return {
    currentIdentity: profile.currentIdentity,
    desiredIdentity: profile.desiredIdentity,
    primaryGoals: joinLines(itemsByKind.PRIMARY_GOAL ?? []),
    domains: joinLines(itemsByKind.DOMAIN ?? []),
    skills: joinLines(itemsByKind.SKILL ?? []),
    languages: joinLines(itemsByKind.LANGUAGE ?? []),
    platforms: joinLines(itemsByKind.PLATFORM ?? []),
    dailyMinimums: joinLines(itemsByKind.DAILY_MINIMUM ?? []),
    constraints: joinLines(itemsByKind.CONSTRAINT ?? []),
    weeklyReviewDay:
      profile.weeklyReviewDay as OnboardingDefaults["weeklyReviewDay"],
    intensityLevel:
      profile.intensityLevel as OnboardingDefaults["intensityLevel"],
    preferredExecutionStyle:
      profile.preferredExecutionStyle as OnboardingDefaults["preferredExecutionStyle"],
    availableTimePerDayMinutes: profile.availableTimePerDayMinutes,
    availableTimePerWeekMinutes: profile.availableTimePerWeekMinutes,
  };
}

export function buildProfileItems(input: OnboardingInput) {
  const itemGroups = [
    [profileItemKinds.primaryGoal, splitLines(input.primaryGoals)],
    [profileItemKinds.domain, splitLines(input.domains)],
    [profileItemKinds.skill, splitLines(input.skills)],
    [profileItemKinds.language, splitLines(input.languages)],
    [profileItemKinds.platform, splitLines(input.platforms)],
    [profileItemKinds.dailyMinimum, splitLines(input.dailyMinimums)],
    [profileItemKinds.constraint, splitLines(input.constraints)],
  ] as const;

  return itemGroups.flatMap(([kind, values]) =>
    values.map((value, sortOrder) => ({
      kind,
      value,
      sortOrder,
    })),
  );
}
