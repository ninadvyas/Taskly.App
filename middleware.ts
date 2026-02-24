import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Intentionally empty — auth is handled per-page via server-side auth() calls.
  // Never intercept /api/auth/* here; doing so blocks OAuth callbacks.
  matcher: [],
};

