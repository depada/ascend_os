import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      onboardingCompleted: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
