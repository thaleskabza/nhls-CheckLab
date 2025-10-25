export type ChecklistStatus = "DRAFT"|"REVIEW"|"LOCKED"|"FINAL";
export interface QuestionDef { code: string; prompt: string; policy?: string; }
export interface SectionDef { code: "A"|"B"|"C"; title: string; items: QuestionDef[]; }
export interface ChecklistDef { title: string; policies: string[]; sections: SectionDef[]; }
export interface AnswerItem { questionCode: string; sectionCode: "A"|"B"|"C"; answer: "Y"|"N"|"NA"; comment?: string; dueDate?: string; }
export interface Checklist {
  id: string; labId: string; createdBy: string; status: ChecklistStatus; version: number; title: string;
  startedAt: string; finalizedAt?: string; definition: ChecklistDef;
}
