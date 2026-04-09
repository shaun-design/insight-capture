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
  /** Renders a ProtoCarousel after the section body (same pattern as overview carousel). */
  carouselAfter?: CarouselSlide[];
};

export type CaseStudyTopNav = {
  brandLabel: string;
  brandHref?: string;
  authorName: string;
  authorLinkedInUrl: string;
};

export type CarouselSlide = {
  image: string;
  alt: string;
  title: string;
  description: string;
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
  /** Slides rendered in a carousel between the hero and the first section. */
  overviewCarousel?: CarouselSlide[];
  sections: CaseStudySection[];
  footer: {
    title: string;
    creditLine: string;
  };
};
