import type { CaseStudyContent, CarouselSlide } from "@/lib/case-studies/types";
import { ResearchThemesSection } from "@/components/case-study/research-themes";
import { PlanTradeoffsSection } from "@/components/case-study/plan-tradeoffs-section";
import { ResultsMetricsDashboard } from "@/components/case-study/results-metrics-dashboard";

const insightProductCarouselSlides: CarouselSlide[] = [
  {
    image: "/screenshots/carousel-1.png",
    alt: "Form builder assembling fields from reusable components for school workflows",
    title: "Build Forms with the Right Components",
    description:
      "Quickly assemble forms using a flexible set of components designed for real school workflows. No custom builds required.",
  },
  {
    image: "/screenshots/carousel-2.png",
    alt: "Admin interface for creating, editing, and managing school forms in one place",
    title: "Admin Authoring Made Simple",
    description:
      "Admins can create, edit, and manage forms in one place, giving schools full control without relying on developers.",
  },
  {
    image: "/screenshots/carousel-3.png",
    alt: "Educator completing a form during an observation or reflection workflow",
    title: "Complete Forms in the Flow of Work",
    description:
      "Coaches and educators can easily complete forms during observations or reflections, reducing friction and saving time.",
  },
  {
    image: "/screenshots/carousel-4.png",
    alt: "Dashboard showing form usage, completion status, and progress across the organization",
    title: "See What's Happening Across Your Organization",
    description:
      "Track form usage, completion, and status in one dashboard so leaders can monitor progress and make informed decisions.",
  },
];

const insightWhatWeBuiltCarouselSlides: CarouselSlide[] = [
  {
    image: "/screenshots/c6-ui.png",
    alt: "Radio set field with single selection and configurable options and layout",
    title: "Radio Set",
    description:
      "Example of a single selection input with configurable options and layout.",
  },
  {
    image: "/screenshots/c7-ui.png",
    alt: "Checkbox set field with multi selection and configurable options and layout",
    title: "Checkbox Set",
    description:
      "Example of a multi selection input with configurable options and layout.",
  },
  {
    image: "/screenshots/c8-ui.png",
    alt: "Rich text editor and date picker input components in the form builder",
    title: "Text Editor and Date Picker",
    description:
      "Examples of input components for entering formatted text and selecting dates.",
  },
];

const insightHowWeWorkedCarouselSlides: CarouselSlide[] = [
  {
    image: "/screenshots/c1-admin-ai.png",
    alt: "Admin information architecture: dashboard with templates, completed forms, and form creation",
    title: "Admin IA",
    description:
      "Shows the structure of the admin dashboard, including templates, completed forms, and form creation.",
  },
  {
    image: "/screenshots/c2-coach-ai.png",
    alt: "Coach information architecture: dashboard with completed forms and active form completion",
    title: "Coach IA",
    description:
      "Shows the coach dashboard structure, including completed forms and active form completion.",
  },
  {
    image: "/screenshots/c3-admin-authoring.png",
    alt: "Admin authoring flow from creating and configuring a form through publishing",
    title: "Admin Authoring Flow",
    description:
      "Outlines the step-by-step process for creating, configuring, and publishing a form.",
  },
  {
    image: "/screenshots/c4-completing.png",
    alt: "Coach completing flow from selecting a form through completion and submit",
    title: "Coach Completing Flow",
    description:
      "Outlines the steps a coach takes to select, complete, and submit a form.",
  },
  {
    image: "/screenshots/c5-wires.png",
    alt: "Wireframes showing form components, input types, and configuration options",
    title: "Wireframes",
    description:
      "Low-fidelity layouts showing form components, input types, and configuration options.",
  },
];

