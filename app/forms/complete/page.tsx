"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FormCompletionWorkspace } from "@/components/form-completion-workspace";

const ADMIN_DEMO_COMPLETER = "Sarah Mitchell";
const ADMIN_DEMO_ROLE = "School Leader";

function AdminCompleteFormInner() {
  const searchParams = useSearchParams();
  const initialTemplateId = searchParams.get("template");

  return (
    <FormCompletionWorkspace
      completionContext="admin"
      completerName={ADMIN_DEMO_COMPLETER}
      completerRole={ADMIN_DEMO_ROLE}
      backHref="/admin"
      backLabel="Back To Insight Capture"
      doneExitHref="/admin"
      doneExitLabel="Back To Insight Capture"
      initialTemplateId={initialTemplateId}
    />
  );
}

export default function AdminCompleteFormPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl p-8 text-sm text-muted-foreground">Loading…</div>
      }
    >
      <AdminCompleteFormInner />
    </Suspense>
  );
}
