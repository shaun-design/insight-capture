"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export interface TextFieldSettings {
  prompt: string;
  required: boolean;
}

export function createDefaultTextFieldSettings(): TextFieldSettings {
  return {
    prompt: "",
    required: false,
  };
}

export function TextFieldEditor({
  isActive = false,
  value,
  onChange,
}: {
  isActive?: boolean;
  value: TextFieldSettings;
  onChange: (next: TextFieldSettings) => void;
}) {
  const settings = value;

  function set<K extends keyof TextFieldSettings>(key: K, nextValue: TextFieldSettings[K]) {
    onChange({ ...settings, [key]: nextValue });
  }

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
            <Input placeholder="Enter your answer…" disabled />
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

            <div className="-mx-4 -mb-5 rounded-b-xl bg-muted/30 border-t border-border px-4 pt-5 pb-6 sm:-mx-8 sm:-mb-6 sm:px-8 sm:pt-6 sm:pb-8">
              <div className="px-2 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-semibold text-foreground">Settings</p>

                  <label className="flex cursor-pointer items-center gap-2">
                    <Switch checked={settings.required} onCheckedChange={(v) => set("required", v)} />
                    <span className="text-sm text-foreground">Required to complete</span>
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
