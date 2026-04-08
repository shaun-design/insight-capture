export interface CoachFormField {
  id: string;
  type: string;
  label: string;
  radioSettings?: {
    prompt: string;
    options: Array<{ id: string; text: string; value: string }>;
    displayOrientation: "Vertical" | "Horizontal";
    required: boolean;
    commentsEnabled: boolean;
  };
  checkboxSettings?: {
    prompt: string;
    options: Array<{ id: string; text: string; value: string }>;
    displayOrientation: "Vertical" | "Horizontal";
    required: boolean;
    commentsEnabled: boolean;
  };
  selectSettings?: {
    prompt: string;
    options: Array<{ id: string; text: string; value: string }>;
    required: boolean;
    commentsEnabled: boolean;
  };
  dateSettings?: {
    prompt: string;
    required: boolean;
    commentsEnabled: boolean;
  };
  textFieldSettings?: {
    prompt: string;
    required: boolean;
  };
  textAreaSettings?: {
    prompt: string;
    required: boolean;
  };
  numericSettings?: {
    prompt: string;
    required: boolean;
    commentsEnabled: boolean;
  };
  durationSettings?: {
    prompt: string;
    required: boolean;
    commentsEnabled: boolean;
  };
  textEditorSettings?: {
    content: string;
  };
}

export interface CoachFormTemplate {
  id: string;
  title: string;
  category: string;
  fields: CoachFormField[];
}
