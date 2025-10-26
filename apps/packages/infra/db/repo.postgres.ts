// apps/packages/infra/db/repo.postgres.ts
import { db } from "./index";
import { checklists, checklistAnswers, checklistDefinitions } from "./schema";
import type { ChecklistRepo } from "@core/ports/ChecklistRepo";
import type { Checklist, ChecklistDef } from "@core/domain/checklist";
import { eq, sql, and } from "drizzle-orm";

const DEFAULT_DEF: ChecklistDef = {
  title: "Waste Generator Site Inspection",
  policies: ["GPS0061", "GPS0055"],
  sections: [
    {
      code: "A",
      title: "MANAGEMENT, POLICY AND TRAINING",
      items: [
        { code: "A1", prompt: "Has a health care waste officer (HCWO) been appointed in writing? (A completed form 30 of GPS 0055 is available)" },
        { code: "A2", prompt: "Has the appointed HCWO been trained on health care risk waste management, GPS0061 and laboratory specific waste management SOPs? (Training records)" },
        { code: "A3", prompt: "Does the health care waste officer have access to OHASIS waste management? (HCWO to log-in)" },
        { code: "A4", prompt: "Is GPS0061 available and accessible?" },
        { code: "A5", prompt: "Are laboratory specific waste management SOPs available and accessible? (Updated copies)" },
        { code: "A6", prompt: "Have staff been trained on health care risk waste management? E.g. GPS0061, laboratory specific waste management SOPs, online health care risk waste training, etc. (Training records)" },
        { code: "A7", prompt: "Is the waste generator registered on OHASIS? (Login)" },
        { code: "A8", prompt: "Are the waste generator records up-to-date on OHASIS? (Log-in)" },
        { code: "A9", prompt: "Is the waste generator registered on the national/provincial waste information system? (Registration certificate)" },
        { code: "A10", prompt: "Are the waste generator records up-to-date on national/provincial waste information system? (Login)" },
        { code: "A11", prompt: "Are waste handlers provided and using PPE in line with a documented risk assessment? (Documented and Up-to-date Risk Assessment)" },
        { code: "A12", prompt: "Does the waste generator have an effluent disposal permit?" },
        { code: "A13", prompt: "Does the waste generator have a valid waste management plan" }
      ]
    },
    {
      code: "B",
      title: "PRACTICE AND PROCEDURES IN MANAGEMENT OF HCW",
      items: [
        { code: "B1", prompt: "Is segregation of waste taking place at point of generation? (Observe)" },
        { code: "B2", prompt: "Is health care general waste contained in black/beige/white/transparent plastic containers? (Observe)" },
        { code: "B3", prompt: "Does the waste generator have a recycling programme?" },
        { code: "B4", prompt: "Is sharps waste contained in yellow, rigid, leak-proof, puncture resistant, tamperproof, appropriately labelled and marked containers? (Observe)" },
        { code: "B5", prompt: "Do all sharps waste containers in the lab have lids? (Observe)" },
        { code: "B6", prompt: "Is infectious (non-anatomical) waste contained in impermeable, leak-proof, appropriately labelled and marked biohazard box lined with a red plastic bag? (Observe)" },
        { code: "B7", prompt: "Is infectious (anatomical) waste contained in red, rigid, impermeable, leak-proof, puncture resistant, tamper-proof, appropriately labelled and marked containers? (Observe)" },
        { code: "B8", prompt: "Are all redundant/old chemicals no longer in use disposed of at least every 3 months? (Waste manifests and destruction certificates are available)" },
        { code: "B9", prompt: "Are all chemical waste containers properly sealed and labelled? (Observe)" },
        { code: "B10", prompt: "Are supplier and product-specific Material Safety Data Sheets (MSDS) available for all chemical waste (including chemicals mixed on site) available? (MSDS file)" },
        { code: "B11", prompt: "Is a list of all expired, unused, redundant, disposed chemicals available? (List)" },
        { code: "B12", prompt: "Do all HCRW containers have dates they were first used? (Date must be clearly visible)" },
        { code: "B13", prompt: "Are all HCRW containers filled to not more than ¾ of the capacity of the container or above the full line illustrated on the container? (Observe)" },
        { code: "B14", prompt: "Are all waste containers used for their intended purpose? (Observe)" },
        { code: "B15", prompt: "Are all full HCRW containers clearly labelled in the lab before they are transported to the storage area? (Observe)" },
        { code: "B16", prompt: "Are all HCRW containers properly sealed in the lab before they are transported to the storage area? (Observe)" },
        { code: "B17", prompt: "Does the waste generator have a system in place for the management of empty cooler boxes?" },
        { code: "B18", prompt: "Is liquid waste not permitted to be disposed into the municipal sewer contained in 20L or 25L containers with tight lids or containers supplied by an approved service provider? (Observe)" },
        { code: "B19", prompt: "Does the waste generator have a system in place for the management of empty chemical bottles?" },
        { code: "B20", prompt: "Are up-to-date HCRW destruction certificates coupled with the original manifests, filed, accessible and reported on OHASIS?" },
        { code: "B21", prompt: "Does the waste generator have an appropriate trolley available for transporting waste containers to the storage area?" },
        { code: "B22", prompt: "Are laboratories using the waste tracking forms (Forms 36 and/or Form 37 of GPS 0055)?" }
      ]
    },
    {
      code: "C",
      title: "WASTE STORAGE AREAS",
      items: [
        { code: "C1", prompt: "Does the waste generator have separate waste storage areas for general waste?" },
        { code: "C2", prompt: "Does the waste generator have an area designated for the storage of HCRW? (Can be a demarcated area inside the lab if there is no separate waste room available)" },
        { code: "C3", prompt: "Is the HCRW storage area clearly marked with biohazard signage?" },
        { code: "C4", prompt: "Is the HCRW storage lockable?" },
        { code: "C5", prompt: "Is the HCRW storage area easily accessible?" },
        { code: "C6", prompt: "Are the contact details of the HCWO clearly displayed at the entrance of the storage area?" },
        { code: "C7", prompt: "Is the HCRW storage area undercover?" },
        { code: "C8", prompt: "Are pest control measures in place in the HCRW storage area?" },
        { code: "C9", prompt: "Is the HCRW storage area well ventilated?" },
        { code: "C10", prompt: "Is the HCRW storage area well illuminated?" },
        { code: "C11", prompt: "Is the HCRW storage area maintained in an orderly manner?" },
        { code: "C12", prompt: "Does the storage area have access to water?" },
        { code: "C13", prompt: "Does the storage area have a spill kit?" },
        { code: "C14", prompt: "Are waste tracking forms being used and available (Forms 36 and/or Form 37 of GPS 0055)?" }
      ]
    }
  ]
};

