import type { CoachFormTemplate } from "@/lib/coach-form-types";

/** Stable id shared by admin Insights table row and coach completion template */
export const INSTRUCTIONAL_WALKTHROUGH_FORM_ID = "iw-climate-pedagogy-maple-2026";

/** Unique product name for this K–12 instructional observation instrument */
export const INSTRUCTIONAL_WALKTHROUGH_FORM_NAME =
  "Climate & Pedagogy Walk — K–12 Instructional Observation";

/** Shorter label for tight tables (Insights list, etc.); full title stays on the template */
export const INSTRUCTIONAL_WALKTHROUGH_FORM_LIST_LABEL = "Climate & Pedagogy Walk";

export const instructionalWalkthroughTemplate: CoachFormTemplate = {
  id: INSTRUCTIONAL_WALKTHROUGH_FORM_ID,
  title: INSTRUCTIONAL_WALKTHROUGH_FORM_NAME,
  category: "Coaching",
  fields: [
    {
      id: "iw-intro",
      type: "text-editor",
      label: "Overview",
      textEditorSettings: {
        content: `<p><strong>Purpose.</strong> Document what you see during a brief classroom visit: how the space supports learning, how instruction unfolds, and how students engage. This instrument supports coaching and continuous improvement—not formal evaluation—unless your district designates otherwise.</p><p><strong>Use today’s visit date and time</strong> in the header when you begin; match the lesson segment you observed.</p>`,
      },
    },
    {
      id: "iw-content-grade",
      type: "text-field",
      label: "Context",
      textFieldSettings: {
        prompt: "Content area and grade span (e.g. Grade 7 Mathematics)",
        required: true,
      },
    },
    {
      id: "iw-room",
      type: "text-field",
      label: "Location",
      textFieldSettings: {
        prompt: "Room or learning space",
        required: false,
      },
    },
    {
      id: "iw-visit-date",
      type: "date",
      label: "Observation date",
      dateSettings: {
        prompt: "Date of this classroom visit",
        required: true,
        commentsEnabled: false,
      },
    },
    {
      id: "iw-period",
      type: "dropdown",
      label: "Schedule",
      selectSettings: {
        prompt: "Period or block (if applicable)",
        options: [
          { id: "p1", text: "Period 1 / Block A", value: "p1" },
          { id: "p2", text: "Period 2 / Block B", value: "p2" },
          { id: "p3", text: "Period 3 / Block C", value: "p3" },
          { id: "p4", text: "Period 4 / Block D", value: "p4" },
          { id: "adv", text: "Advisory / Homeroom", value: "adv" },
          { id: "int", text: "Intervention / WIN block", value: "int" },
          { id: "oth", text: "Other / rotating schedule", value: "oth" },
        ],
        required: false,
        commentsEnabled: false,
      },
    },
    {
      id: "iw-environment",
      type: "text-area",
      label: "Environment",
      textAreaSettings: {
        prompt:
          "Physical environment and classroom climate (layout, displays, accessibility, noise, routines, sense of belonging)",
        required: true,
      },
    },
    {
      id: "iw-objectives",
      type: "radio",
      label: "Learning goals",
      radioSettings: {
        prompt: "Were learning objectives or success criteria evident to students during the segment you watched?",
        options: [
          { id: "obj1", text: "Clearly communicated and referenced", value: "clear" },
          { id: "obj2", text: "Partially evident", value: "partial" },
          { id: "obj3", text: "Not observed in this segment", value: "not_observed" },
        ],
        displayOrientation: "Vertical",
        required: true,
        commentsEnabled: true,
      },
    },
    {
      id: "iw-moves",
      type: "checkbox-set",
      label: "Instruction",
      checkboxSettings: {
        prompt: "Instructional practices observed (select all that apply)",
        options: [
          { id: "m1", text: "Explicit modeling or demonstration", value: "modeling" },
          { id: "m2", text: "Guided practice with feedback", value: "guided" },
          { id: "m3", text: "Checks for understanding (oral, written, or digital)", value: "cfu" },
          { id: "m4", text: "Student discourse or collaboration tied to the learning goal", value: "discourse" },
          { id: "m5", text: "Differentiated support or scaffolding", value: "diff" },
          { id: "m6", text: "Purposeful use of instructional time", value: "time" },
          { id: "m7", text: "Academic language and vocabulary development", value: "vocab" },
          { id: "m8", text: "Use of formative data or student work samples", value: "data" },
        ],
        displayOrientation: "Vertical",
        required: false,
        commentsEnabled: true,
      },
    },
    {
      id: "iw-engagement",
      type: "radio",
      label: "Engagement",
      radioSettings: {
        prompt: "Overall student engagement with the learning task during your visit",
        options: [
          { id: "e1", text: "Consistently high — most students on task", value: "high" },
          { id: "e2", text: "Mixed — some strong, some disengaged", value: "mixed" },
          { id: "e3", text: "Low — frequent off-task behavior", value: "low" },
          { id: "e4", text: "Not applicable (e.g. transitions only)", value: "na" },
        ],
        displayOrientation: "Vertical",
        required: true,
        commentsEnabled: false,
      },
    },
    {
      id: "iw-strengths",
      type: "text-area",
      label: "Strengths",
      textAreaSettings: {
        prompt: "Instructional strengths with specific, observable evidence",
        required: true,
      },
    },
    {
      id: "iw-next",
      type: "text-area",
      label: "Coaching",
      textAreaSettings: {
        prompt: "Recommended next step, reflection question, or focus for a follow-up conversation",
        required: false,
      },
    },
    {
      id: "iw-followup",
      type: "radio",
      label: "Follow-up",
      radioSettings: {
        prompt: "Schedule another classroom visit with this educator?",
        options: [
          { id: "f1", text: "Yes — propose a date in coaching notes", value: "yes" },
          { id: "f2", text: "No — closure for this cycle", value: "no" },
          { id: "f3", text: "Discuss in next coaching meeting", value: "discuss" },
        ],
        displayOrientation: "Vertical",
        required: true,
        commentsEnabled: false,
      },
    },
    {
      id: "iw-duration",
      type: "duration",
      label: "Visit length",
      durationSettings: {
        prompt: "Approximate length of this observation (optional)",
        required: false,
        commentsEnabled: false,
      },
    },
  ],
};
