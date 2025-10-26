// apps/packages/core/domain/checklist.ts
export type ChecklistStatus = "DRAFT" | "REVIEW" | "LOCKED" | "FINAL";

export interface ChecklistItem {
  code: string;
  prompt: string;
}

export interface ChecklistSection {
  code: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistDef {
  title: string;
  policies: string[];
  sections: ChecklistSection[];
}

export interface Checklist {
  id: string;
  labId: string;
  labName?: string;  
  createdBy: string;
  status: ChecklistStatus;
  version: number;
  title: string;
  startedAt: string;
  finalizedAt?: string;
  definition: ChecklistDef;
}

export interface AnswerItem {
  sectionCode: string;
  questionCode: string;
  answer: "Y" | "N" | "NA";
  comment?: string;
  dueDate?: string;
}