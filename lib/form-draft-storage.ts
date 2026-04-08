/** Client-only helpers for the in-progress form draft shown on the dashboard. */

export const DRAFT_FORM_STORAGE_KEY = "draft-form";
export const INSIGHTS_DRAFT_CHANGED_EVENT = "insights-draft-changed";

export type StoredDraftForm = {
  id?: string;
  title?: string;
  category?: string | null;
  audience?: string[];
  fields?: unknown[];
  updatedAt?: string;
};

export function dispatchInsightsDraftChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(INSIGHTS_DRAFT_CHANGED_EVENT));
}

export function readStoredDraftForm(): StoredDraftForm | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_FORM_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredDraftForm;
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

/** True when the draft has enough substance to appear as a row on the dashboard */
export function draftHasListableContent(d: StoredDraftForm | null): boolean {
  if (!d) return false;
  const title = (d.title ?? "").trim();
  const hasCategory = d.category != null && String(d.category).trim().length > 0;
  const audienceLen = Array.isArray(d.audience) ? d.audience.length : 0;
  const fieldsLen = Array.isArray(d.fields) ? d.fields.length : 0;
  return title.length > 0 || hasCategory || audienceLen > 0 || fieldsLen > 0;
}
