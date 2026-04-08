"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import {
  ArrowLeft, Send, CalendarClock, CheckCircle, Loader2, Plus, GripVertical, Trash2, Eye, ChevronDown,
} from "lucide-react";
import { TiptapEditor } from "@/components/tiptap-editor";
import {
  RadioFieldEditor,
  createDefaultRadioSettings,
  type RadioFieldSettings,
} from "@/components/field-editors/radio-field-editor";
import {
  CheckboxFieldEditor,
  createDefaultCheckboxSettings,
  type CheckboxFieldSettings,
} from "@/components/field-editors/checkbox-field-editor";
import {
  SelectFieldEditor,
  createDefaultSelectSettings,
  type SelectFieldSettings,
} from "@/components/field-editors/select-field-editor";
import {
  DateFieldEditor,
  createDefaultDateSettings,
  type DateFieldSettings,
} from "@/components/field-editors/date-field-editor";
import {
  TextFieldEditor,
  createDefaultTextFieldSettings,
  type TextFieldSettings,
} from "@/components/field-editors/text-field-editor";
import {
  TextAreaFieldEditor,
  createDefaultTextAreaSettings,
  type TextAreaFieldSettings,
} from "@/components/field-editors/text-area-field-editor";
import {
  NumericFieldEditor,
  createDefaultNumericSettings,
  type NumericFieldSettings,
} from "@/components/field-editors/numeric-field-editor";
import {
  DurationFieldEditor,
  createDefaultDurationSettings,
  type DurationFieldSettings,
} from "@/components/field-editors/duration-field-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ComponentPicker, COMPONENT_COLORS } from "@/components/component-picker";
import {
  DRAFT_FORM_STORAGE_KEY,
  dispatchInsightsDraftChanged,
} from "@/lib/form-draft-storage";
import { COACH_FORM_TEMPLATES } from "@/lib/coach-form-templates";
import type { CoachFormTemplate } from "@/lib/coach-form-types";
import { coachTemplateToAuthoringSnapshot } from "@/lib/coach-template-authoring";
import { setFormStatusOverride } from "@/lib/insights-form-status-storage";

const PRIMARY_ROLES = [
  "Admin",
  "School Leader",
  "Coach",
  "Teacher",
  "Support Staff",
] as const;

const OPTIONAL_ROLES = ["Student", "Family"] as const;

type Role = (typeof PRIMARY_ROLES)[number] | (typeof OPTIONAL_ROLES)[number];

const CATEGORIES = [
  "Instruction & Teaching",
  "Coaching",
  "Student Behavior",
  "Student Performance",
  "Attendance",
  "Student Support",
  "Family & Communication",
  "Operations",
  "Compliance",
  "Surveys & Feedback",
] as const;

type Category = (typeof CATEGORIES)[number];
type SaveStatus = "idle" | "saving" | "saved";

interface Field {
  id: string;
  type: string;
  label: string;
  radioSettings?: RadioFieldSettings;
  checkboxSettings?: CheckboxFieldSettings;
  selectSettings?: SelectFieldSettings;
  dateSettings?: DateFieldSettings;
  textFieldSettings?: TextFieldSettings;
  textAreaSettings?: TextAreaFieldSettings;
  numericSettings?: NumericFieldSettings;
  durationSettings?: DurationFieldSettings;
  textEditorSettings?: {
    content: string;
  };
}

function InsertAbove() {
  return (
    <div className="group/insert relative h-5 flex items-center z-10">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-primary/0 group-hover/insert:bg-primary/30 transition-colors" />
      <div className="absolute left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-border text-muted-foreground opacity-0 group-hover/insert:opacity-100 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm cursor-pointer">
        <Plus className="h-3 w-3" />
      </div>
    </div>
  );
}

