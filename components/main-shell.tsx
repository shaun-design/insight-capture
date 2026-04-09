"use client";

import { usePathname } from "next/navigation";

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const caseStudyMarketing =
    pathname === "/" ||
    pathname === "/case-studies" ||
    pathname.startsWith("/case-studies/");

  if (caseStudyMarketing) {
    return (
      <main className="flex-1 w-full min-w-0 max-w-none p-0">
        {children}
      </main>
    );
  }

  return (
    <main
      className="flex-1 w-full mx-auto px-4 py-8 sm:px-8 sm:py-10"
      style={{ maxWidth: 1200 }}
    >
      {children}
    </main>
  );
}
