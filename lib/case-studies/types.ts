import type { ReactNode } from "react";

export type CaseStudyOutcome = {
  title: string;
  body: string;
};

export type CaseStudySection = {
  id: string;
  kicker: string;
  /** Label in hero TOC chips and doc rail (use Title Case, e.g. "The Problem") */
  tocLabel: string;
  variant?: "default" | "alt";
  content: ReactNode;
};

export type CaseStudyTopNav = {
  brandLabel: string;
  brandHref?: string;
  authorName: string;
  authorLinkedInUrl: string;
};

export type CaseStudyContent = {
  slug: string;
  meta: {
    title: string;
    description: string;
  };
  /** When set and showTopNav is true, renders template sticky nav */
  topNav?: CaseStudyTopNav;
  hero: {
    eyebrow: string;
    title: ReactNode;
    leads: string[];
  };
  outcomes: CaseStudyOutcome[];
  sections: CaseStudySection[];
  footer: {
    title: string;
    creditLine: string;
  };
};
