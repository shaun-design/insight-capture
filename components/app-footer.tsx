"use client";

import Link from "next/link";

export function AppFooter() {
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
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
          © {new Date().getFullYear()} Shaun Herron. All rights reserved.
        </p>
        <Link
          href="#"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          style={{ textDecoration: "none" }}
        >
          Help
        </Link>
      </div>
    </footer>
  );
}
