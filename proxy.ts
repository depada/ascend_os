import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/goals/:path*",
    "/daily-log/:path*",
    "/weekly-review/:path*",
    "/platforms/:path*",
    "/skills/:path*",
    "/languages/:path*",
    "/events/:path*",
    "/routes/:path*",
    "/settings/:path*",
  ],
};