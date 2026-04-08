"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CaseStudyTopNav } from "@/lib/case-studies/types";

const logoSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="2" y="3" width="7" height="7" />
    <rect x="15" y="3" width="7" height="7" />
    <rect x="15" y="14" width="7" height="7" />
    <rect x="2" y="14" width="7" height="7" />
  </svg>
);

export function CaseStudyTopNav({ config }: { config: CaseStudyTopNav }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const home = config.brandHref ?? "/";

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const nav = document.querySelector("#case-study-root .nav");
    if (!nav) return;
    function onScroll() {
      (nav as HTMLElement).style.boxShadow =
        window.scrollY > 8 ? "0 2px 16px rgba(10,30,80,0.10)" : "none";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href={home} className="nav-logo" aria-label={`${config.brandLabel} home`}>
              <div className="nav-logo-icon" aria-hidden>
                {logoSvg}
              </div>
              <span className="nav-logo-text">{config.brandLabel}</span>
            </Link>
            <ul className="nav-links" role="list" />
            <div className="nav-right">
              <div className="nav-credit">
                <a
                  href={config.authorLinkedInUrl}
                  className="nav-author"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {config.authorName}
                </a>
              </div>
              <a
                href={config.authorLinkedInUrl}
                className="nav-linkedin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width={20}
                  height={20}
                  aria-hidden
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.07 2.07 0 11-.001 4.139 2.07 2.07 0 01.001-4.139zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <button
                className="nav-mobile-toggle"
                type="button"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
              >
                <svg
                  aria-hidden
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 -960 960 960"
                >
                  {menuOpen ? (
                    <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
                  ) : (
                    <path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`nav-mobile-menu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
        id="nav-mobile-menu"
      >
        <Link href={home} className="nav-mobile-item" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
      </div>
    </>
  );
}
