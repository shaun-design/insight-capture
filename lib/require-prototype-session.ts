import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  PROTOTYPE_AUTH_COOKIE,
  PROTOTYPE_INVOKE_HEADER,
  isPrototypeAuthConfigured,
  isPrototypePublicPath,
  prototypeLoginHref,
  verifyPrototypeSession,
} from "@/lib/prototype-auth";

function pathnameFromUrlLike(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;
  try {
    const u = value.startsWith("/") ? new URL(value, "http://n") : new URL(value);
    return u.pathname || "/";
  } catch {
    return null;
  }
}

function pathAndSearchFromUrlLike(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;
  try {
    const u = value.startsWith("/") ? new URL(value, "http://n") : new URL(value);
    return `${u.pathname || "/"}${u.search}`;
  } catch {
    return null;
  }
}

/**
 * Resolves the URL the user is rendering for. `x-middleware-invoke` is set by
 * `proxy.ts` on document requests, but RSC/flight requests often omit it; we
 * fall back to `next-url` / `x-nextjs-rewritten-path` so `/prototype-login`
 * still gets the minimal shell (no nav, no chat).
 */
async function getMiddlewarePathname(): Promise<{ pathname: string; invoke: string | null }> {
  const h = await headers();
  const fromProxy = h.get(PROTOTYPE_INVOKE_HEADER);
  if (fromProxy) {
    const pathname = (fromProxy.split("?")[0] ?? "").trim() || "/";
    return { pathname, invoke: fromProxy };
  }

  const nextUrl = h.get("next-url");
  const pNext = pathnameFromUrlLike(nextUrl);
  if (pNext) {
    return {
      pathname: pNext,
      invoke: pathAndSearchFromUrlLike(nextUrl),
    };
  }

  const rewritten = h.get("x-nextjs-rewritten-path");
  const pRew = pathnameFromUrlLike(rewritten);
  if (pRew) {
    const q = h.get("x-nextjs-rewritten-query");
    const search = q ? `?${q}` : "";
    return { pathname: pRew, invoke: `${pRew}${search}` };
  }

  return { pathname: "/", invoke: null };
}

/** True on `/prototype-login` so the shell can hide nav and show logo only. */
export async function isPrototypeLoginRoute(): Promise<boolean> {
  const { pathname } = await getMiddlewarePathname();
  return pathname === "/prototype-login" || pathname.startsWith("/prototype-login/");
}

/**
 * Enforces the same prototype session as `proxy.ts` for document requests.
 * Use from the root layout so static/SSG HTML cannot be served without a cookie
 * when the proxy does not run for that response.
 */
export async function requirePrototypeSession(): Promise<void> {
  const { pathname, invoke } = await getMiddlewarePathname();

  if (isPrototypePublicPath(pathname)) {
    return;
  }

  if (!isPrototypeAuthConfigured()) {
    redirect(prototypeLoginHref(undefined, "config"));
  }

  const secret = process.env["PROTOTYPE_AUTH_SECRET"]!.trim();
  const token = (await cookies()).get(PROTOTYPE_AUTH_COOKIE)?.value;
  if (verifyPrototypeSession(token, secret)) {
    return;
  }

  redirect(prototypeLoginHref(invoke));
}
