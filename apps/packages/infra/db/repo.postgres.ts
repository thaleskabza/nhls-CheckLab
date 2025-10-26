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
const toDateStr = (d?: string): string | null => (d ? d.slice(0, 10) : null);

// Lightweight audit helper with dynamic import
async function audit(
  action: string,
  entityType: string,
  entityId: string,
  actorId: string,
  after: any,
  before: any = null
): Promise<void> {
  const { auditLogs } = await import("./schema");
  await db.insert(auditLogs).values({
    actorId,
    action,
    entityType,
    entityId,
    before,
    after
  });
}

// Validation helpers
function validateUserId(userId: string | undefined | null, context: string): asserts userId is string {
  if (!userId) {
    throw new Error(`${context}: userId is required but was ${userId}`);
  }
}

function validateLabId(labId: string | undefined | null, context: string): asserts labId is string {
  if (!labId) {
    throw new Error(`${context}: labId is required but was ${labId}`);
  }
}

export const PostgresChecklistRepo = (): ChecklistRepo => ({
  async getActiveChecklistIdForUser(userId) {
    validateUserId(userId, "getActiveChecklistIdForUser");

    const rows = await db
      .select({ id: checklists.id, status: checklists.status })
      .from(checklists)
      .where(eq(checklists.createdBy, userId));

    const active = rows.find((r) => r.status === "DRAFT" || r.status === "REVIEW");
    return active?.id ?? null;
  },

  async createChecklist(labId, userId) {
    // Validate inputs
    validateLabId(labId, "createChecklist");
    validateUserId(userId, "createChecklist");

    // Insert checklist
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

    if (!row?.id) {
      throw new Error("Failed to create checklist: no ID returned");
    }

    // Insert definition
    await db.insert(checklistDefinitions).values({
      checklistId: row.id,
      spec: DEFAULT_DEF,
      source: "NHLS GPS0061/GPS0055"
    });

    // Audit log
    await audit("CREATE", "Checklist", row.id, userId, { 
      labId, 
      title: DEFAULT_DEF.title,
      status: "DRAFT",
      version: 1
    });

    return row.id;
  },

  async getChecklist(id) {
    if (!id) {
      throw new Error("getChecklist: id is required");
    }

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
      definition: (def?.spec as ChecklistDef) ?? DEFAULT_DEF
    };
    
    return entity;
  },

  async saveAnswers(id, expectedVersion, items) {
    if (!id) {
      throw new Error("saveAnswers: id is required");
    }

    const cur = await this.getChecklist(id);
    
    if (!cur) {
      throw new Error("NotFound");
    }
    
    if (cur.status !== "DRAFT") {
      throw new Error("NotEditable");
    }
    
    if (cur.version !== expectedVersion) {
      throw new Error("VersionConflict");
    }

    // Batch process answers
    for (const it of items) {
      await db
        .insert(checklistAnswers)
        .values({
          checklistId: id,
          sectionCode: it.sectionCode,
          questionCode: it.questionCode,
          answer: it.answer,
          comment: it.comment ?? null,
          dueDate: toDateStr(it.dueDate)
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
    if (!id) {
      throw new Error("setStatus: id is required");
    }
    
    await db
      .update(checklists)
      .set({ status })
      .where(eq(checklists.id, id));
    
    await audit("STATUS", "Checklist", id, "system", { status });
  },

  async bumpVersion(id) {
    if (!id) {
      throw new Error("bumpVersion: id is required");
    }

    const [row] = await db
      .update(checklists)
      .set({ version: sql`${checklists.version} + 1` })
      .where(eq(checklists.id, id))
      .returning({ version: checklists.version });

    return row?.version ?? 0;
  }
});