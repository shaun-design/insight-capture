import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Study — Mapleleaf Academy",
  description: "How Mapleleaf Academy uses data capture and coaching workflows.",
};

export default function CaseStudyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Case study
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A short narrative placeholder for how your organization rolled out forms,
          coaching, and insight capture. Replace this copy with your real story,
          metrics, and quotes.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card/50 p-6 text-sm text-muted-foreground">
        <p className="m-0 leading-relaxed">
          Use this page in demos to set context before the admin or coach experiences.
          Link out to PDFs, video, or customer logos when you have them.
        </p>
      </div>
    </div>
  );
}
