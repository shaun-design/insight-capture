"use client";

import { useMemo } from "react";
import { GripVertical, X, Plus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  id: string;
  text: string;
  value: string;
}

export interface SelectFieldSettings {
  prompt: string;
  options: SelectOption[];
  required: boolean;
  commentsEnabled: boolean;
}

export function createDefaultSelectSettings(): SelectFieldSettings {
  return {
    prompt: "",
    options: [
      { id: crypto.randomUUID(), text: "Option A", value: "" },
      { id: crypto.randomUUID(), text: "Option B", value: "" },
    ],
    required: false,
    commentsEnabled: false,
  };
}

function SortableOption({
  option,
  onUpdate,
  onRemove,
}: {
  option: SelectOption;
  onUpdate: (id: string, field: keyof SelectOption, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 group/opt">
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground/30 hover:text-muted-foreground transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Input
        value={option.text}
        onChange={(e) => onUpdate(option.id, "text", e.target.value)}
        placeholder="Add Response Text"
        className="flex-1"
      />
      <Input
        value={option.value}
        onChange={(e) => onUpdate(option.id, "value", e.target.value)}
        placeholder="Value"
        className="w-20 shrink-0 sm:w-36"
      />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onRemove(option.id)}
        className="shrink-0 opacity-0 group-hover/opt:opacity-100 hover:text-destructive hover:bg-destructive/10"
        aria-label="Remove option"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function SelectFieldEditor({
  isActive = false,
  value,
  onChange,
}: {
  isActive?: boolean;
  value: SelectFieldSettings;
  onChange: (next: SelectFieldSettings) => void;
}) {
  const settings = value;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function updateOption(id: string, field: keyof SelectOption, value: string) {
    onChange({
      ...settings,
      options: settings.options.map((o) => (o.id === id ? { ...o, [field]: value } : o)),
    });
  }

  function removeOption(id: string) {
    const nextOptions = settings.options.filter((o) => o.id !== id);
    onChange({
      ...settings,
      options: nextOptions.length >= 2 ? nextOptions : settings.options,
    });
  }

  function addOption() {
    onChange({
      ...settings,
      options: [...settings.options, { id: crypto.randomUUID(), text: "", value: "" }],
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = settings.options.findIndex((o) => o.id === active.id);
      const newIndex = settings.options.findIndex((o) => o.id === over.id);
      onChange({
        ...settings,
        options: arrayMove(settings.options, oldIndex, newIndex),
      });
    }
  }

  function set<K extends keyof SelectFieldSettings>(key: K, value: SelectFieldSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  const displayOptions = useMemo(
    () => settings.options.filter((opt) => opt.text.trim().length > 0),
    [settings.options]
  );

  return (
    <div className="relative">
      <div
        className={`grid transition-all duration-300 ease-out ${
          isActive ? "grid-rows-[0fr] opacity-0 -translate-y-1 pointer-events-none" : "grid-rows-[1fr] opacity-100 translate-y-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3">
            <p className={`text-sm ${settings.prompt ? "text-foreground" : "text-muted-foreground/50 italic"}`}>
              {settings.prompt || "Enter your prompt here"}
            </p>
            <Select value="" onValueChange={() => undefined} disabled>
              <SelectTrigger className="w-full bg-background">
                <SelectValue
                  placeholder={
                    displayOptions.length > 0
                      ? "Choose an option…"
                      : "Select Menu"
                  }
                />
              </SelectTrigger>
            </Select>
          </div>
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isActive ? "grid-rows-[1fr] opacity-100 translate-y-0" : "grid-rows-[0fr] opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-5">
            <div className="px-1 -mx-1 pt-1">
              <Textarea
                value={settings.prompt}
                onChange={(e) => set("prompt", e.target.value)}
                placeholder="Enter your prompt here"
                className="resize-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
              />
            </div>

            <p className="text-xs text-foreground/70">
              Options{" "}
              <span className="text-foreground/60">(A minimum of 2 fields are required)</span>
            </p>

            <div className="flex flex-col gap-3">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={settings.options.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                  {settings.options.map((option) => (
                    <SortableOption key={option.id} option={option} onUpdate={updateOption} onRemove={removeOption} />
                  ))}
                </SortableContext>
              </DndContext>

              <div className="flex items-center gap-2">
                <div className="w-4 shrink-0" />
                <Button variant="secondary" size="xs" onClick={addOption}>
                  <Plus />
                  Add Response Field
                </Button>
              </div>
            </div>

            <div className="-mx-4 -mb-5 rounded-b-xl bg-muted/30 border-t border-border px-4 pt-5 pb-6 sm:-mx-8 sm:-mb-6 sm:px-8 sm:pt-6 sm:pb-8">
              <div className="px-2 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-semibold text-foreground">Settings</p>

                  <label className="flex cursor-pointer items-center gap-2">
                    <Switch checked={settings.required} onCheckedChange={(v) => set("required", v)} />
                    <span className="text-sm text-foreground">Required to complete</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <Switch
                      checked={settings.commentsEnabled}
                      onCheckedChange={(v) => set("commentsEnabled", v)}
                    />
                    <span className="text-sm text-foreground">Enable comments</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
