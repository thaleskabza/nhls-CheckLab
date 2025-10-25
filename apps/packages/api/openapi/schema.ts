import { z } from "zod";
export const AnswerItem = z.object({
  sectionCode: z.enum(["A","B","C"]),
  questionCode: z.string(),
  answer: z.enum(["Y","N","NA"]),
  comment: z.string().optional(),
  dueDate: z.string().optional()
});
export const ChecklistDef = z.object({
  title: z.string(),
  policies: z.array(z.string()),
  sections: z.array(z.object({
    code: z.enum(["A","B","C"]), title: z.string(),
    items: z.array(z.object({ code: z.string(), prompt: z.string(), policy: z.string().optional() }))
  }))
});
export const CreateChecklistBody = z.object({ labId: z.string().uuid() });
export const SubmitAnswersBody = z.object({
  checklistId: z.string().uuid(),
  expectedVersion: z.number(),
  items: z.array(AnswerItem)
});
