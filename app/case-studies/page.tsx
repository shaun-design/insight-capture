import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies, caseStudySlugs } from "@/lib/case-studies/registry";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Portfolio case studies using the shared template.",
};

export default function CaseStudiesIndexPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-10 md:px-8 lg:px-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Case studies
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Each entry is a content module plus the shared layout. Add a new file
          under{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            content/case-studies/
          </code>{" "}
          and register the slug in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            lib/case-studies/registry.ts
          </code>
          .
        </p>
      </div>
      <ul className="list-none space-y-2 p-0">
        {caseStudySlugs.map((slug) => {
          const s = caseStudies[slug];
          return (
            <li key={slug}>
              <Link
                href={`/case-studies/${slug}`}
                className="block rounded-lg border border-border bg-card/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
              >
                {s.meta.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
