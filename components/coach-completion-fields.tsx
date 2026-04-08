"use client";

import { CalendarIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TiptapEditor } from "@/components/tiptap-editor";
import { cn } from "@/lib/utils";
import type { CoachFormField } from "@/lib/coach-form-templates";

export type CoachAnswersMap = Record<string, unknown>;

function requiredStar(field: CoachFormField) {
  const r =
    (field.type === "radio" && field.radioSettings?.required) ||
    (field.type === "checkbox-set" && field.checkboxSettings?.required) ||
    (field.type === "dropdown" && field.selectSettings?.required) ||
    (field.type === "date" && field.dateSettings?.required) ||
    (field.type === "text-field" && field.textFieldSettings?.required) ||
    (field.type === "text-area" && field.textAreaSettings?.required) ||
    (field.type === "number" && field.numericSettings?.required) ||
    (field.type === "duration" && field.durationSettings?.required);
  return r ? <span className="mr-1 font-semibold text-destructive">*</span> : null;
}

function promptLabel(field: CoachFormField) {
  if (field.type === "radio") return field.radioSettings?.prompt?.trim() || "Radio Set";
  if (field.type === "checkbox-set") return field.checkboxSettings?.prompt?.trim() || "Checkbox Set";
  if (field.type === "dropdown") return field.selectSettings?.prompt?.trim() || "Select";
  if (field.type === "date") return field.dateSettings?.prompt?.trim() || "Date";
  if (field.type === "text-field") return field.textFieldSettings?.prompt?.trim() || "Text";
  if (field.type === "text-area") return field.textAreaSettings?.prompt?.trim() || "Text area";
  if (field.type === "number") return field.numericSettings?.prompt?.trim() || "Number";
  if (field.type === "duration") return field.durationSettings?.prompt?.trim() || "Duration";
  return field.label;
}

