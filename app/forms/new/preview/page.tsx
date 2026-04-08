"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Search, CalendarIcon, Clock, X, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TiptapEditor } from "@/components/tiptap-editor";

interface Field {
  id: string;
  type: string;
  label: string;
  radioSettings?: {
    prompt: string;
    options: Array<{ id: string; text: string; value: string }>;
    displayOrientation: "Vertical" | "Horizontal";
    required: boolean;
    commentsEnabled: boolean;
  };
  checkboxSettings?: {
    prompt: string;
    options: Array<{ id: string; text: string; value: string }>;
    displayOrientation: "Vertical" | "Horizontal";
    required: boolean;
    commentsEnabled: boolean;
  };
  selectSettings?: {
    prompt: string;
    options: Array<{ id: string; text: string; value: string }>;
    required: boolean;
    commentsEnabled: boolean;
  };
  dateSettings?: {
    prompt: string;
    required: boolean;
    commentsEnabled: boolean;
  };
  textFieldSettings?: {
    prompt: string;
    required: boolean;
  };
  textAreaSettings?: {
    prompt: string;
    required: boolean;
  };
  numericSettings?: {
    prompt: string;
    required: boolean;
    commentsEnabled: boolean;
  };
  durationSettings?: {
    prompt: string;
    required: boolean;
    commentsEnabled: boolean;
  };
  textEditorSettings?: {
    content: string;
  };
}

interface FormData {
  title: string;
  category: string;
  audience: string[];
  fields: Field[];
}

// Mock people and groups for "About" search
const ABOUT_OPTIONS = [
  { id: "1", name: "Maya Johnson", type: "student", grade: "Grade 5" },
  { id: "2", name: "Carlos Rivera", type: "student", grade: "Grade 3" },
  { id: "3", name: "Emma Chen", type: "student", grade: "Grade 4" },
  { id: "4", name: "James Williams", type: "student", grade: "Grade 5" },
  { id: "5", name: "Sofia Patel", type: "student", grade: "Grade 2" },
  { id: "6", name: "Liam Thompson", type: "student", grade: "Grade 3" },
  { id: "7", name: "3rd Grade Math — Period 2", type: "group", grade: "Group" },
  { id: "8", name: "5th Grade Reading — Block A", type: "group", grade: "Group" },
  { id: "9", name: "Behavior Intervention Group", type: "group", grade: "Group" },
];

const MOCK_COMPLETER = {
  name: "Sarah Mitchell",
  role: "Teacher",
};