const toDateStr = (d?: string): string | null => (d ? d.slice(0, 10) : null);

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
  async getActiveChecklistIdForUser(userId, labId) {
    validateUserId(userId, "getActiveChecklistIdForUser");

    const conditions = [eq(checklists.createdBy, userId)];

    if (labId) {
      conditions.push(eq(checklists.labId, labId));
    }

    const rows = await db
      .select({
        id: checklists.id,
        status: checklists.status,
        labId: checklists.labId
      })
      .from(checklists)
      .where(and(...conditions));

    const active = rows.find((r) => r.status === "DRAFT" || r.status === "REVIEW");
    return active?.id ?? null;
  },

  async createChecklist(labId, userId) {
    validateLabId(labId, "createChecklist");
    validateUserId(userId, "createChecklist");

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

    await db.insert(checklistDefinitions).values({
      checklistId: row.id,
      spec: DEFAULT_DEF,
      source: "NHLS GPS0061/GPS0055"
    });

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
      with: {
        lab: true
      },
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
      labName: c.lab?.name || "Unknown Lab",
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

    for (const it of items) {
      try {
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
      } catch (dbError: any) {
        console.error(`Error saving answer ${it.questionCode}:`, dbError);
        throw new Error(`Failed to save answer ${it.questionCode}: ${dbError.message}`);
      }
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