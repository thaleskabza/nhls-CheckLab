//apps/packages/api/http/handlers/reports.exec.ts
import { db } from "@infra/db";
import { checklists, checklistAnswers } from "@infra/db/schema";
import { and, gte, lte } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = url.searchParams.get("from"); // YYYY-MM-DD
  const to   = url.searchParams.get("to");   // YYYY-MM-DD

  const where: any[] = [];
  if (from) where.push(gte(checklists.startedAt, new Date(from)));
  if (to)   where.push(lte(checklists.startedAt, new Date(to+"T23:59:59Z")));

  const cl = await db.query.checklists.findMany({ where: (t,{and:AND}) => where.length ? AND(...where) : undefined });
  const ids = cl.map(c => c.id);
  if (ids.length === 0) return Response.json({ totalChecklists: 0, compliance: { A:0,B:0,C:0 } });

  const ans = await db.select().from(checklistAnswers).where((qb) => qb.in(checklistAnswers.checklistId, ids as any));
  const tot = { A:{y:0,wsum:0,wy:0}, B:{y:0,wsum:0,wy:0}, C:{y:0,wsum:0,wy:0} } as any;
  for (const r of ans as any[]) {
    const s = tot[r.sectionCode]; s.wsum += 1; if (r.answer==="Y") s.wy += 1;
  }
  const pct = (x:number,t:number)=> t? Math.round(1000*x/t)/10 : 0;

  return Response.json({
    totalChecklists: ids.length,
    compliance: {
      A: pct(tot.A.wy, tot.A.wsum),
      B: pct(tot.B.wy, tot.B.wsum),
      C: pct(tot.C.wy, tot.C.wsum)
    }
  });
}
