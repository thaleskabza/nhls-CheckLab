// apps/packages/infra/db/repo.postgres.ts
import { db } from "./index";
import { checklists, checklistAnswers, checklistDefinitions } from "./schema";
import type { ChecklistRepo } from "@core/ports/ChecklistRepo";
import type { Checklist, ChecklistDef } from "@core/domain/checklist";
import { eq, sql } from "drizzle-orm";

const DEFAULT_DEF: ChecklistDef = {
  title: "Waste Generator Site Inspection",
  policies: ["GPS0061", "GPS0055"],
  sections: [
    {
      code: "A",
      title: "MANAGEMENT, POLICY AND TRAINING",
      items: [
        { code: "A1", prompt: "HCWO appointed in writing? (Form 30 of GPS0055 available)" },
        { code: "A2", prompt: "HCWO trained on HCRW management (GPS0061/SOPs)?" }
      ]
    },
    {
      code: "B",
      title: "PRACTICE AND PROCEDURES IN MANAGEMENT OF HCW",
      items: [{ code: "B1", prompt: "Segregation at point of generation (observe)?" }]
    },
    {
      code: "C",
      title: "WASTE STORAGE AREAS",
      items: [{ code: "C1", prompt: "Separate storage areas for general waste?" }]
    }
  ]
};

// Drizzle `date()` columns expect a string (YYYY-MM-DD) or null
const toDateStr = (d?: string) => (d ? d.slice(0, 10) : null);

// lightweight audit helper as a free function (so calls below work)
async function audit(
  action: string,
  entityType: string,
  entityId: string,
  actorId: string,
  after: any,
  before?: any
) {
  const { auditLogs } = await import("./schema");
  await db.insert(auditLogs).values({
    actorId,
    action,
    entityType,
    entityId,
    before: before ?? null,
    after: after ?? null
  });
}

export const PostgresChecklistRepo = (): ChecklistRepo => ({
  async getActiveChecklistIdForUser(userId) {
    const rows = await db
      .select({ id: checklists.id, status: checklists.status })
      .from(checklists)
      .where(eq(checklists.createdBy, userId));

    const active = rows.find((r) => r.status === "DRAFT" || r.status === "REVIEW");
    return active?.id ?? null;
  },

  async createChecklist(labId, userId) {
    const [row] = await db
      .insert(checklists)
      .values({
        labId,
        createdBy: userId,
        status: "DRAFT",
        version: 1,
        title: DEFAULT_DEF.title
      })
      .returning({ id: checklists.id });

    await db.insert(checklistDefinitions).values({
      checklistId: row.id,
      spec: DEFAULT_DEF,
      source: "NHLS GPS0061/GPS0055"
    });

    await audit("CREATE", "Checklist", row.id, userId, { labId, title: DEFAULT_DEF.title });

    return row.id;
  },

  async getChecklist(id) {
    const [c] = await db.query.checklists.findMany({
      where: (t, { eq }) => eq(t.id, id),
      limit: 1
    });

    if (!c) return null;

    const [def] = await db
      .select()
      .from(checklistDefinitions)
      .where(eq(checklistDefinitions.checklistId, id));

    const entity: Checklist = {
      id: c.id,
      labId: c.labId,
      createdBy: c.createdBy,
      status: c.status,
      version: c.version,
      title: c.title,
      startedAt: c.startedAt?.toISOString() ?? new Date().toISOString(),
      finalizedAt: c.finalizedAt?.toISOString(),
      definition: (def?.spec as any) ?? DEFAULT_DEF
    };
    return entity;
  },

  async saveAnswers(id, expectedVersion, items) {
    const cur = await this.getChecklist(id);
    if (!cur) throw new Error("NotFound");
    if (cur.status !== "DRAFT") throw new Error("NotEditable");
    if (cur.version !== expectedVersion) throw new Error("VersionConflict");

    for (const it of items) {
      await db
        .insert(checklistAnswers)
        .values({
          checklistId: id,
          sectionCode: it.sectionCode,
          questionCode: it.questionCode,
          answer: it.answer,
          comment: it.comment ?? null,
          dueDate: toDateStr(it.dueDate) // string or null for Drizzle `date()`
        })
        .onConflictDoUpdate({
          target: [checklistAnswers.checklistId, checklistAnswers.questionCode],
          set: {
            answer: it.answer,
            comment: it.comment ?? null,
            dueDate: toDateStr(it.dueDate)
          }
        });

      await audit(
        "UPSERT",
        "ChecklistAnswer",
        `${id}:${it.questionCode}`,
        cur.createdBy,
        {
          sectionCode: it.sectionCode,
          questionCode: it.questionCode,
          answer: it.answer,
          comment: it.comment ?? null,
          dueDate: toDateStr(it.dueDate)
        }
      );
    }
  },

  async setStatus(id, status) {
    await db.update(checklists).set({ status }).where(eq(checklists.id, id));
    await audit("STATUS", "Checklist", id, "system", { status });
  },

  async bumpVersion(id) {
    const [row] = await db
      .update(checklists)
      .set({ version: sql`${checklists.version} + 1` })
      .where(eq(checklists.id, id))
      .returning({ version: checklists.version });

    return row?.version ?? 0;
  }
});
