"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const caseStudyHref = "/" as const;
const adminHref = "/admin" as const;

const items = [
  { href: caseStudyHref, label: "Case Study" },
  { href: adminHref, label: "Admin Demo" },
  { href: "/coach", label: "Coach Demo" },
] as const;

function linkActive(pathname: string, href: string) {
  if (href === caseStudyHref) {
    return (
      pathname === "/" ||
      pathname === "/case-studies" ||
      pathname.startsWith("/case-studies/")
    );
  }
  if (href === adminHref) {
    return pathname === "/admin" || pathname.startsWith("/forms");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const navLinks = items.map(({ href, label }) => {
    const active = linkActive(pathname, href);
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
          active
            ? "bg-neutral-300 text-neutral-800"
            : "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700",
        )}
      >
        {label}
      </Link>
    );
  });

  const mobileLinks = items.map(({ href, label }) => {
    const active = linkActive(pathname, href);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMenuOpen(false)}
        className={cn(
          "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
          active
            ? "bg-neutral-200 text-neutral-900"
            : "text-neutral-600 hover:bg-neutral-100",
        )}
      >
        {label}
      </Link>
    );
  });

  const mobileMenu =
    menuOpen && mounted ? (
      <>
        <button
          type="button"
          className="fixed left-0 right-0 top-20 bottom-0 z-[100] bg-black/40 backdrop-blur-[1px]"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="demo-nav-mobile-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Demo navigation"
          className="fixed left-0 right-0 top-20 bottom-0 z-[101] flex flex-col overflow-y-auto overscroll-contain border-t border-neutral-200 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
        >
          <div className="shrink-0 border-b border-neutral-100 px-4 py-3">
            <p className="text-xs font-semibold tracking-wide text-neutral-500">
              Jump To
            </p>
          </div>
          <nav
            className="flex shrink-0 flex-col gap-1 p-3"
            aria-label="Demo areas"
          >
            {mobileLinks}
          </nav>
          <div className="shrink-0 border-t border-neutral-100 p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <p className="mb-2 px-1 text-xs font-semibold tracking-wide text-neutral-500">
              Account
            </p>
            <a
              href="/api/prototype-auth/logout"
              onClick={() => setMenuOpen(false)}
              className="block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left text-base font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
            >
              Log Out
            </a>
          </div>
        </div>
      </>
    ) : null;

  return (
    <>
      <nav
        className="hidden items-center gap-1 md:flex"
        aria-label="Demo areas"
      >
        {navLinks}
      </nav>

      <div className="relative z-50 md:hidden">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-200/80 hover:text-neutral-900"
          aria-expanded={menuOpen}
          aria-controls="demo-nav-mobile-panel"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </button>
        {mounted && mobileMenu
          ? createPortal(mobileMenu, document.body)
          : null}
      </div>
    </>
  );
}
