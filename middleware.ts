export { auth as middleware } from "@/auth";

export const config = {
  // Only apply auth checks to the NextAuth API routes themselves
  matcher: ["/api/auth/:path*"],
};

