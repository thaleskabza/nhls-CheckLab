import { ChecklistRepo } from "../ports/ChecklistRepo";
import type { AnswerItem } from "../domain/checklist";
export async function submitSectionUseCase(repo: ChecklistRepo, params: { checklistId: string; expectedVersion: number; items: AnswerItem[] }) {
  await repo.saveAnswers(params.checklistId, params.expectedVersion, params.items);
  const version = await repo.bumpVersion(params.checklistId);
  return { ok: true as const, version };
}
