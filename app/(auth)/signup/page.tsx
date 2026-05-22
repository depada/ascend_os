import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowRight, Sparkles } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthForm } from "@/components/forms/auth-form";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        onboardingCompleted: true,
      },
    });

    if (user) {
      redirect(user.onboardingCompleted ? "/dashboard" : "/onboarding");
    }
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-slate-200">
          <Sparkles className="h-4 w-4 text-sky-300" />
          Create account
        </span>
        <Link
          className="inline-flex items-center gap-2 text-sky-300 transition-colors hover:text-white"
          href="/login"
        >
          Back to login
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <AuthForm mode="signup" />
    </div>
  );
}
