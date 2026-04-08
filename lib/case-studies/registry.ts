import { insightCapture } from "@/content/case-studies/insight-capture";
import { mapleleafAcademy } from "@/content/case-studies/mapleleaf-academy";
import type { CaseStudyContent } from "./types";

export const caseStudies = {
  "insight-capture": insightCapture,
  "mapleleaf-academy": mapleleafAcademy,
} as const satisfies Record<string, CaseStudyContent>;

export type CaseStudySlug = keyof typeof caseStudies;

export const caseStudySlugs = Object.keys(caseStudies) as CaseStudySlug[];

export function getCaseStudy(slug: string): CaseStudyContent | null {
  if (slug in caseStudies) {
    return caseStudies[slug as CaseStudySlug];
  }
  return null;
}

/** Default slug for /case-study redirect and top nav “Case Study” link */
export const defaultCaseStudySlug: CaseStudySlug = "insight-capture";
