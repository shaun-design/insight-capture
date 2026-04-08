"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

export function CaseStudyDocRail({
  sectionIds,
  items,
}: {
  sectionIds: string[];
  items: Item[];
}) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const ORDER = sectionIds.filter((id) => document.getElementById(id));

    function navOffsetPx() {
      const navEl = document.querySelector("#case-study-root .nav");
      const h = navEl ? navEl.getBoundingClientRect().height : 0;
      return (h || 68) + 14;
    }

    function pickActiveId() {
      const off = navOffsetPx();
      let active = ORDER[0] ?? "";
      for (const id of ORDER) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= off) active = id;
      }
      return active;
    }

    let ticking = false;
    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setActiveId(pickActiveId());
      });
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    onScrollOrResize();
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [sectionIds]);

  return (
    <nav className="doc-rail" aria-label="Table of contents">
      <div className="doc-rail-minimap">
        {items.map(({ id, label }) => (
          <a
            key={id}
            className={`doc-rail-row${activeId === id ? " is-active" : ""}`}
            href={`#${id}`}
            data-doc-toc={id}
            aria-current={activeId === id ? "location" : undefined}
          >
            <span className="doc-rail-label">{label}</span>
            <span className="doc-rail-bar-track">
              <span className="doc-rail-bar" />
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
