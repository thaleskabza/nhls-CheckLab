// apps/packages/infra/db/schema.ts
import { pgEnum, pgTable, uuid, text, timestamp, integer, jsonb, primaryKey, date } from "drizzle-orm/pg-core";

export const checklistStatus = pgEnum("checklist_status", ["DRAFT","REVIEW","LOCKED","FINAL"]);

export const labs = pgTable("labs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull()
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  role: text("role").notNull()
});

export const checklists = pgTable("checklists", {
  id: uuid("id").primaryKey().defaultRandom(),
  labId: uuid("lab_id").notNull().references(() => labs.id),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  status: checklistStatus("status").notNull().default("DRAFT"),
  version: integer("version").notNull().default(1),
  title: text("title").notNull().default("Waste Generator Site Inspection"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finalizedAt: timestamp("finalized_at", { withTimezone: true })
});

export const checklistDefinitions = pgTable("checklist_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  checklistId: uuid("checklist_id").notNull().unique().references(() => checklists.id, { onDelete: "cascade" }),
  spec: jsonb("spec").notNull(),
  source: text("source").default("NHLS GPS0061/GPS0055")
});

export const checklistAnswers = pgTable("checklist_answers", {
  checklistId: uuid("checklist_id").notNull().references(() => checklists.id, { onDelete: "cascade" }),
  sectionCode: text("section_code").notNull(),
  questionCode: text("question_code").notNull(),
  answer: text("answer").notNull(),
  comment: text("comment"),
  dueDate: date("due_date")
}, (t) => ({
  pk: primaryKey({ columns: [t.checklistId, t.questionCode] })
}));

// Add questionBank table for lab reports
export const questionBank = pgTable("question_bank", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  prompt: text("prompt").notNull(),
  sectionCode: text("section_code").notNull(),
  riskWeight: integer("risk_weight").default(1)
});

// Add auditLogs table
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: text("actor_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});