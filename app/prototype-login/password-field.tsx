"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PrototypeLoginPasswordField() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        name="password"
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        required
        className="w-full rounded-lg border border-neutral-300 py-2 pl-3 pr-10 text-neutral-900 outline-none focus:border-[#0a6ab1] focus:ring-1 focus:ring-[#0a6ab1]"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff className="size-4 shrink-0" aria-hidden />
        ) : (
          <Eye className="size-4 shrink-0" aria-hidden />
        )}
      </button>
    </div>
  );
}
