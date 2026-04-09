"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  PROTOTYPE_AUTH_COOKIE,
  constantTimeEqual,
  isPrototypeAuthConfigured,
  safePrototypeNextParam,
  signPrototypeSession,
} from "@/lib/prototype-auth";

export async function prototypeLoginAction(formData: FormData) {
  if (!isPrototypeAuthConfigured()) {
    redirect("/prototype-login?error=config");
  }

  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safePrototypeNextParam(String(formData.get("next") ?? ""));

  const eu = process.env["PROTOTYPE_AUTH_USER"]!.trim();
  const ep = process.env["PROTOTYPE_AUTH_PASSWORD"]!.trim();
  const secret = process.env["PROTOTYPE_AUTH_SECRET"]!.trim();

  if (!constantTimeEqual(user, eu) || !constantTimeEqual(password, ep)) {
    redirect(`/prototype-login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = signPrototypeSession(secret);
  const jar = await cookies();
  jar.set(PROTOTYPE_AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(next);
}
