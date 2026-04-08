"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export interface DurationFieldSettings {
  prompt: string;
  required: boolean;
  commentsEnabled: boolean;
}

export function createDefaultDurationSettings(): DurationFieldSettings {
  return {
    prompt: "",
    required: false,
    commentsEnabled: false,
  };
}

export function DurationFieldEditor({
  isActive = false,
  value,
  onChange,
}: {
  isActive?: boolean;
  value: DurationFieldSettings;
  onChange: (next: DurationFieldSettings) => void;
}) {
  const settings = value;

  function set<K extends keyof DurationFieldSettings>(key: K, nextValue: DurationFieldSettings[K]) {
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
            <div className="flex items-center gap-2">
              <Input type="number" min={1} max={12} placeholder="1" disabled className="w-24" />
              <span className="text-sm text-foreground/70">hrs</span>
              <Input type="number" min={0} max={60} placeholder="0" disabled className="w-24" />
              <span className="text-sm text-foreground/70">min</span>
            </div>
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

            <div className="-mx-8 -mb-6 rounded-b-xl bg-muted/30 border-t border-border px-8 pt-6 pb-8">
              <div className="px-6 py-5">
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-semibold text-foreground">Settings</p>

                  <div className="flex items-center gap-6">
                    <span className="w-40 text-sm text-foreground/70">Required to Complete?</span>
                    <div className="flex items-center gap-2">
                      <Switch checked={settings.required} onCheckedChange={(v) => set("required", v)} />
                      <span className="text-sm text-foreground">Required</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="w-40 text-sm text-foreground/70">Comments</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={settings.commentsEnabled}
                        onCheckedChange={(v) => set("commentsEnabled", !!v)}
                      />
                      <span className="text-sm text-foreground">Comments Enabled</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
