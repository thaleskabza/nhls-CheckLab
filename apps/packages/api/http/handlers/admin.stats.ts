import { db } from "@infra/db";
import { checklists } from "@infra/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const [{ total }] = await db.execute(sql`select count(*)::int as total from ${checklists}`);
  const [{ drafts }] = await db.execute(sql`select count(*)::int as drafts from ${checklists} where status='DRAFT'`);
  const [{ finals }] = await db.execute(sql`select count(*)::int as finals from ${checklists} where status='FINAL'`);
  return Response.json({ totals: { all: total, drafts, finals } });
}
