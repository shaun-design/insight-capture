"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarIcon, CheckCircle, ChevronDown, Clock, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CoachCompletionFields,
  type CoachAnswersMap,
} from "@/components/coach-completion-fields";
import {
  COACH_FORM_TEMPLATES,
  completionAboutOptionsForTemplate,
  completionAboutSelectLabels,
  formCompletionStorageKey,
} from "@/lib/coach-form-templates";
import {
  appendCoachCompletion,
  incrementPublishedFormResponseCount,
  shortAboutFromOptionLabel,
} from "@/lib/coach-completions-storage";
import { cn } from "@/lib/utils";

type SaveState = "idle" | "saving" | "saved";

export type FormCompletionWorkspaceProps = {
  completionContext: "coach" | "admin";
  completerName: string;
  completerRole: string;
  backHref: string;
  backLabel: string;
  doneExitHref: string;
  doneExitLabel: string;
  /** When set (e.g. from `?template=` query), pre-select this template once on load */
  initialTemplateId?: string | null;
};

function completerInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function templateIdFromQueryParam(id: string | null | undefined): string {
  const tid = typeof id === "string" ? id.trim() : "";
  if (!tid) return "";
  return COACH_FORM_TEMPLATES.some((t) => t.id === tid) ? tid : "";
}

function CompletionActionBar({
  className,
  onClearRequest,
  onSubmit,
  saveState,
}: {
  className?: string;
  onClearRequest: () => void;
  onSubmit: () => void;
  saveState: SaveState;
}) {
  const saveLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
        ? "All Changes Saved"
        : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 bg-white/95 px-8 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={onClearRequest}
        >
          Clear Form
        </Button>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-4">
        {saveLabel ? (
          <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
            {saveState === "saving" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            )}
            {saveLabel}
          </span>
        ) : null}
        <Button type="button" size="lg" className="shrink-0" onClick={onSubmit}>
          Submit and Finish
        </Button>
      </div>
    </div>
  );
}

