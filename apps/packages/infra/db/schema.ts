// apps/packages/infra/db/schema.ts
import { 
  pgEnum, 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  integer, 
  jsonb, 
  primaryKey, 
  date,
  
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const checklistStatus = pgEnum("checklist_status", ["DRAFT", "REVIEW", "LOCKED", "FINAL"]);

// Tables
export const labs = pgTable("labs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: text("role").notNull().default("OFFICER"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const checklists = pgTable("checklists", {
  id: uuid("id").primaryKey().defaultRandom(),
  labId: uuid("lab_id").notNull().references(() => labs.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: checklistStatus("status").notNull().default("DRAFT"),
  version: integer("version").notNull().default(1),
  title: text("title").notNull().default("Waste Generator Site Inspection"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finalizedAt: timestamp("finalized_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const checklistDefinitions = pgTable("checklist_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  checklistId: uuid("checklist_id").notNull().unique().references(() => checklists.id, { onDelete: "cascade" }),
  spec: jsonb("spec").notNull(),
  source: text("source").default("NHLS GPS0061/GPS0055"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const checklistAnswers = pgTable("checklist_answers", {
  checklistId: uuid("checklist_id").notNull().references(() => checklists.id, { onDelete: "cascade" }),
  sectionCode: text("section_code").notNull(),
  questionCode: text("question_code").notNull(),
  answer: text("answer").notNull(),
  comment: text("comment"),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => ({
  pk: primaryKey({ columns: [t.checklistId, t.questionCode] })
}));

export const questionBank = pgTable("question_bank", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  prompt: text("prompt").notNull(),
  sectionCode: text("section_code").notNull(),
  riskWeight: integer("risk_weight").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

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

// Relations
export const labsRelations = relations(labs, ({ many }) => ({
  checklists: many(checklists)
}));

// Add this table definition with your other tables
export const blobs = pgTable("blobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  checklistId: uuid("checklist_id").notNull().references(() => checklists.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  mime: text("mime").notNull(),
  bytes: text("bytes").notNull(), // or use a bytea type if available
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// Add this relation with your other relations
export const blobsRelations = relations(blobs, ({ one }) => ({
  checklist: one(checklists, {
    fields: [blobs.checklistId],
    references: [checklists.id]
  })
}));

// Add these type exports with your other type exports
export type Blob = typeof blobs.$inferSelect;
export type NewBlob = typeof blobs.$inferInsert;
export const usersRelations = relations(users, ({ many }) => ({
  checklists: many(checklists)
}));

export const checklistsRelations = relations(checklists, ({ one, many }) => ({
  lab: one(labs, {
    fields: [checklists.labId],
    references: [labs.id]
  }),
  createdByUser: one(users, {
    fields: [checklists.createdBy],
    references: [users.id]
  }),
  definition: one(checklistDefinitions),
  answers: many(checklistAnswers)
}));

export const checklistDefinitionsRelations = relations(checklistDefinitions, ({ one }) => ({
  checklist: one(checklists, {
    fields: [checklistDefinitions.checklistId],
    references: [checklists.id]
  })
}));

export const checklistAnswersRelations = relations(checklistAnswers, ({ one }) => ({
  checklist: one(checklists, {
    fields: [checklistAnswers.checklistId],
    references: [checklists.id]
  })
}));

// Type exports for use in application code
export type Lab = typeof labs.$inferSelect;
export type User = typeof users.$inferSelect;
export type Checklist = typeof checklists.$inferSelect;
export type ChecklistDefinition = typeof checklistDefinitions.$inferSelect;
export type ChecklistAnswer = typeof checklistAnswers.$inferSelect;
export type QuestionBankItem = typeof questionBank.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

export type NewLab = typeof labs.$inferInsert;
export type NewUser = typeof users.$inferInsert;
export type NewChecklist = typeof checklists.$inferInsert;
export type NewChecklistDefinition = typeof checklistDefinitions.$inferInsert;
export type NewChecklistAnswer = typeof checklistAnswers.$inferInsert;
export type NewQuestionBankItem = typeof questionBank.$inferInsert;
export type NewAuditLog = typeof auditLogs.$inferInsert;