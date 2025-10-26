// apps/packages/core/usecases/createChecklist.ts
import { ChecklistRepo } from "../ports/ChecklistRepo";

export async function createChecklistUseCase(
  repo: ChecklistRepo, 
  params: { labId: string; userId: string }
) {
  const active = await repo.getActiveChecklistIdForUser(params.userId, params.labId);
  
  if (active) {
    return { 
      ok: false as const, 
      reason: "ActiveChecklistExists", 
      checklistId: active 
    };
  }
  
  const id = await repo.createChecklist(params.labId, params.userId);
  
  return { 
    ok: true as const, 
    checklistId: id 
  };
}