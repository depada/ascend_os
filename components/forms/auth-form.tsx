"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { loginSchema, signupSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

type AuthValues = {
  name?: string;
  email: string;
  password: string;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const schema = mode === "signup" ? signupSchema : loginSchema;
  const form = useForm<AuthValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isSignup = mode === "signup";

  const onSubmit = (values: AuthValues) => {
    setErrorMessage(null);
    startTransition(async () => {
      if (isSignup) {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });

        const payload = (await response.json().catch(() => ({}))) as {
          message?: string;
        };

        if (!response.ok) {
          setErrorMessage(payload.message ?? "Unable to create account.");
          return;
        }

        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (result?.error) {
          setErrorMessage(
            "Account created, but sign in failed. Please log in again.",
          );
          router.push("/login");
          return;
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setErrorMessage("Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <Card className="w-full max-w-xl border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.92))] text-white shadow-[0_24px_100px_-50px_rgba(15,23,42,1)] backdrop-blur-xl">
      <CardHeader className="space-y-3 p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-sky-100">
            {isSignup ? "Create account" : "Welcome back"}
          </span>
          <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Sprint 1
          </span>
        </div>
        <CardTitle className="text-3xl text-white">
          {isSignup
            ? "Build your first execution system"
            : "Sign in to your dashboard"}
        </CardTitle>
        <CardDescription className="max-w-md text-slate-400">
          {isSignup
            ? "Create a private workspace for your goals, routines, and long-term mission."
            : "Return to your command center and continue where you left off."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-8 pb-8">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {isSignup ? (
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-200"
                htmlFor="name"
              >
                Name
              </label>
              <Input
                autoComplete="name"
                className="bg-white/5"
                id="name"
                placeholder="Your name"
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <p className="text-sm text-rose-300">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              autoComplete="email"
              className="bg-white/5"
              id="email"
              placeholder="you@example.com"
              type="email"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-sm text-rose-300">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="bg-white/5"
              id="password"
              placeholder={
                isSignup ? "Create a strong password" : "Enter your password"
              }
              type="password"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-sm text-rose-300">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          <Button
            className="group w-full h-12 text-base"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                {isSignup ? "Create account" : "Login"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>

        <p className={cn("text-sm leading-6 text-slate-400")}>
          Demo credentials after seeding: demo@example.com / password123
        </p>
      </CardContent>
    </Card>
  );
}
