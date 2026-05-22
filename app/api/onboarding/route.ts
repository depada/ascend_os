import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildProfileItems, onboardingSchema } from "@/lib/onboarding";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid onboarding data.", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const profile = await prisma.$transaction(async (transaction) => {
      const savedProfile = await transaction.userProfile.upsert({
        where: {
          userId: session.user.id,
        },
        create: {
          userId: session.user.id,
          currentIdentity: parsed.data.currentIdentity,
          desiredIdentity: parsed.data.desiredIdentity,
          weeklyReviewDay: parsed.data.weeklyReviewDay,
          intensityLevel: parsed.data.intensityLevel,
          availableTimePerDayMinutes: parsed.data.availableTimePerDayMinutes,
          availableTimePerWeekMinutes: parsed.data.availableTimePerWeekMinutes,
          preferredExecutionStyle: parsed.data.preferredExecutionStyle,
        },
        update: {
          currentIdentity: parsed.data.currentIdentity,
          desiredIdentity: parsed.data.desiredIdentity,
          weeklyReviewDay: parsed.data.weeklyReviewDay,
          intensityLevel: parsed.data.intensityLevel,
          availableTimePerDayMinutes: parsed.data.availableTimePerDayMinutes,
          availableTimePerWeekMinutes: parsed.data.availableTimePerWeekMinutes,
          preferredExecutionStyle: parsed.data.preferredExecutionStyle,
        },
      });

      await transaction.userProfileItem.deleteMany({
        where: {
          profileId: savedProfile.id,
        },
      });

      const items = buildProfileItems(parsed.data);

      if (items.length > 0) {
        await transaction.userProfileItem.createMany({
          data: items.map((item) => ({
            profileId: savedProfile.id,
            kind: item.kind,
            value: item.value,
            sortOrder: item.sortOrder,
          })),
        });
      }

      await transaction.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          onboardingCompleted: true,
        },
      });

      return savedProfile;
    });

    return NextResponse.json({ profile }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to save onboarding right now." },
      { status: 500 },
    );
  }
}