function AboutSearch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof ABOUT_OPTIONS[0] | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = ABOUT_OPTIONS.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {selected ? (
        <div className="flex items-center gap-2 h-9 rounded-md border border-input bg-background px-3 text-sm">
          <span className="flex-1 text-foreground">{selected.name}</span>
          <span className="text-xs text-foreground/70">{selected.grade}</span>
          <button
            onClick={() => { setSelected(null); setQuery(""); }}
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/60" />
          <input
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground"
            placeholder="Search for a student or group…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
          />
        </div>
      )}
      {open && !selected && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-white shadow-md overflow-hidden">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-foreground/70">No results found.</p>
          ) : (
            <ul>
              {filtered.map((opt) => (
                <li key={opt.id}>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors"
                    onClick={() => { setSelected(opt); setOpen(false); setQuery(""); }}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {opt.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{opt.name}</p>
                      <p className="text-xs text-foreground/70">{opt.grade}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function FieldPreview({ field }: { field: Field }) {
  const baseInput = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground";
  const radioPrompt = field.radioSettings?.prompt?.trim() || "Radio Set";
  const radioOptions =
    field.radioSettings?.options?.filter((o) => o.text.trim().length > 0) ?? [];
  const checkboxPrompt = field.checkboxSettings?.prompt?.trim() || "Checkbox Set";
  const checkboxOptions =
    field.checkboxSettings?.options?.filter((o) => o.text.trim().length > 0) ?? [];
  const selectPrompt = field.selectSettings?.prompt?.trim() || "Select Menu";
  const selectOptions =
    field.selectSettings?.options?.filter((o) => o.text.trim().length > 0) ?? [];
  const datePrompt = field.dateSettings?.prompt?.trim() || "Date Picker";
  const textFieldPrompt = field.textFieldSettings?.prompt?.trim() || "Text Field";
  const textAreaPrompt = field.textAreaSettings?.prompt?.trim() || "Text Area";
  const numericPrompt = field.numericSettings?.prompt?.trim() || "Number Field";
  const durationPrompt = field.durationSettings?.prompt?.trim() || "Duration";
  const [selectedSelectValue, setSelectedSelectValue] = useState("");
  const [selectedFieldDate, setSelectedFieldDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col gap-2">
      {field.type !== "text-editor" ? (
        <label className="text-base font-semibold leading-6 text-foreground">
          {(field.type === "radio" && field.radioSettings?.required) ||
          (field.type === "checkbox-set" && field.checkboxSettings?.required) ||
          (field.type === "dropdown" && field.selectSettings?.required) ||
          (field.type === "date" && field.dateSettings?.required) ||
          (field.type === "text-field" && field.textFieldSettings?.required) ||
          (field.type === "text-area" && field.textAreaSettings?.required) ||
          (field.type === "number" && field.numericSettings?.required) ||
          (field.type === "duration" && field.durationSettings?.required) ? (
            <span className="mr-1 text-base font-semibold text-destructive">*</span>
          ) : null}
          {field.type === "radio"
            ? radioPrompt
            : field.type === "checkbox-set"
            ? checkboxPrompt
            : field.type === "dropdown"
            ? selectPrompt
            : field.type === "date"
            ? datePrompt
            : field.type === "text-field"
            ? textFieldPrompt
            : field.type === "text-area"
            ? textAreaPrompt
            : field.type === "number"
            ? numericPrompt
            : field.type === "duration"
            ? durationPrompt
            : field.label}
        </label>
      ) : null}

      {field.type === "text-field" && (
        <Input placeholder="Enter your answer…" />
      )}
      {field.type === "text-area" && (
        <TiptapEditor placeholder="Enter your answer…" />
      )}
      {field.type === "text-editor" && (
        <div
          className="tiptap text-sm text-foreground"
          dangerouslySetInnerHTML={{
            __html:
              field.textEditorSettings?.content?.trim() ||
              '<p class="text-muted-foreground">No content provided.</p>',
          }}
        />
      )}
      {field.type === "number" && (
        <div className="flex flex-col gap-3">
          <Input type="number" inputMode="numeric" pattern="[0-9]*" placeholder="0" />
          {field.numericSettings?.commentsEnabled ? (
            <div className="pt-1">
              <Textarea
                placeholder="Add comments…"
                className="min-h-20 resize-none"
              />
            </div>
          ) : null}
        </div>
      )}
      {field.type === "date" && (
        <div className="flex flex-col gap-3">
          <Popover>
            <PopoverTrigger
              data-empty={!selectedFieldDate}
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "w-full justify-start gap-2 text-left font-normal data-[empty=true]:text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {selectedFieldDate ? selectedFieldDate.toLocaleDateString() : <span>Pick a date</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={selectedFieldDate} onSelect={setSelectedFieldDate} />
            </PopoverContent>
          </Popover>
          {field.dateSettings?.commentsEnabled ? (
            <div className="pt-1">
              <Textarea
                placeholder="Add comments…"
                className="min-h-20 resize-none"
              />
            </div>
          ) : null}
        </div>
      )}
      {field.type === "duration" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input type="number" inputMode="numeric" pattern="[0-9]*" className="w-24" placeholder="1" min={1} max={12} />
            <span className="text-sm text-foreground/70">hrs</span>
            <Input type="number" inputMode="numeric" pattern="[0-9]*" className="w-24" placeholder="0" min={0} max={60} />
            <span className="text-sm text-foreground/70">min</span>
          </div>
          {field.durationSettings?.commentsEnabled ? (
            <div className="pt-1">
              <Textarea
                placeholder="Add comments…"
                className="min-h-20 resize-none"
              />
            </div>
          ) : null}
        </div>
      )}
      {field.type === "dropdown" && (
        <div className="flex flex-col gap-3">
          <Select
            value={selectedSelectValue}
            onValueChange={(v) => setSelectedSelectValue(v ?? "")}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Choose an option…" />
            </SelectTrigger>
            <SelectContent>
              {(selectOptions.length > 0
                ? selectOptions
                : [
                    { id: "fallback-sa", text: "Option A", value: "1" },
                    { id: "fallback-sb", text: "Option B", value: "2" },
                  ]).map((opt) => (
                <SelectItem key={opt.id} value={opt.value || opt.text}>
                  {opt.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.selectSettings?.commentsEnabled ? (
            <div className="pt-1">
              <Textarea
                placeholder="Add comments…"
                className="min-h-20 resize-none"
              />
            </div>
          ) : null}
        </div>
      )}
      {field.type === "radio" && (
        <div className="flex flex-col gap-3">
          <div
            className={`${
              field.radioSettings?.displayOrientation === "Horizontal"
                ? "flex flex-wrap gap-x-6 gap-y-2"
                : "flex flex-col gap-2"
            }`}
          >
            {(radioOptions.length > 0
              ? radioOptions
              : [
                  { id: "fallback-a", text: "Option A", value: "1" },
                  { id: "fallback-b", text: "Option B", value: "2" },
                ]).map((opt) => (
              <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name={field.id} className="h-4 w-4 accent-primary" />
                <span className="text-sm font-normal text-foreground">{opt.text}</span>
              </label>
            ))}
          </div>
          {field.radioSettings?.commentsEnabled ? (
            <div className="pt-1">
              <Textarea
                placeholder="Add comments…"
                className="min-h-20 resize-none"
              />
            </div>
          ) : null}
        </div>
      )}
      {field.type === "checkbox-set" && (
        <div className="flex flex-col gap-3">
          <div
            className={`${
              field.checkboxSettings?.displayOrientation === "Horizontal"
                ? "flex flex-wrap gap-x-6 gap-y-2"
                : "flex flex-col gap-2"
            }`}
          >
            {(checkboxOptions.length > 0
              ? checkboxOptions
              : [
                  { id: "fallback-ca", text: "Option A", value: "1" },
                  { id: "fallback-cb", text: "Option B", value: "2" },
                ]).map((opt) => (
              <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-primary rounded" />
                <span className="text-sm text-foreground">{opt.text}</span>
              </label>
            ))}
          </div>
          {field.checkboxSettings?.commentsEnabled ? (
            <div className="pt-1">
              <Textarea
                placeholder="Add comments…"
                className="min-h-20 resize-none"
              />
            </div>
          ) : null}
        </div>
      )}
      {field.type === "attachment" && (
        <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-8 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-colors">
          <p className="text-sm font-medium text-foreground">Click to attach a file</p>
          <p className="mt-1 text-xs text-muted-foreground">or drag and drop here</p>
        </div>
      )}
      {field.type === "rubric" && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-3 py-2 text-left text-xs font-medium text-foreground w-32">Criteria</th>
                {["Exceeds", "Meets", "Approaching", "Below"].map((h) => (
                  <th key={h} className="px-3 py-2 text-center text-xs font-medium text-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Quality", "Accuracy", "Effort"].map((row) => (
                <tr key={row} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 text-xs font-medium text-foreground">{row}</td>
                  {[4, 3, 2, 1].map((score) => (
                    <td key={score} className="px-3 py-2 text-center">
                      <input type="radio" name={`${field.id}-${row}`} className="h-4 w-4 accent-primary" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {field.type === "table-grid" && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Column 1", "Column 2", "Column 3"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-medium text-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row} className="border-b border-border last:border-0">
                  {[1, 2, 3].map((col) => (
                    <td key={col} className="px-2 py-1.5">
                      <input className="h-7 w-full rounded border border-input bg-transparent px-2 text-xs outline-none focus:border-ring" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



function PreviewPageInner() {
  const searchParams = useSearchParams();
  const fromInsights = searchParams.get("source") === "insights";
  const backHref = fromInsights ? "/admin" : "/forms/new";
  const backLabel = fromInsights ? "Back to Insight Capture" : "Back to Authoring";

  const [form, setForm] = useState<FormData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const now = new Date();
  const initHour = now.getHours() % 12 || 12;
  const [hour, setHour] = useState(String(initHour).padStart(2, "0"));
  const [minute, setMinute] = useState(String(now.getMinutes()).padStart(2, "0"));
  const [ampm, setAmpm] = useState(now.getHours() >= 12 ? "PM" : "AM");

  useEffect(() => {
    const raw = localStorage.getItem("draft-form");
    if (raw) setForm(JSON.parse(raw));
  }, []);

  if (!form) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        No form data found.{" "}
        <Link href={backHref} className="underline hover:text-foreground">
          {fromInsights ? "Back to Insight Capture" : "Back to authoring"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {backLabel}
      </Link>

      {/* Preview banner */}
      <div className="mb-6 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5">
        <span className="text-xs font-medium text-amber-700">Preview Mode</span>
        <span className="text-xs text-amber-600">— This is how the form will appear to completers.</span>
      </div>

      {/* Form card */}
      <div className="rounded-xl bg-white border border-border shadow-sm overflow-hidden">

        {/* Form title header */}
        <div className="border-b border-border px-8 py-6">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground">{form.title || "Untitled Form"}</h1>
              {form.category && (
                <Badge variant="outline" className="mt-2 text-xs bg-muted/40 border-transparent text-foreground/75">
                  {form.category}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Metadata section */}
        <div className="border-b border-border bg-muted/20 px-8 py-5 flex flex-col gap-4">

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/75 uppercase tracking-wide flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" /> Date
              </label>
              <Popover>
                <PopoverTrigger className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-white px-3 text-sm text-foreground outline-none hover:bg-muted/30 transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20">
                  <span>
                    {selectedDate
                      ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                      : "Pick a date"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-foreground/60 shrink-0" />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/75 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Time
              </label>
              <div className="flex items-center gap-1">
                <Select value={hour} onValueChange={(v) => setHour(v ?? "")}>
                  <SelectTrigger className="w-18 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-foreground/70 text-sm">:</span>
                <Select value={minute} onValueChange={(v) => setMinute(v ?? "")}>
                  <SelectTrigger className="w-18 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={ampm} onValueChange={(v) => setAmpm(v ?? "")}>
                  <SelectTrigger className="w-18 bg-white">
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

          {/* Completer */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground/75 uppercase tracking-wide">
              Completing as
            </label>
            <div className="flex items-center gap-3 h-9 rounded-md border border-input bg-white px-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                {MOCK_COMPLETER.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <span className="text-sm font-medium text-foreground">{MOCK_COMPLETER.name}</span>
              <span className="text-xs text-foreground/70">·</span>
              <span className="text-xs text-foreground/70">{MOCK_COMPLETER.role}</span>
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground/75 uppercase tracking-wide">
              Completing this form about
            </label>
            <AboutSearch />
          </div>

        </div>

        {/* Form fields */}
        <div className="px-8 py-6 flex flex-col gap-6">
          {form.fields.length === 0 ? (
            <p className="py-8 text-center text-sm text-foreground/70">
              No fields added yet.{" "}
              <Link href={backHref} className="underline hover:text-foreground">
                {fromInsights ? "Return to Insight Capture" : "Return to authoring"}
              </Link>{" "}
              to add some.
            </p>
          ) : (
            form.fields.map((field) => (
              <FieldPreview key={field.id} field={field} />
            ))
          )}
        </div>

        {/* Submit */}
        {form.fields.length > 0 && (
          <div className="border-t border-border px-8 py-5 flex items-center justify-between">
            <Button type="button" variant="outline" size="sm" disabled className="pointer-events-none opacity-60">
              Clear Form
            </Button>
            <Button type="button" disabled>
              Submit
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl p-8 text-sm text-muted-foreground">Loading…</div>
      }
    >
      <PreviewPageInner />
    </Suspense>
  );
}