export function FormCompletionWorkspace({
  completionContext,
  completerName,
  completerRole,
  backHref,
  backLabel,
  doneExitHref,
  doneExitLabel,
  initialTemplateId = null,
}: FormCompletionWorkspaceProps) {
  const router = useRouter();
  const [templateId, setTemplateId] = useState(() => templateIdFromQueryParam(initialTemplateId));
  const [aboutId, setAboutId] = useState("");
  const [answers, setAnswers] = useState<CoachAnswersMap>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [doneOpen, setDoneOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const restoringRef = useRef(false);

  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(now);
  const initHour = now.getHours() % 12 || 12;
  const [hour, setHour] = useState(String(initHour).padStart(2, "0"));
  const [minute, setMinute] = useState(String(now.getMinutes()).padStart(2, "0"));
  const [ampm, setAmpm] = useState(now.getHours() >= 12 ? "PM" : "AM");

  const template = COACH_FORM_TEMPLATES.find((t) => t.id === templateId);
  const aboutOptions = useMemo(
    () => completionAboutOptionsForTemplate(templateId),
    [templateId]
  );
  const aboutSelectLabels = useMemo(
    () => completionAboutSelectLabels(templateId),
    [templateId]
  );
  const aboutLabel = aboutOptions.find((a) => a.id === aboutId)?.label;
  const canEdit = Boolean(templateId && aboutId && template);

  const getStorageKey = useCallback(() => {
    if (!templateId || !aboutId) return null;
    return formCompletionStorageKey(completionContext, templateId, aboutId);
  }, [completionContext, templateId, aboutId]);

  const loadAnswersForPair = useCallback(
    (tid: string, aid: string) => {
      restoringRef.current = true;
      const key = formCompletionStorageKey(completionContext, tid, aid);
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { answers?: CoachAnswersMap };
          setAnswers(parsed.answers ?? {});
        } catch {
          setAnswers({});
        }
      } else {
        setAnswers({});
      }
      setSaveState("saved");
      window.setTimeout(() => {
        restoringRef.current = false;
      }, 0);
    },
    [completionContext]
  );

  function onTemplateChange(v: string) {
    setTemplateId(v);
    setAboutId("");
    setAnswers({});
    setSaveState("idle");
  }

  function onAboutChange(v: string) {
    setAboutId(v);
    if (!templateId) return;
    loadAnswersForPair(templateId, v);
    setSaveState("idle");
  }

  useEffect(() => {
    const next = templateIdFromQueryParam(initialTemplateId);
    if (!next) return;
    setTemplateId(next);
    setAboutId("");
    setAnswers({});
    setSaveState("idle");
  }, [initialTemplateId]);

  useEffect(() => {
    if (!canEdit) return;
    if (restoringRef.current) return;

    const key = getStorageKey();
    if (!key) return;

    setSaveState("saving");
    const timer = window.setTimeout(() => {
      localStorage.setItem(
        key,
        JSON.stringify({
          context: completionContext,
          templateId,
          aboutId,
          answers,
          updatedAt: new Date().toISOString(),
        })
      );
      setSaveState("saved");
    }, 650);

    return () => window.clearTimeout(timer);
  }, [answers, templateId, aboutId, canEdit, completionContext, getStorageKey]);

  function handleSubmitAndFinish() {
    const key = getStorageKey();
    if (!key || !template || !aboutLabel) return;
    localStorage.removeItem(key);

    appendCoachCompletion({
      templateId: template.id,
      formName: template.title,
      category: template.category,
      about: shortAboutFromOptionLabel(aboutLabel),
      completedAtIso: new Date().toISOString(),
      status: "Submitted",
      completedBy: completerName,
    });
    incrementPublishedFormResponseCount(template.id);

    setDoneOpen(true);
  }

  function handleDoneOpenChange(open: boolean) {
    setDoneOpen(open);
    if (!open) {
      setTemplateId("");
      setAboutId("");
      setAnswers({});
      setSaveState("idle");
      router.push(doneExitHref);
    }
  }

  function confirmClearForm() {
    const key = getStorageKey();
    if (key) localStorage.removeItem(key);
    setAnswers({});
    setSaveState("saved");
    setClearOpen(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {backLabel}
      </Link>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-8 py-6">
          <h1 className="text-xl font-semibold text-foreground">Complete a Form</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Same experience for admins and coaches: pick a form, say who it&apos;s for, answer below.
            Progress saves automatically.
          </p>
        </div>

        {/* Metadata — aligned with author preview (date, time, completer, subject, form picks) */}
        <div className="flex flex-col gap-4 border-b border-border bg-muted/20 px-8 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-foreground/75 uppercase">
                <CalendarIcon className="h-3.5 w-3.5" /> Date
              </label>
              <Popover>
                <PopoverTrigger className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-white px-3 text-sm text-foreground outline-none transition-colors hover:bg-muted/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20">
                  <span>
                    {selectedDate
                      ? selectedDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Pick a date"}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-foreground/60" />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-foreground/75 uppercase">
                <Clock className="h-3.5 w-3.5" /> Time
              </label>
              <div className="flex items-center gap-1">
                <Select value={hour} onValueChange={(v) => setHour(v ?? "")}>
                  <SelectTrigger className="w-[4.5rem] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-foreground/70">:</span>
                <Select value={minute} onValueChange={(v) => setMinute(v ?? "")}>
                  <SelectTrigger className="w-[4.5rem] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={ampm} onValueChange={(v) => setAmpm(v ?? "")}>
                  <SelectTrigger className="w-[4.5rem] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-foreground/75 uppercase">
              Completing as
            </span>
            <div className="flex h-9 items-center gap-3 rounded-md border border-input bg-white px-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                {completerInitials(completerName)}
              </div>
              <span className="text-sm font-medium text-foreground">{completerName}</span>
              <span className="text-xs text-foreground/70">·</span>
              <span className="text-xs text-foreground/70">{completerRole}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium tracking-wide text-foreground/75 uppercase">
                Form to complete
              </span>
              <Select
                value={templateId || undefined}
                onValueChange={(v) => onTemplateChange(v ?? "")}
              >
                <SelectTrigger className="h-9 w-full min-w-0 bg-white">
                  <SelectValue placeholder="Choose a form…" />
                </SelectTrigger>
                <SelectContent>
                  {COACH_FORM_TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium tracking-wide text-foreground/75 uppercase">
                {aboutSelectLabels.heading}
              </span>
              <Select
                value={aboutId || undefined}
                onValueChange={(v) => onAboutChange(v ?? "")}
                disabled={!templateId}
              >
                <SelectTrigger className="h-9 w-full min-w-0 bg-white">
                  <SelectValue
                    placeholder={
                      templateId ? aboutSelectLabels.placeholder : "Choose a form first…"
                    }
                  >
                    {aboutId ? (aboutLabel ?? "") : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {aboutOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {!templateId || !aboutId ? (
          <div className="px-8 py-14 text-center text-sm text-muted-foreground">
            Choose a form and who it&apos;s for to begin.
          </div>
        ) : template ? (
          <>
            <div className="border-b border-border px-8 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{template.title}</h2>
                  {aboutLabel ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      About: <span className="font-medium text-foreground">{aboutLabel}</span>
                    </p>
                  ) : null}
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 border-transparent bg-muted/40 text-foreground/80"
                >
                  {template.category}
                </Badge>
              </div>
            </div>

            <CompletionActionBar
              className="border-b border-border"
              saveState={saveState}
              onClearRequest={() => setClearOpen(true)}
              onSubmit={handleSubmitAndFinish}
            />

            <div className="max-h-[min(65vh,640px)] overflow-y-auto overflow-x-hidden px-8 py-6">
              <CoachCompletionFields
                fields={template.fields}
                answers={answers}
                onAnswersChange={setAnswers}
              />
            </div>

            <CompletionActionBar
              className="sticky bottom-0 z-10 border-t border-border shadow-[0_-10px_40px_-16px_rgba(0,0,0,0.12)]"
              saveState={saveState}
              onClearRequest={() => setClearOpen(true)}
              onSubmit={handleSubmitAndFinish}
            />
          </>
        ) : null}
      </div>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Clear This Form?</DialogTitle>
            <DialogDescription>
              This removes every answer for this form and person on this browser and deletes the
              auto-saved draft. It does not submit a response. Use{" "}
              <span className="font-medium text-foreground">Submit and Finish</span> when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setClearOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={confirmClearForm}>
              Clear Answers
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={doneOpen} onOpenChange={handleDoneOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Thanks — you&apos;re all set</DialogTitle>
            <DialogDescription>
              This response was marked complete. In a full product it would be sent to your
              organization; here we only clear your local draft.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Link href={doneExitHref} className={cn(buttonVariants())}>
              {doneExitLabel}
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
