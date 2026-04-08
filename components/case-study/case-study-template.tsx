import type { CSSProperties } from "react";
import type { CaseStudyContent } from "@/lib/case-studies/types";
import { CaseStudyDocRail } from "./case-study-doc-rail";
import { CaseStudyTopNav } from "./case-study-top-nav";

type Props = {
  data: CaseStudyContent;
  /** Full template nav (logo, author). Default false when using the app shell header. */
  showTopNav?: boolean;
};

export function CaseStudyTemplate({ data, showTopNav = false }: Props) {
  const embedded = !showTopNav;
  const sectionIds = data.sections.map((s) => s.id);
  const tocItems = data.sections.map((s) => ({ id: s.id, label: s.tocLabel }));

  const outcomeCols = Math.min(Math.max(data.outcomes.length, 1), 3);

  return (
    <div
      id="case-study-root"
      className={embedded ? "case-study-template--embedded" : undefined}
    >
      {showTopNav && data.topNav ? <CaseStudyTopNav config={data.topNav} /> : null}

      <header className="hero-v3" id="outcomes">
        <div className="container hero-in">
          <div className="eyebrow">{data.hero.eyebrow}</div>
          <h1 className="h1">{data.hero.title}</h1>
          <div className="hero-leads">
            {data.hero.leads.map((text, i) => (
              <p key={i} className="hero-lead">
                {text}
              </p>
            ))}
          </div>
          <div
            className="outcome-strip"
            role="region"
            aria-label="Key outcomes"
            style={
              { "--outcome-cols": String(outcomeCols) } as CSSProperties
            }
          >
            {data.outcomes.map((o) => (
              <div key={o.title} className="outcome-card">
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </div>
            ))}
          </div>
          <nav className="toc" aria-label="Page sections">
            {data.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.tocLabel}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {data.sections.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className={`section${s.variant === "alt" ? " alt" : ""}`}
          >
            <div className="container">
              <p className="sec-kicker">{s.kicker}</p>
              {s.content}
            </div>
          </section>
        ))}
      </main>

      <CaseStudyDocRail sectionIds={sectionIds} items={tocItems} />
    </div>
  );
}
