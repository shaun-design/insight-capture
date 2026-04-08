/** Persist Insights table status per form id (draft, seeded rows, template ids). */

import { dispatchInsightsDraftChanged } from "@/lib/form-draft-storage";

export type InsightsFormStatus =
  | "Draft"
  | "Published"
  | "Archived"
  | "Scheduled"
  | "Closed";

export const INSIGHTS_FORM_STATUS_OVERRIDES_KEY = "insights-form-status-overrides";
export const INSIGHTS_FORM_STATUS_OVERRIDES_EVENT = "insights-form-status-overrides-changed";

export function dispatchFormStatusOverridesChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(INSIGHTS_FORM_STATUS_OVERRIDES_EVENT));
}

export function readFormStatusOverrides(): Partial<Record<string, InsightsFormStatus>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(INSIGHTS_FORM_STATUS_OVERRIDES_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as unknown;
    return typeof p === "object" && p !== null ? (p as Record<string, InsightsFormStatus>) : {};
  } catch {
    return {};
  }
}

export function setFormStatusOverride(id: string, status: InsightsFormStatus) {
  if (typeof window === "undefined") return;
  try {
    const next = { ...readFormStatusOverrides(), [id]: status };
    localStorage.setItem(INSIGHTS_FORM_STATUS_OVERRIDES_KEY, JSON.stringify(next));
    dispatchFormStatusOverridesChanged();
    dispatchInsightsDraftChanged();
  } catch {
    /* noop */
  }
}

export function removeFormStatusOverride(id: string) {
  if (typeof window === "undefined") return;
  try {
    const cur = readFormStatusOverrides();
    if (!(id in cur)) return;
    const next = { ...cur };
    delete next[id];
    localStorage.setItem(INSIGHTS_FORM_STATUS_OVERRIDES_KEY, JSON.stringify(next));
    dispatchFormStatusOverridesChanged();
    dispatchInsightsDraftChanged();
  } catch {
    /* noop */
  }
}

export function resolveFormStatus(
  id: string | undefined,
  fallback: InsightsFormStatus
): InsightsFormStatus {
  if (!id) return fallback;
  const o = readFormStatusOverrides();
  return o[id] ?? fallback;
}

/** Apply persisted status overrides to seeded Insights rows (client-only reads). */
export function mergeInitialFormsWithStatusOverrides<
  T extends { id: string; status: InsightsFormStatus },
>(base: T[]): T[] {
  const o = readFormStatusOverrides();
  return base.map((f) => (o[f.id] ? { ...f, status: o[f.id]! } : f));
}
