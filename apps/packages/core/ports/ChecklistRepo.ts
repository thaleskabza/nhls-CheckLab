import type { AnswerItem, Checklist } from "../domain/checklist";
export interface ChecklistRepo {
  getActiveChecklistIdForUser(userId: string): Promise<string | null>;
  createChecklist(labId: string, userId: string): Promise<string>;
  getChecklist(id: string): Promise<Checklist | null>;
  saveAnswers(id: string, expectedVersion: number, items: AnswerItem[]): Promise<void>;
  setStatus(id: string, status: Checklist["status"]): Promise<void>;
  bumpVersion(id: string): Promise<number>;
}
