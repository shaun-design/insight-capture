import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  PROTOTYPE_AUTH_COOKIE,
  PROTOTYPE_INVOKE_HEADER,
  isPrototypeAuthConfigured,
  isPrototypePublicPath,
  prototypeLoginHref,
  safePrototypeNextParam,
  verifyPrototypeSession,
} from "@/lib/prototype-auth";

function nextWithInvoke(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    PROTOTYPE_INVOKE_HEADER,
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export default function proxy(request: NextRequest, _event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  if (pathname === "/sign-in" || pathname.startsWith("/sign-in/")) {
    const q = request.nextUrl.searchParams.get("redirect_url");
    return NextResponse.redirect(
      new URL(prototypeLoginHref(q ?? undefined), request.url),
    );
  }

  if (isPrototypePublicPath(pathname)) {
    const onLogin =
      pathname === "/prototype-login" ||
      pathname.startsWith("/prototype-login/");
    const rawNext = request.nextUrl.searchParams.get("next");
    const flight =
      request.headers.get("rsc") === "1" ||
      request.headers.has("next-router-prefetch") ||
      request.nextUrl.searchParams.has("_rsc");
    if (
      onLogin &&
      rawNext !== null &&
      safePrototypeNextParam(rawNext) === "/" &&
      !flight
    ) {
      const errParam = request.nextUrl.searchParams.get("error");
      const err =
        errParam === "1" ? "1" : errParam === "config" ? "config" : undefined;
      return NextResponse.redirect(
        new URL(prototypeLoginHref(undefined, err), request.url),
      );
    }
    return nextWithInvoke(request);
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
    return NextResponse.redirect(
      new URL(
        prototypeLoginHref(`${pathname}${request.nextUrl.search}`),
        request.url,
      ),
    );
  }

  return nextWithInvoke(request);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
