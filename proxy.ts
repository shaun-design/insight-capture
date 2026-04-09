import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  PROTOTYPE_AUTH_COOKIE,
  isPrototypeAuthConfigured,
  verifyPrototypeSession,
} from "@/lib/prototype-auth";

function isProtectedPath(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/coach" ||
    pathname.startsWith("/coach/") ||
    pathname === "/forms" ||
    pathname.startsWith("/forms/")
  );
}

export default function proxy(request: NextRequest, _event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  if (pathname === "/sign-in" || pathname.startsWith("/sign-in/")) {
    const u = new URL("/prototype-login", request.url);
    const q = request.nextUrl.searchParams.get("redirect_url");
    if (q) u.searchParams.set("next", q);
    return NextResponse.redirect(u);
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!isPrototypeAuthConfigured()) {
    return new NextResponse(
      "Prototype auth is not configured. Set PROTOTYPE_AUTH_USER, PROTOTYPE_AUTH_PASSWORD, and PROTOTYPE_AUTH_SECRET in the environment.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const secret = process.env["PROTOTYPE_AUTH_SECRET"]!.trim();
  const token = request.cookies.get(PROTOTYPE_AUTH_COOKIE)?.value;
  if (!verifyPrototypeSession(token, secret)) {
    const login = new URL("/prototype-login", request.url);
    login.searchParams.set(
      "next",
      `${pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
