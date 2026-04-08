import type { CaseStudyContent } from "@/lib/case-studies/types";

export const insightCapture: CaseStudyContent = {
  slug: "insight-capture",
  meta: {
    title: "Case Study — Insight Capture",
    description:
      "A flexible system for digitizing school data collection, enabling faster reporting, reduced manual work, and more reliable insights.",
  },
  hero: {
    eyebrow: "CASE STUDY · DATA PLATFORM",
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
        <div className="prose">
          <p>
            I worked closely with large school organizations that were actively
            paying for development hours to digitize their forms. Instead of
            continuing to build one off solutions, I took a step back to
            understand their broader needs.
          </p>
          <p>
            I reviewed a wide range of existing materials including Google Docs,
            spreadsheets, PDFs, and printed documents. I also spoke directly
            with school leaders and coaches to understand what they were trying
            to measure and why.
          </p>
          <p>
            Primary users included school leaders and coaches who needed to
            collect and report on data. Teachers also contributed by submitting
            forms and participating in observations.
          </p>
          <p>
            Through this research, it became clear that the problem was not
            just digitizing forms. It was creating a system that could
            standardize data, reduce manual work, and support reporting across
            the organization.
          </p>
        </div>
      ),
    },
    {
      id: "strategy",
      kicker: "Plan And Tradeoffs",
      tocLabel: "Plans & Tradeoffs",
      variant: "alt",
      content: (
        <div className="prose">
          <p>
            Instead of building individual forms for each customer, I proposed a
            flexible system that would allow organizations to create and manage
            their own forms.
          </p>
          <p>
            The core idea was to centralize data collection while giving admins
            full control over how forms were structured and used. This required
            balancing flexibility with usability. The system needed to support a
            wide range of form types without becoming overly complex.
          </p>
          <p>
            We focused on creating a structured authoring experience using
            familiar input types such as text fields, date pickers, file
            uploads, radio groups, and checkboxes. At the same time, we ensured
            that all data would be stored in a consistent format to support
            reporting.
          </p>
          <p>
            This approach allowed organizations to adapt the system to their
            needs without requiring ongoing development work.
          </p>
        </div>
      ),
    },
    {
      id: "process",
      kicker: "How We Worked",
      tocLabel: "How We Worked",
      variant: "default",
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
        <div className="prose">
          <ul>
            <li>Centralized data collection across the organization</li>
            <li>Reduced manual data entry and human error</li>
            <li>Faster reporting with higher confidence in the data</li>
            <li>Fewer tools and less fragmented workflows</li>
            <li>Mobile friendly access from any device</li>
            <li>Reduced delays between data capture and insight</li>
            <li>Increased adoption due to simplicity and flexibility</li>
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
