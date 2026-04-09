type Theme = {
  title: string;
  description: string;
  insights: string[];
};

const adminThemes: Theme[] = [
  {
    title: "Standardization Across Schools",
    description:
      "Organizational need for the same definitions and formats everywhere.",
    insights: [
      "Need consistent forms and data across multiple schools or departments",
      "Struggle with fragmented formats such as documents, PDFs, and spreadsheets",
      "Want shared structure for comparison and reporting",
    ],
  },
  {
    title: "Reporting and Accountability",
    description:
      "Leaders need signals they can roll up, not piles of attachments.",
    insights: [
      "Need to track performance across teachers, schools, and programs",
      "Want aggregated insights instead of only raw form data",
      "Require data for compliance, funding, and leadership reporting",
    ],
  },
  {
    title: "Efficiency and Scalability",
    description:
      "Operations break when every form is a custom project.",
    insights: [
      "Manual processes are time consuming and error prone",
      "Building forms one at a time does not scale",
      "Need systems that reduce operational overhead",
    ],
  },
  {
    title: "Data Quality and Reliability",
    description:
      "Reporting is only as good as what people actually enter.",
    insights: [
      "Inconsistent inputs make reporting unreliable",
      "Need structured data instead of only free form responses",
      "Want confidence in data used for decisions",
    ],
  },
  {
    title: "Visibility and Oversight",
    description:
      "Leaders need a picture of the whole, not only single submissions.",
    insights: [
      "Limited visibility into what is happening across classrooms",
      "Need dashboards or summaries instead of only individual submissions",
      "Want to quickly spot trends, gaps, and outliers",
    ],
  },
];

const coachThemes: Theme[] = [
  {
    title: "Usability in the Field",
    description:
      "Coaches work in motion; tools have to keep up.",
    insights: [
      "Forms need to be quick and easy to complete during observations",
      "Mobile friendly workflows are critical",
      "Avoid friction during real time use in classrooms",
    ],
  },
  {
    title: "Structured but Flexible Input",
    description:
      "Enough guidance to be comparable, enough room to be honest.",
    insights: [
      "Need guidance on what to capture",
      "Still want flexibility for context and nuance",
      "Balance between rigid forms and open feedback",
    ],
  },
  {
    title: "Reducing Administrative Burden",
    description:
      "Less retyping, less copying between tools.",
    insights: [
      "Time spent writing reports is too high",
      "Duplicate work across notes, forms, and reports",
      "Want auto saving, smart defaults, and reusable inputs",
    ],
  },
  {
    title: "Actionable Feedback",
    description:
      "Data should fuel conversations, not sit in a folder.",
    insights: [
      "Need to turn observations into meaningful feedback",
      "Want systems that support coaching conversations, not only data entry",
      "Prefer summaries and insights over raw notes",
    ],
  },
  {
    title: "Alignment with Coaching Goals",
    description:
      "Tools should match how the organization defines good practice.",
    insights: [
      "Forms should connect to coaching frameworks or rubrics",
      "Need consistency with organizational expectations",
      "Want tools that support teacher growth, not only compliance",
    ],
  },
];

const sharedThemes: string[] = [
  "Tension between standardization and flexibility",
  "Reducing manual work across the workflow",
  "Turning captured data into real insights",
  "Need for structured, reliable data everyone can trust",
  "Supporting better decisions at every level",
];

export function ResearchThemesSection() {
  return (
    <div className="research-themes">
      <p className="research-themes-lead">
        Research themes below are grouped by primary user type and reflect needs
        observed in the field.
      </p>

      <div className="research-themes-sections">
        <section
          className="research-themes-block research-themes-block--admin"
          aria-labelledby="research-admins-heading"
        >
          <div className="research-role-row">
            <span className="research-role-badge research-role-badge--admin">
              Admins
            </span>
            <h3 id="research-admins-heading" className="research-role-title">
              School leaders and organization admins
            </h3>
          </div>
          <p className="research-role-sub">
            Themes focused on consistency, reporting, scale, and oversight.
          </p>
          <div className="research-theme-stack">
            {adminThemes.map((theme) => (
              <article key={theme.title} className="research-theme-card">
                <h4>{theme.title}</h4>
                <p className="research-theme-desc">{theme.description}</p>
                <ul className="research-bullets">
                  {theme.insights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section
          className="research-themes-block research-themes-block--coach"
          aria-labelledby="research-coaches-heading"
        >
          <div className="research-role-row">
            <span className="research-role-badge research-role-badge--coach">
              Coaches
            </span>
            <h3 id="research-coaches-heading" className="research-role-title">
              Instructional coaches and field users
            </h3>
          </div>
          <p className="research-role-sub">
            Themes focused on speed in the field, flexibility, and better feedback.
          </p>
          <div className="research-theme-stack">
            {coachThemes.map((theme) => (
              <article key={theme.title} className="research-theme-card">
                <h4>{theme.title}</h4>
                <p className="research-theme-desc">{theme.description}</p>
                <ul className="research-bullets">
                  {theme.insights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="research-shared" aria-labelledby="research-shared-heading">
        <div className="research-role-row">
          <span className="research-role-badge research-role-badge--shared">
            Shared
          </span>
          <h3 id="research-shared-heading" className="research-role-title">
            Themes across both roles
          </h3>
        </div>
        <p className="research-shared-lead">
          These needs showed up whether we were talking to admins or coaches.
        </p>
        <ul className="research-bullets research-bullets--shared">
          {sharedThemes.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