export const insightCapture: CaseStudyContent = {
  slug: "insight-capture",
  meta: {
    title: "Case Study — Insight Capture",
    description:
      "A flexible system for digitizing school data collection, enabling faster reporting, reduced manual work, and more reliable insights.",
  },
  hero: {
    eyebrow: "CASE STUDY · INSIGHT CAPTURE",
    title: (
      <>
        <span className="h1-product">Insight Capture</span>: Turning fragmented
        school data into structured, reportable insights.
      </>
    ),
    leads: [
      "I designed Insight Capture, a flexible system that allows organizations to digitize any form, centralize data collection, and generate reports with confidence.",
      "Schools relied on a mix of documents, spreadsheets, and manual processes to collect important data. This made reporting slow, inconsistent, and prone to error.",
    ],
  },
  overviewCarousel: insightProductCarouselSlides,
  outcomes: [
    {
      title: "Context",
      body: "Schools used disconnected tools like Google Docs, Sheets, PDFs, and paper forms to collect data.",
    },
    {
      title: "Approach",
      body: "Designed a flexible form authoring system that centralizes data collection and enables reporting.",
    },
    {
      title: "My Role",
      body: "Led research, UX, and UI design from discovery through prototyping in collaboration with product and engineering.",
    },
  ],
  sections: [
    {
      id: "challenge",
      kicker: "The Problem",
      tocLabel: "The Problem",
      variant: "alt",
      content: (
        <div className="prose">
          <p>
            Schools needed to collect data across many use cases such as
            classroom observations, coaching feedback, travel logs, and
            surveys. To do this, they relied on a mix of tools including Google
            Docs, Sheets, PDFs, Excel files, and printed forms.
          </p>
          <p>
            A typical workflow involved a coach completing a form during a
            school visit, uploading it to a shared drive, and notifying an
            admin. The admin would then manually enter that data into another
            system for reporting.
          </p>
          <p>
            This process was slow, fragmented, and highly error prone. Data
            lived in multiple places, formats were inconsistent, and reporting
            required significant manual effort. As a result, insights were
            delayed and confidence in the data was low.
          </p>
        </div>
      ),
    },
    {
      id: "discovery",
      kicker: "Users And Research",
      tocLabel: "Users & Research",
      variant: "default",
      content: (
        <>
          <div className="prose">
            <p>
              School organizations were paying for custom form builds to
              digitize their workflows, but each request solved a single problem
              in isolation.
            </p>
            <p>
              To understand the broader need, I reviewed existing materials
              across formats including Google Docs, spreadsheets, PDFs, and
              printed documents. I also spoke directly with school leaders and
              coaches about what they were trying to measure and why.
            </p>
            <p>
              School leaders and coaches needed to collect, structure, and report
              on data. Teachers contributed by submitting forms and participating
              in observations.
            </p>
            <p>
              What emerged was that the problem was not just digitizing forms.
            </p>
            <p>
              Organizations needed a system that could standardize data, reduce
              manual work, and support reporting across the entire organization.
            </p>
            <p>
              The real problem was not form creation. It was the lack of a system
              behind the data.
            </p>
          </div>
          <ResearchThemesSection />
        </>
      ),
    },
    {
      id: "strategy",
      kicker: "Plan And Tradeoffs",
      tocLabel: "Plans & Tradeoffs",
      variant: "alt",
      content: (
        <>
          <div className="prose">
            <p>
              To move beyond one-off form builds, I designed a flexible system
              that allowed organizations to create and manage their own forms.
            </p>
            <p>
              This required balancing flexibility, structure, and scalability
              across a wide range of use cases.
            </p>
          </div>
          <PlanTradeoffsSection />
        </>
      ),
    },
    {
      id: "process",
      kicker: "How We Worked",
      tocLabel: "How We Worked",
      variant: "default",
      carouselAfter: insightHowWeWorkedCarouselSlides,
      content: (
        <div className="prose">
          <p>
            I led the design effort from early research through final prototypes.
            I worked closely with product management and engineering to align on
            requirements and feasibility.
          </p>
          <p>
            The process started with reviewing existing documents and mapping
            common patterns across them. From there, I created wireflows to
            define how forms would be authored, distributed, and completed.
          </p>
          <p>
            I designed the information architecture and built out the core
            flows for admins, coaches, and teachers. This included creating
            prototypes to validate usability and ensure the system could handle
            different use cases.
          </p>
          <p>
            Throughout the process, I collaborated with engineers to ensure the
            system could be implemented in a scalable way.
          </p>
        </div>
      ),
    },
    {
      id: "solution",
      kicker: "What We Built",
      tocLabel: "What We Built",
      variant: "alt",
      carouselAfter: insightWhatWeBuiltCarouselSlides,
      content: (
        <div className="prose">
          <p>
            Insight Capture is a centralized system for creating, managing, and
            completing forms across an organization.
          </p>
          <p>
            Admins can author custom forms using a flexible set of input
            components such as text fields, date pickers, file uploads, and
            selection controls. They can define who each form is available to,
            including school leaders, coaches, teachers, and other roles.
          </p>
          <p>
            The system includes dashboards for admins, coaches, and teachers to
            access assigned forms, view completed submissions, and manage their
            work.
          </p>
          <p>
            All data is stored in a structured format, enabling organizations to
            generate reports and track key metrics over time. The system is
            mobile friendly, allowing users to complete forms in the field on
            any device.
          </p>
          <p>
            Additionally, certain events can trigger escalation paths, ensuring
            that important signals are surfaced quickly.
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
        <>
          <ResultsMetricsDashboard />
          <ul className="key-outcomes">
            <li>Centralized data collection across the organization</li>
            <li>Reduced manual data entry and human error</li>
            <li>Faster reporting with higher confidence in the data</li>
            <li>Fewer tools and less fragmented workflows</li>
            <li>Mobile-friendly access from any device</li>
            <li>Reduced delays between data capture and insight</li>
            <li>Increased adoption due to simplicity and flexibility</li>
          </ul>
        </>
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
            This work reinforced that the real problem was not forms, it was
            fragmented systems.
          </p>
          <p>
            By focusing on structure and flexibility, we were able to create a
            solution that worked across many different use cases without needing
            constant customization.
          </p>
          <p>
            It also highlighted the importance of understanding how data flows
            through an organization. Collecting data is only valuable if it can
            be trusted, accessed, and used to make decisions.
          </p>
          <p>
            Designing for that end to end flow was what made this system
            successful.
          </p>
        </div>
      ),
    },
  ],
  footer: {
    title: "Shaun Herron",
    creditLine: "© 2026 · Shaun Herron",
  },
};
