CREATE TYPE "public"."checklist_status" AS ENUM('DRAFT', 'REVIEW', 'LOCKED', 'FINAL');--> statement-breakpoint
CREATE TABLE "checklist_answers" (
	"checklist_id" uuid NOT NULL,
	"section_code" text NOT NULL,
	"question_code" text NOT NULL,
	"answer" text NOT NULL,
	"comment" text,
	"due_date" date,
	CONSTRAINT "checklist_answers_checklist_id_question_code_pk" PRIMARY KEY("checklist_id","question_code")
);
--> statement-breakpoint
CREATE TABLE "checklist_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checklist_id" uuid NOT NULL,
	"spec" jsonb NOT NULL,
	"source" text DEFAULT 'NHLS GPS0061/GPS0055',
	CONSTRAINT "checklist_definitions_checklist_id_unique" UNIQUE("checklist_id")
);
--> statement-breakpoint
CREATE TABLE "checklists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lab_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"status" "checklist_status" DEFAULT 'DRAFT' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"title" text DEFAULT 'Waste Generator Site Inspection' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finalized_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "labs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "checklist_answers" ADD CONSTRAINT "checklist_answers_checklist_id_checklists_id_fk" FOREIGN KEY ("checklist_id") REFERENCES "public"."checklists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checklist_definitions" ADD CONSTRAINT "checklist_definitions_checklist_id_checklists_id_fk" FOREIGN KEY ("checklist_id") REFERENCES "public"."checklists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_lab_id_labs_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."labs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;