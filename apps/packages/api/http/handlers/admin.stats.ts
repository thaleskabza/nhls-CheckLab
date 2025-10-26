// apps/packages/api/http/handlers/admin.stats.ts
import { db } from "@infra/db";
import { checklists } from "@infra/db/schema";
import { sql, count, eq } from "drizzle-orm";

export async function GET() {
  // Option 1: Use Drizzle query builder (recommended)
  const [totalResult] = await db
    .select({ total: count() })
    .from(checklists);
  
  const [draftsResult] = await db
    .select({ drafts: count() })
    .from(checklists)
    .where(eq(checklists.status, "DRAFT"));
  
  const [finalsResult] = await db
    .select({ finals: count() })
    .from(checklists)
    .where(eq(checklists.status, "FINAL"));

  return Response.json({ 
    totals: { 
      all: totalResult.total, 
      drafts: draftsResult.drafts, 
      finals: finalsResult.finals 
    } 
  });
}