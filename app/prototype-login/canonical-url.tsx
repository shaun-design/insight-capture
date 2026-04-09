"use client";

import { useEffect } from "react";

/** Strip redundant `?next=/` (or empty) so the address bar matches the default return path. */
export function PrototypeLoginCanonicalUrl() {
  useEffect(() => {
    const u = new URL(window.location.href);
    const next = u.searchParams.get("next");
    if (next === null) return;
    const t = next.trim();
    if (t !== "" && t !== "/") return;
    u.searchParams.delete("next");
    const qs = u.searchParams.toString();
    const path = qs ? `${u.pathname}?${qs}` : u.pathname;
    if (path !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, "", path);
    }
  }, []);
  return null;
}
