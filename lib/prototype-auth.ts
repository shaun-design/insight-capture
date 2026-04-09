import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const PROTOTYPE_AUTH_COOKIE = "prototype_demo_auth";

export function isPrototypeAuthConfigured(): boolean {
  return Boolean(
    process.env["PROTOTYPE_AUTH_USER"]?.trim() &&
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
  if (!next || typeof next !== "string") return "/admin";
  const t = next.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return "/admin";
  return t;
}
