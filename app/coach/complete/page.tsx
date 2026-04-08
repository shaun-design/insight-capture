"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FormCompletionWorkspace } from "@/components/form-completion-workspace";
import { COACH_DEMO_COMPLETER } from "../page";

function CoachCompleteFormInner() {
  const searchParams = useSearchParams();
  const initialTemplateId = searchParams.get("template");

  return (
    <FormCompletionWorkspace
      completionContext="coach"
      completerName={COACH_DEMO_COMPLETER}
      completerRole="Coach"
      backHref="/coach"
      backLabel="Back To Coach Demo"
      doneExitHref="/coach"
      doneExitLabel="Back To Coach Demo"
      initialTemplateId={initialTemplateId}
    />
  );
}

export default function CoachCompleteFormPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl p-8 text-sm text-muted-foreground">Loading…</div>
      }
    >
      <CoachCompleteFormInner />
    </Suspense>
  );
}
