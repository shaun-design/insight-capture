import {
  instructionalWalkthroughTemplate,
  INSTRUCTIONAL_WALKTHROUGH_FORM_ID,
} from "@/lib/instructional-walkthrough-instrument";
import type { CoachFormTemplate } from "@/lib/coach-form-types";

/** Mock forms available to coaches in the demo (not tied to admin draft). */

export type { CoachFormField, CoachFormTemplate } from "@/lib/coach-form-types";

/** Slug ids so the select shows the person/group label, not a numeric value. */
export const COMPLETION_ABOUT_OPTIONS = [
  { id: "student-maya-johnson", label: "Maya Johnson — Grade 5" },
  { id: "student-carlos-rivera", label: "Carlos Rivera — Grade 3" },
  { id: "student-emma-chen", label: "Emma Chen — Grade 4" },
  { id: "student-james-williams", label: "James Williams — Grade 5" },
  { id: "student-sofia-patel", label: "Sofia Patel — Grade 2" },
  { id: "student-liam-thompson", label: "Liam Thompson — Grade 3" },
  { id: "group-math-period-2", label: "3rd Grade Math — Period 2 (group)" },
  { id: "group-reading-block-a", label: "5th Grade Reading — Block A (group)" },
] as const;

/** Observed educator roster for the Climate & Pedagogy walk (replaces the former in-form “Teacher observed” field). */
export const COMPLETION_EDUCATOR_ABOUT_OPTIONS = [
  { id: "obs-sarah-mitchell", label: "Sarah Mitchell — Grade 5 ELA" },
  { id: "obs-james-carter", label: "James Carter — Grade 7 Mathematics" },
  { id: "obs-maria-gonzalez", label: "Maria Gonzalez — Grade 3 Science" },
  { id: "obs-jordan-lee", label: "Jordan Lee — Instructional lead, literacy" },
  { id: "obs-priya-nandakumar", label: "Priya Nandakumar — Grade 4" },
  { id: "obs-alex-ortiz", label: "Alex Ortiz — Special education, resource" },
] as const;

export type CompletionAboutOption = { id: string; label: string };

export function completionAboutOptionsForTemplate(templateId: string): readonly CompletionAboutOption[] {
  if (templateId === INSTRUCTIONAL_WALKTHROUGH_FORM_ID) return COMPLETION_EDUCATOR_ABOUT_OPTIONS;
  return COMPLETION_ABOUT_OPTIONS;
}

export function completionAboutSelectLabels(templateId: string): { heading: string; placeholder: string } {
  const isWalkthrough = templateId === INSTRUCTIONAL_WALKTHROUGH_FORM_ID;
  return {
    heading: isWalkthrough ? "Educator observed" : "Who is this for?",
    placeholder: isWalkthrough
      ? "Select the teacher or instructional lead…"
      : "Select a student or group…",
  };
}

/** @deprecated Use COMPLETION_ABOUT_OPTIONS */
export const COACH_ABOUT_OPTIONS = COMPLETION_ABOUT_OPTIONS;

export const COACH_FORM_TEMPLATES: CoachFormTemplate[] = [
  instructionalWalkthroughTemplate,
  {
    id: "classroom-observation",
    title: "Classroom Observation Form",
    category: "Instruction & Teaching",
    fields: [
      {
        id: "obs-intro",
        type: "text-editor",
        label: "Instructions",
        textEditorSettings: {
          content:
            "<p>This observation documents strengths and growth areas during instruction. Answer each prompt based on what you saw during the visit.</p>",
        },
      },
      {
        id: "obs-focus",
        type: "text-field",
        label: "Focus",
        textFieldSettings: { prompt: "What instructional focus did you observe?", required: true },
      },
      {
        id: "obs-rating",
        type: "radio",
        label: "Overall",
        radioSettings: {
          prompt: "How would you rate the lesson segment you observed?",
          options: [
            { id: "a", text: "Strong — Clear objectives and engagement", value: "strong" },
            { id: "b", text: "Developing — Some gaps in pacing or checks", value: "developing" },
            { id: "c", text: "Needs follow-up — Significant support recommended", value: "followup" },
          ],
          displayOrientation: "Vertical",
          required: true,
          commentsEnabled: true,
        },
      },
      {
        id: "obs-notes",
        type: "text-area",
        label: "Notes",
        textAreaSettings: { prompt: "Narrative notes and evidence (optional detail)", required: false },
      },
    ],
  },
  {
    id: "coaching-check-in",
    title: "Coaching Check-In",
    category: "Coaching",
    fields: [
      {
        id: "chk-headline",
        type: "text-editor",
        label: "Welcome",
        textEditorSettings: {
          content: "<p>Quick check-in after your coaching conversation or walkthrough.</p>",
        },
      },
      {
        id: "chk-mood",
        type: "dropdown",
        label: "Mood",
        selectSettings: {
          prompt: "How would you describe the educator’s readiness today?",
          options: [
            { id: "m1", text: "Energized and open", value: "energized" },
            { id: "m2", text: "Steady / neutral", value: "steady" },
            { id: "m3", text: "Stressed or overloaded", value: "stressed" },
          ],
          required: true,
          commentsEnabled: false,
        },
      },
      {
        id: "chk-followup",
        type: "date",
        label: "Follow-up",
        dateSettings: {
          prompt: "Preferred date for next touchpoint (optional)",
          required: false,
          commentsEnabled: false,
        },
      },
    ],
  },
  {
    id: "behavior-incident",
    title: "Student Behavior Log",
    category: "Student Behavior",
    fields: [
      {
        id: "beh-context",
        type: "text-field",
        label: "Context",
        textFieldSettings: { prompt: "Brief description of what happened", required: true },
      },
      {
        id: "beh-actions",
        type: "checkbox-set",
        label: "Responses",
        checkboxSettings: {
          prompt: "Which responses were used? (select all that apply)",
          options: [
            { id: "b1", text: "Private conversation with student", value: "private" },
            { id: "b2", text: "Family notified", value: "family" },
            { id: "b3", text: "Administrator involved", value: "admin" },
          ],
          displayOrientation: "Vertical",
          required: false,
          commentsEnabled: true,
        },
      },
    ],
  },
];

export function formCompletionStorageKey(
  context: "coach" | "admin",
  templateId: string,
  aboutId: string
) {
  return `form-completion:${context}:${templateId}:${aboutId}`;
}
