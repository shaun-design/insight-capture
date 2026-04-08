import type { CaseStudyContent } from "@/lib/case-studies/types";

export const mapleleafAcademy: CaseStudyContent = {
  slug: "mapleleaf-academy",
  meta: {
    title: "Case Study — Shaun Herron (demo)",
    description:
      "Prototype demo: data capture, coaching workflows, and insight capture.",
  },
  hero: {
    eyebrow: "CASE STUDY · INSIGHT CAPTURE",
    title: (
      <>
        <span className="h1-product">Shaun Herron</span>: Demo shell for forms,
        coaching, and captured insights
      </>
    ),
    leads: [
      "This application showcases how an organization can roll out structured forms, coach completions, and lightweight insight capture in one place.",
      "Replace this narrative with your real constraints, decisions, metrics, and quotes as you draft each case study.",
    ],
  },
  outcomes: [
    {
      title: "Context",
      body: "Set expectations before stakeholders explore the admin or coach experiences in the demo.",
    },
    {
      title: "Approach",
      body: "Use typed content files per slug so each case study shares one layout and stylesheet.",
    },
    {
      title: "My Role",
      body: "Swap section copy, add media components, and register new slugs in the case study registry.",
    },
  ],
  sections: [
    {
      id: "challenge",
      kicker: "The problem",
      tocLabel: "The Problem",
      variant: "alt",
      content: (
        <div className="prose">
          <p>
            Teams need a credible story before they click into operational
            demos. A thin placeholder page does not set context or show how
            product work maps to outcomes.
          </p>
          <p>
            This section is where you describe the situation, constraints, and
            why the work mattered—before diving into research and process.
          </p>
        </div>
      ),
    },
    {
      id: "discovery",
      kicker: "Users and research",
      tocLabel: "Users & Research",
      variant: "default",
      content: (
        <div className="prose">
          <p>Summarize who you studied, what you did, and what you learned.</p>
          <ul style={{ margin: "10px 0 18px 1.2em", lineHeight: 1.75 }}>
            <li>Internal operators: admins building forms and workflows</li>
            <li>Coaches completing structured observations</li>
            <li>Leaders reviewing captured insights</li>
          </ul>
        </div>
      ),
    },
    {
      id: "strategy",
      kicker: "Plan and tradeoffs",
      tocLabel: "Plans & Tradeoffs",
      variant: "alt",
      content: (
        <div className="prose">
          <p>
            Explain the bets you made and what you gave up to ship. Short
            paragraphs work well here; you can add numbered subheads like the
            reference template when you need more structure.
          </p>
        </div>
      ),
    },
    {
      id: "process",
      kicker: "How we worked",
      tocLabel: "How We Worked",
      variant: "default",
      content: (
        <div className="prose">
          <p>
            Describe collaboration, rituals, and how decisions moved from
            discovery into delivery. Swap this for timelines, photos, or
            workshop outputs when you have them.
          </p>
        </div>
      ),
    },
    {
      id: "solution",
      kicker: "What we built",
      tocLabel: "What We Built",
      variant: "alt",
      content: (
        <div className="prose">
          <p>
            Tie the demo back to the narrative: configurable forms, coach flows,
            and the surfaces where insights surface. Add screenshots or embedded
            prototypes when ready.
          </p>
        </div>
      ),
    },
    {
      id: "impact",
      kicker: "Results",
      tocLabel: "Results",
      variant: "default",
      content: (
        <div className="prose">
          <ul>
            <li>Placeholder bullet—replace with measurable outcomes</li>
            <li>Placeholder bullet—qualitative shifts you observed</li>
            <li>Placeholder bullet—what would you do next time</li>
          </ul>
        </div>
      ),
    },
    {
      id: "reflection",
      kicker: "Reflections",
      tocLabel: "Reflections",
      variant: "alt",
      content: (
        <div className="prose">
          <p>
            Close with what stuck: what you would repeat, what surprised you, and
            how the work changed how the team builds product.
          </p>
        </div>
      ),
    },
  ],
  footer: {
    title: "Shaun Herron",
    creditLine: `© ${new Date().getFullYear()} · Shaun Herron`,
  },
};
