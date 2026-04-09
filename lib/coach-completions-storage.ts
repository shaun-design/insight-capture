/** Persisted rows for completed form submissions (coach + admin demo) + optional admin response count deltas */

export const COACH_COMPLETIONS_STORAGE_KEY = "insights-coach-completions";
export const COACH_COMPLETIONS_CHANGED_EVENT = "insights-coach-completions-changed";
export const INSIGHTS_FORM_RESPONSE_DELTAS_KEY = "insights-form-response-deltas";
export const INSIGHTS_FORM_RESPONSE_DELTAS_EVENT = "insights-form-response-deltas-changed";

export interface StoredCoachCompletionRow {
  id: string;
  templateId: string;
  formName: string;
  category: string;
  /** Short "who" label for the table (e.g. student first name) */
  about: string;
  completedAtIso: string;
  status: "Submitted";
  completedBy: string;
}

export function dispatchCoachCompletionsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COACH_COMPLETIONS_CHANGED_EVENT));
}

export function dispatchFormResponseDeltasChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(INSIGHTS_FORM_RESPONSE_DELTAS_EVENT));
}

export function readCoachCompletionsRaw(): StoredCoachCompletionRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COACH_COMPLETIONS_STORAGE_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    return Array.isArray(p) ? (p as StoredCoachCompletionRow[]) : [];
  } catch {
    return [];
  }
}

export function appendCoachCompletion(
  row: Omit<StoredCoachCompletionRow, "id"> & { id?: string }
): StoredCoachCompletionRow {
  const list = readCoachCompletionsRaw();
  const next: StoredCoachCompletionRow = {
    ...row,
    id: row.id ?? crypto.randomUUID(),
  };
  list.push(next);
  localStorage.setItem(COACH_COMPLETIONS_STORAGE_KEY, JSON.stringify(list));
  dispatchCoachCompletionsChanged();
  return next;
}

export function deleteCoachCompletion(id: string) {
  const list = readCoachCompletionsRaw().filter((r) => r.id !== id);
  localStorage.setItem(COACH_COMPLETIONS_STORAGE_KEY, JSON.stringify(list));
  dispatchCoachCompletionsChanged();
}

/** Bumps the "Responses" count on the admin table for a published form id */
export function incrementPublishedFormResponseCount(formTableId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(INSIGHTS_FORM_RESPONSE_DELTAS_KEY);
    const map = (raw ? JSON.parse(raw) : {}) as Record<string, number>;
    map[formTableId] = (map[formTableId] ?? 0) + 1;
    localStorage.setItem(INSIGHTS_FORM_RESPONSE_DELTAS_KEY, JSON.stringify(map));
    dispatchFormResponseDeltasChanged();
  } catch {
    /* noop */
  }
}

export function readFormResponseDeltas(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(INSIGHTS_FORM_RESPONSE_DELTAS_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as Record<string, number>;
    return typeof p === "object" && p !== null ? p : {};
  } catch {
    return {};
  }
}

/** "Maya Johnson — Grade 5" → "Maya Johnson" */
export function shortAboutFromOptionLabel(label: string): string {
  const sep = label.indexOf("—");
  return sep >= 0 ? label.slice(0, sep).trim() : label.trim();
}
