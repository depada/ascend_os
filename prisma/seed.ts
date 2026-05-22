import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const demoPasswordHash = await bcrypt.hash("password123", 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {
      name: "Demo User",
      passwordHash: demoPasswordHash,
      role: Role.USER,
      onboardingCompleted: false,
    },
    create: {
      name: "Demo User",
      email: "demo@example.com",
      passwordHash: demoPasswordHash,
      role: Role.USER,
      onboardingCompleted: false,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      name: "Admin User",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      onboardingCompleted: false,
    },
    create: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      onboardingCompleted: false,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
