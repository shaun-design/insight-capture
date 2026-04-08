"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/case-study", label: "Case Study" },
  { href: "/", label: "Admin Demo" },
  { href: "/coach", label: "Coach Demo" },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1" aria-label="Demo areas">
      {items.map(({ href, label }) => {
        const active =
          href === "/"
            ? pathname === "/" || pathname.startsWith("/forms")
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-neutral-300 text-neutral-800"
                : "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
