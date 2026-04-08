import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/components/case-study/case-study-template";
import {
  defaultCaseStudySlug,
  getCaseStudy,
} from "@/lib/case-studies/registry";

export function generateMetadata(): Metadata {
  const study = getCaseStudy(defaultCaseStudySlug);
  if (!study) {
    return { title: "Case Study" };
  }
  return {
    title: study.meta.title,
    description: study.meta.description,
  };
}

export default function HomePage() {
  const study = getCaseStudy(defaultCaseStudySlug);
  if (!study) {
    notFound();
  }
  return (
    <div className="min-h-screen w-full min-w-0 bg-[#f0f2f8]">
      <CaseStudyTemplate data={study} />
    </div>
  );
}
