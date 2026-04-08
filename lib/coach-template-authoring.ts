import type { CoachFormField, CoachFormTemplate } from "@/lib/coach-form-types";

/** Deep-clone template fields for the Insights form author; shapes align with authoring `Field`. */
export function cloneCoachTemplateFieldsForAuthoring(fields: CoachFormField[]): unknown[] {
  return JSON.parse(JSON.stringify(fields)) as unknown[];
}

export function coachTemplateToAuthoringSnapshot(template: CoachFormTemplate) {
  return {
    id: template.id,
    title: template.title,
    category: template.category,
    fields: cloneCoachTemplateFieldsForAuthoring(template.fields),
  };
}