function SortableField({
  field,
  index,
  onDelete,
  onUpdate,
}: {
  field: Field;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Field>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (containerRef.current?.contains(target)) return;

      // Keep the field active while interacting with portaled shadcn overlays.
      if (
        target.closest('[data-slot="select-content"]') ||
        target.closest('[data-slot="select-item"]') ||
        target.closest('[data-slot="select-scroll-up-button"]') ||
        target.closest('[data-slot="select-scroll-down-button"]') ||
        target.closest('[data-slot="popover-content"]') ||
        target.closest('[data-slot="dialog-content"]')
      ) {
        return;
      }

      setIsActive(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        containerRef.current = node;
      }}
      style={style}
      onClick={() => setIsActive(true)}
      className={`group rounded-xl border bg-white overflow-hidden transition-all ${
        isActive
          ? "border-border/80 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.18),0_6px_20px_-4px_rgba(0,0,0,0.10)]"
          : "border-border shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-border/60 bg-muted/20 pl-8 pr-2.5 py-2.5">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-xs text-muted-foreground">{index + 1}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${COMPONENT_COLORS[field.type]?.bg ?? "bg-muted"} ${COMPONENT_COLORS[field.type]?.text ?? "text-muted-foreground"}`}>
          {field.type === "dropdown" ? "select menu" : field.type.replace(/-/g, " ")}
        </span>
        <span className="flex-1" />
        <button
          onClick={() => onDelete(field.id)}
          className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="px-8 py-6">
        {field.type === "text-editor" ? (
          <TiptapEditor
            content={field.textEditorSettings?.content ?? ""}
            onChange={(html) => onUpdate(field.id, { textEditorSettings: { content: html } })}
            placeholder="Add content here…"
          />
        ) : field.type === "radio" ? (
          <RadioFieldEditor
            isActive={isActive}
            value={field.radioSettings ?? createDefaultRadioSettings()}
            onChange={(next) => onUpdate(field.id, { radioSettings: next })}
          />
        ) : field.type === "checkbox-set" ? (
          <CheckboxFieldEditor
            isActive={isActive}
            value={field.checkboxSettings ?? createDefaultCheckboxSettings()}
            onChange={(next) => onUpdate(field.id, { checkboxSettings: next })}
          />
        ) : field.type === "dropdown" ? (
          <SelectFieldEditor
            isActive={isActive}
            value={field.selectSettings ?? createDefaultSelectSettings()}
            onChange={(next) => onUpdate(field.id, { selectSettings: next })}
          />
        ) : field.type === "date" ? (
          <DateFieldEditor
            isActive={isActive}
            value={field.dateSettings ?? createDefaultDateSettings()}
            onChange={(next) => onUpdate(field.id, { dateSettings: next })}
          />
        ) : field.type === "text-field" ? (
          <TextFieldEditor
            isActive={isActive}
            value={field.textFieldSettings ?? createDefaultTextFieldSettings()}
            onChange={(next) => onUpdate(field.id, { textFieldSettings: next })}
          />
        ) : field.type === "text-area" ? (
          <TextAreaFieldEditor
            isActive={isActive}
            value={field.textAreaSettings ?? createDefaultTextAreaSettings()}
            onChange={(next) => onUpdate(field.id, { textAreaSettings: next })}
          />
        ) : field.type === "number" ? (
          <NumericFieldEditor
            isActive={isActive}
            value={field.numericSettings ?? createDefaultNumericSettings()}
            onChange={(next) => onUpdate(field.id, { numericSettings: next })}
          />
        ) : field.type === "duration" ? (
          <DurationFieldEditor
            isActive={isActive}
            value={field.durationSettings ?? createDefaultDurationSettings()}
            onChange={(next) => onUpdate(field.id, { durationSettings: next })}
          />
        ) : (
          <div className="h-9 rounded-md border border-dashed border-border bg-muted/20 flex items-center px-3">
            <span className="text-xs text-muted-foreground/60 italic">
              {field.label} field preview
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function useSaveStatus() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [, setTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  function triggerSave() {
    setStatus("saving");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLastSaved(new Date());
      setStatus("saved");
    }, 800);
  }

  function getLabel(): string | null {
    if (status === "saving") return "Saving…";
    if (status === "saved" && lastSaved) {
      const secs = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
      if (secs < 30) return "All Changes Saved";
      if (secs < 90) return "Saved Just Now";
      const mins = Math.floor(secs / 60);
      return mins === 1 ? "Saved 1 Minute Ago" : `Saved ${mins} Minutes Ago`;
    }
    return null;
  }

  return { status, triggerSave, label: getLabel() };
}

function readDraftFromStorage(): {
  title: string;
  category: Category | null;
  audience: Role[];
  fields: Field[];
} {
  if (typeof window === "undefined") {
    return { title: "", category: null, audience: [], fields: [] };
  }
  try {
    const raw = JSON.parse(localStorage.getItem(DRAFT_FORM_STORAGE_KEY) ?? "{}") as {
      title?: string;
      category?: Category | null;
      audience?: Role[];
      fields?: Field[];
    };
    return {
      title: raw.title ?? "",
      category: raw.category ?? null,
      audience: Array.isArray(raw.audience) ? raw.audience : [],
      fields: Array.isArray(raw.fields) ? raw.fields : [],
    };
  } catch {
    return { title: "", category: null, audience: [], fields: [] };
  }
}

function FormAuthorPage({
  seedTemplate,
  openedFromInsightsTemplate,
}: {
  seedTemplate?: CoachFormTemplate;
  /** True when URL had ?editTemplate= (opened from Insights row Edit). Preview back link uses Insights. */
  openedFromInsightsTemplate: boolean;
}) {
  const [title, setTitle] = useState<string>(() => {
    if (seedTemplate) return seedTemplate.title;
    return readDraftFromStorage().title;
  });
  const [category, setCategory] = useState<Category | null>(() => {
    if (seedTemplate) return seedTemplate.category as Category;
    return readDraftFromStorage().category;
  });
  const [audience, setAudience] = useState<Role[]>(() => {
    if (seedTemplate) return [];
    return readDraftFromStorage().audience;
  });
  const [fields, setFields] = useState<Field[]>(() => {
    if (seedTemplate) {
      const snap = coachTemplateToAuthoringSnapshot(seedTemplate);
      return snap.fields as Field[];
    }
    return readDraftFromStorage().fields;
  });
  const draftIdRef = useRef<string | null>(seedTemplate?.id ?? null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function addField(type: string, label: string, atIndex?: number) {
    const newField: Field = {
      id: crypto.randomUUID(),
      type,
      label,
      ...(type === "radio" ? { radioSettings: createDefaultRadioSettings() } : {}),
      ...(type === "checkbox-set" ? { checkboxSettings: createDefaultCheckboxSettings() } : {}),
      ...(type === "dropdown" ? { selectSettings: createDefaultSelectSettings() } : {}),
      ...(type === "date" ? { dateSettings: createDefaultDateSettings() } : {}),
      ...(type === "text-field" ? { textFieldSettings: createDefaultTextFieldSettings() } : {}),
      ...(type === "text-area" ? { textAreaSettings: createDefaultTextAreaSettings() } : {}),
      ...(type === "number" ? { numericSettings: createDefaultNumericSettings() } : {}),
      ...(type === "duration" ? { durationSettings: createDefaultDurationSettings() } : {}),
      ...(type === "text-editor" ? { textEditorSettings: { content: "" } } : {}),
    };
    setFields((prev) => {
      if (atIndex !== undefined) {
        const next = [...prev];
        next.splice(atIndex, 0, newField);
        return next;
      }
      return [...prev, newField];
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((prev) => {
        const oldIndex = prev.findIndex((f) => f.id === active.id);
        const newIndex = prev.findIndex((f) => f.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }
  const { status: saveStatus, triggerSave, label: saveLabel } = useSaveStatus();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    triggerSave();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, category, audience, fields]);

  const router = useRouter();
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(DRAFT_FORM_STORAGE_KEY) ?? "{}") as {
        id?: string;
      };
      if (existing.id && !draftIdRef.current) {
        draftIdRef.current = existing.id;
      }
    } catch {
      /* noop */
    }

    const listable =
      title.trim().length > 0 ||
      !!category ||
      audience.length > 0 ||
      fields.length > 0;

    if (listable && !draftIdRef.current) {
      draftIdRef.current = crypto.randomUUID();
    }

    const payload = {
      id: draftIdRef.current ?? undefined,
      title,
      category,
      audience,
      fields,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_FORM_STORAGE_KEY, JSON.stringify(payload));

    if (draftIdRef.current) {
      dispatchInsightsDraftChanged();
    }
  }, [title, category, audience, fields]);

  const canPublish = !!title.trim() && !!category;

  const handlePublish = useCallback(() => {
    if (!canPublish) return;
    const id = draftIdRef.current;
    if (!id) return;
    setFormStatusOverride(id, "Published");
    router.push("/");
  }, [canPublish, router]);

  const handlePreview = useCallback(() => {
    const source = openedFromInsightsTemplate ? "insights" : "authoring";
    router.push(`/forms/new/preview?source=${source}`);
  }, [openedFromInsightsTemplate, router]);

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back To Insight Capture
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {title.trim() || "Untitled Form"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Draft</p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            {/* Save status indicator */}
            {saveLabel && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {saveStatus === "saving" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                )}
                {saveLabel}
              </span>
            )}

            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye />
              Preview
            </Button>
            <Button variant="outline" size="sm" disabled={!canPublish}>
              <CalendarClock />
              Schedule
            </Button>
            <Button size="lg" disabled={!canPublish} onClick={handlePublish}>
              <Send />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-xl bg-white border border-border shadow-sm p-8">
        <div className="flex flex-col gap-6">
          {/* Form name, category, and audience on one row (stacks on small screens) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
            <div className="flex min-w-0 flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="form-title">
                Form Name
              </label>
              <Input
                id="form-title"
                placeholder="e.g. Classroom Observation Form"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use a name that reflects its purpose.
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>
              <Select value={category ?? ""} onValueChange={(val) => setCategory(val as Category)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="What is this form for?" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex min-w-0 flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Who will complete this form?
              </label>
              <Popover>
                <PopoverTrigger
                  className="flex h-8 w-full min-w-0 items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:border-ring"
                >
                  <span
                    className={`min-w-0 truncate text-left ${
                      audience.length === 0 ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {audience.length === 0
                      ? "Select roles…"
                      : audience.length === 1
                      ? audience[0]
                      : `(${audience.length}) ${audience.join(", ")}`}
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 p-1">
                  <p className="px-1.5 py-1 text-xs text-muted-foreground">Staff</p>
                  {PRIMARY_ROLES.map((role) => (
                    <label key={role} className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-accent">
                      <Checkbox
                        checked={audience.includes(role)}
                        onCheckedChange={(checked) =>
                          setAudience((prev) =>
                            checked ? [...prev, role] : prev.filter((r) => r !== role)
                          )
                        }
                      />
                      <span className="text-sm">{role}</span>
                    </label>
                  ))}
                  <div className="my-1 h-px bg-border" />
                  <p className="px-1.5 py-1 text-xs text-muted-foreground">Optional</p>
                  {OPTIONAL_ROLES.map((role) => (
                    <label key={role} className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-accent">
                      <Checkbox
                        checked={audience.includes(role)}
                        onCheckedChange={(checked) =>
                          setAudience((prev) =>
                            checked ? [...prev, role] : prev.filter((r) => r !== role)
                          )
                        }
                      />
                      <span className="text-sm">{role}</span>
                    </label>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Form fields section */}
      <div className="mt-6">
        {fields.length > 0 && (
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-foreground">Form Fields</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {fields.length} field{fields.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {fields.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col mb-3">
                {fields.map((field, i) => (
                  <div key={field.id} className="flex flex-col">
                    <ComponentPicker onSelect={(type, label) => addField(type, label, i)}>
                      <InsertAbove />
                    </ComponentPicker>
                    <SortableField
                      field={field}
                      index={i}
                      onDelete={(id) => setFields((prev) => prev.filter((f) => f.id !== id))}
                      onUpdate={(id, patch) =>
                        setFields((prev) =>
                          prev.map((f) => (f.id === id ? { ...f, ...patch } : f))
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <ComponentPicker onSelect={addField}>
          <button className="w-full rounded-xl border-2 border-dashed border-border bg-white/60 px-8 py-14 text-center hover:border-primary/40 hover:bg-white/80 transition-colors group">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {fields.length === 0 ? "Add Your First Field" : "Add Another Field"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Click to choose a component type
            </p>
          </button>
        </ComponentPicker>
      </div>

      {/* Exit */}
      <div className="mt-4 px-1">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Exit Without Publishing
        </Link>
      </div>
    </div>
  );
}

function NewFormPageWithSearchParams() {
  const searchParams = useSearchParams();
  const editTemplateId = searchParams.get("editTemplate");
  const seedTemplate = editTemplateId
    ? COACH_FORM_TEMPLATES.find((t) => t.id === editTemplateId)
    : undefined;

  return (
    <FormAuthorPage
      seedTemplate={seedTemplate}
      openedFromInsightsTemplate={Boolean(editTemplateId)}
    />
  );
}

export default function NewFormPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl p-8 text-sm text-muted-foreground">Loading…</div>
      }
    >
      <NewFormPageWithSearchParams />
    </Suspense>
  );
}
