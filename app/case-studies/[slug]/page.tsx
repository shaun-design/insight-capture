import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/components/case-study/case-study-template";
import { caseStudySlugs, getCaseStudy } from "@/lib/case-studies/registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) {
    return { title: "Case study" };
  }
  return {
    title: study.meta.title,
    description: study.meta.description,
  };
}

export default async function CaseStudySlugPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) {
    notFound();
  }

  return <CaseStudyTemplate data={study} />;
}