export function CoachCompletionFields({
  fields,
  answers,
  onAnswersChange,
}: {
  fields: CoachFormField[];
  answers: CoachAnswersMap;
  onAnswersChange: (next: CoachAnswersMap) => void;
}) {
  function setVal(fieldId: string, value: unknown) {
    onAnswersChange({ ...answers, [fieldId]: value });
  }

  function mergeVal(fieldId: string, patch: Record<string, unknown>) {
    const prev = (answers[fieldId] as Record<string, unknown> | undefined) ?? {};
    setVal(fieldId, { ...prev, ...patch });
  }

  return (
    <div className="flex flex-col gap-8">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-2">
          {field.type === "text-editor" ? (
            <div
              className="tiptap text-sm text-foreground"
              dangerouslySetInnerHTML={{
                __html:
                  field.textEditorSettings?.content?.trim() ||
                  '<p class="text-muted-foreground">No content.</p>',
              }}
            />
          ) : (
            <label className="text-base font-semibold leading-6 text-foreground">
              {requiredStar(field)}
              {promptLabel(field)}
            </label>
          )}

          {field.type === "text-field" && (
            <Input
              placeholder="Enter your answer…"
              value={(answers[field.id] as string) ?? ""}
              onChange={(e) => setVal(field.id, e.target.value)}
            />
          )}

          {field.type === "text-area" && (
            <TiptapEditor
              content={(answers[field.id] as string) ?? ""}
              onChange={(html) => setVal(field.id, html)}
              placeholder="Enter your answer…"
            />
          )}

          {field.type === "number" && (
            <div className="flex flex-col gap-3">
              <Input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                value={(answers[field.id] as { n?: string })?.n ?? ""}
                onChange={(e) => mergeVal(field.id, { n: e.target.value })}
              />
              {field.numericSettings?.commentsEnabled ? (
                <Textarea
                  placeholder="Add comments…"
                  className="min-h-20 resize-none"
                  value={(answers[field.id] as { comment?: string })?.comment ?? ""}
                  onChange={(e) => mergeVal(field.id, { comment: e.target.value })}
                />
              ) : null}
            </div>
          )}

          {field.type === "date" && (
            <DateBlock
              field={field}
              answers={answers}
              mergeVal={mergeVal}
            />
          )}

          {field.type === "dropdown" && (
            <Select
              value={(answers[field.id] as string) ?? ""}
              onValueChange={(v) => setVal(field.id, v ?? "")}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Choose an option…" />
              </SelectTrigger>
              <SelectContent>
                {(field.selectSettings?.options?.length
                  ? field.selectSettings.options
                  : []
                ).map((opt) => (
                  <SelectItem key={opt.id} value={opt.value || opt.text}>
                    {opt.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {field.type === "radio" && (
            <RadioBlock field={field} answers={answers} setVal={setVal} mergeVal={mergeVal} />
          )}

          {field.type === "checkbox-set" && (
            <CheckboxSetAnswer field={field} answers={answers} setVal={setVal} />
          )}

          {field.type === "duration" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-24"
                  placeholder="1"
                  min={1}
                  max={12}
                  value={(answers[field.id] as { h?: string })?.h ?? ""}
                  onChange={(e) => mergeVal(field.id, { h: e.target.value })}
                />
                <span className="text-sm text-foreground/70">hrs</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-24"
                  placeholder="0"
                  min={0}
                  max={60}
                  value={(answers[field.id] as { m?: string })?.m ?? ""}
                  onChange={(e) => mergeVal(field.id, { m: e.target.value })}
                />
                <span className="text-sm text-foreground/70">min</span>
              </div>
              {field.durationSettings?.commentsEnabled ? (
                <Textarea
                  placeholder="Add comments…"
                  className="min-h-20 resize-none"
                  value={(answers[field.id] as { comment?: string })?.comment ?? ""}
                  onChange={(e) => mergeVal(field.id, { comment: e.target.value })}
                />
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DateBlock({
  field,
  answers,
  mergeVal,
}: {
  field: CoachFormField;
  answers: CoachAnswersMap;
  mergeVal: (fieldId: string, patch: Record<string, unknown>) => void;
}) {
  const raw = (answers[field.id] as { date?: string; comment?: string }) ?? {};
  const d = raw.date ? new Date(raw.date) : undefined;
  return (
    <div className="flex flex-col gap-3">
      <Popover>
        <PopoverTrigger
          data-empty={!d}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-start gap-2 text-left font-normal data-[empty=true]:text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {d ? d.toLocaleDateString() : <span>Pick a date</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={d}
            onSelect={(next) =>
              mergeVal(field.id, { date: next ? next.toISOString() : "" })
            }
          />
        </PopoverContent>
      </Popover>
      {field.dateSettings?.commentsEnabled ? (
        <Textarea
          placeholder="Add comments…"
          className="min-h-20 resize-none"
          value={raw.comment ?? ""}
          onChange={(e) => mergeVal(field.id, { comment: e.target.value })}
        />
      ) : null}
    </div>
  );
}

function RadioBlock({
  field,
  answers,
  setVal,
  mergeVal,
}: {
  field: CoachFormField;
  answers: CoachAnswersMap;
  setVal: (id: string, v: unknown) => void;
  mergeVal: (id: string, patch: Record<string, unknown>) => void;
}) {
  const comments = field.radioSettings?.commentsEnabled;
  const choice = comments
    ? (answers[field.id] as { choice?: string })?.choice ?? ""
    : ((answers[field.id] as string) ?? "");
  const comment = (answers[field.id] as { comment?: string })?.comment ?? "";

  function pick(v: string) {
    if (comments) mergeVal(field.id, { choice: v });
    else setVal(field.id, v);
  }

  const options = field.radioSettings?.options ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div
        className={
          field.radioSettings?.displayOrientation === "Horizontal"
            ? "flex flex-wrap gap-x-6 gap-y-2"
            : "flex flex-col gap-2"
        }
      >
        {options.map((opt) => {
          const v = opt.value || opt.text;
          return (
            <label key={opt.id} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name={field.id}
                className="h-4 w-4 accent-primary"
                checked={choice === v}
                onChange={() => pick(v)}
              />
              <span className="text-sm font-normal text-foreground">{opt.text}</span>
            </label>
          );
        })}
      </div>
      {comments ? (
        <Textarea
          placeholder="Add comments…"
          className="min-h-20 resize-none"
          value={comment}
          onChange={(e) => mergeVal(field.id, { comment: e.target.value })}
        />
      ) : null}
    </div>
  );
}

function CheckboxSetAnswer({
  field,
  answers,
  setVal,
}: {
  field: CoachFormField;
  answers: CoachAnswersMap;
  setVal: (id: string, v: unknown) => void;
}) {
  const raw = answers[field.id];
  const selected: string[] = Array.isArray(raw) ? raw : [];
  const options = field.checkboxSettings?.options ?? [];

  function toggle(optValue: string, checked: boolean) {
    const next = checked ? [...selected, optValue] : selected.filter((x) => x !== optValue);
    setVal(field.id, next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={
          field.checkboxSettings?.displayOrientation === "Horizontal"
            ? "flex flex-wrap gap-x-6 gap-y-2"
            : "flex flex-col gap-2"
        }
      >
        {options.map((opt) => {
          const v = opt.value || opt.text;
          return (
            <label key={opt.id} className="flex cursor-pointer items-center gap-2.5">
              <Checkbox
                checked={selected.includes(v)}
                onCheckedChange={(c) => toggle(v, c === true)}
              />
              <span className="text-sm text-foreground">{opt.text}</span>
            </label>
          );
        })}
      </div>
      {field.checkboxSettings?.commentsEnabled ? (
        <Textarea
          placeholder="Add comments…"
          className="min-h-20 resize-none"
          value={(answers[`${field.id}__comments`] as string) ?? ""}
          onChange={(e) => setVal(`${field.id}__comments`, e.target.value)}
        />
      ) : null}
    </div>
  );
}
