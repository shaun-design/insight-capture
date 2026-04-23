import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const PROTOTYPE_AUTH_COOKIE = "prototype_demo_auth";

/** Request header set by `proxy.ts` so the root layout can enforce the same session rules. */
export const PROTOTYPE_INVOKE_HEADER = "x-middleware-invoke";

/** Paths that skip prototype session checks (proxy + server layout). */
export function isPrototypePublicPath(pathname: string): boolean {
  if (pathname === "/prototype-login" || pathname.startsWith("/prototype-login/")) {
    return true;
  }
  if (pathname.startsWith("/api/prototype-auth/")) {
    return true;
  }
  return false;
}

export function isPrototypeAuthConfigured(): boolean {
  return Boolean(
    process.env["PROTOTYPE_AUTH_PASSWORD"]?.trim() &&
      process.env["PROTOTYPE_AUTH_SECRET"]?.trim(),
  );
}

/** HMAC-signed session: `expMs:nonce.signature` */
export function signPrototypeSession(secret: string): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${exp}:${nonce}`;
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyPrototypeSession(
  token: string | undefined,
  secret: string,
): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (expected.length !== sig.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  } catch {
    return false;
  }
  const colon = payload.indexOf(":");
  if (colon === -1) return false;
  const exp = Number(payload.slice(0, colon));
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export function constantTimeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Prevent open redirects after login. */
export function safePrototypeNextParam(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return "/";
  const t = next.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return "/";
  return t;
}

/**
 * Path to the prototype login page. Omits `next` when the return path is `/`
 * so URLs stay `…/prototype-login` instead of `…/prototype-login?next=%2F`.
 */
export function prototypeLoginHref(
  next?: string | null,
  error?: "1" | "config",
): string {
  const q = new URLSearchParams();
  if (error === "1") q.set("error", "1");
  if (error === "config") q.set("error", "config");
  const safe = safePrototypeNextParam(next ?? "/");
  if (safe !== "/") q.set("next", safe);
  const qs = q.toString();
  return qs ? `/prototype-login?${qs}` : "/prototype-login";
}
