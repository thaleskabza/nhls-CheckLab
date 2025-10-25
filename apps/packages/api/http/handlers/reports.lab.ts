import { db } from "@infra/db";
import { checklists, checklistAnswers, questionBank } from "@infra/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(_req: Request, ctx: { params: Promise<{ labId: string }> }) {
  const { labId } = await ctx.params;

  // latest checklist per lab (simple: highest startedAt)
  const [c] = await db.query.checklists.findMany({
    where: (t,{eq}) => eq(t.labId, labId),
    orderBy: (t,{desc}) => [desc(t.startedAt)],
    limit: 1
  });
  if (!c) return new Response(JSON.stringify({ error: "NoChecklist" }), { status: 404 });

  const rows = await db.select().from(checklistAnswers)
    .where(eq(checklistAnswers.checklistId, c.id));

  const qweights: Record<string, number> = {};
  const qb = await db.select().from(questionBank);
  for (const q of qb) qweights[q.code] = q.riskWeight ?? 1;

  const sec = { A: { y:0,n:0,na:0, wy:0, wn:0, wsum:0 }, B:{...{y:0,n:0,na:0,wy:0,wn:0,wsum:0}}, C:{...{y:0,n:0,na:0,wy:0,wn:0,wsum:0}} } as any;

  for (const r of rows as any[]) {
    const w = qweights[r.questionCode] ?? 1;
    const s = sec[r.sectionCode]; s.wsum += w;
    if (r.answer === "Y") { s.y++; s.wy += w; }
    else if (r.answer === "N") { s.n++; s.wn += w; }
    else s.na++;
  }

  function pct(x:number, total:number){ return total>0 ? Math.round(1000*x/total)/10 : 0 }
  const summary = (sc:any)=>({
    count: { Y: sc.y, N: sc.n, NA: sc.na },
    weightedCompliancePct: pct(sc.wy, sc.wsum),
    weightedNonCompliancePct: pct(sc.wn, sc.wsum)
  });

  return Response.json({
    labId, checklistId: c.id,
    sections: { A: summary(sec.A), B: summary(sec.B), C: summary(sec.C) }
  });
}
