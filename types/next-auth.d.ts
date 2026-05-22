import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      onboardingCompleted: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    onboardingCompleted: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId?: string;
    role?: Role;
    onboardingCompleted?: boolean;
  }
}