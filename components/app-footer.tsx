"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AppFooterProps = {
  /** When false, hides the Help link (e.g. prototype sign-in). */
  showHelp?: boolean;
};

const CASE_STUDY_PATHS = ["/", "/case-studies"];

export function AppFooter({ showHelp = true }: AppFooterProps) {
  const pathname = usePathname();
  const isCaseStudyPage =
    CASE_STUDY_PATHS.includes(pathname) || pathname.startsWith("/case-studies/");
  const displayHelp = showHelp && !isCaseStudyPage;

  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: displayHelp ? "space-between" : "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
          © {new Date().getFullYear()} Shaun Herron. All rights reserved.
        </p>
        {displayHelp && (
          <Link
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            style={{ textDecoration: "none" }}
          >
            Help
          </Link>
        )}
      </div>
    </footer>
  );
}
