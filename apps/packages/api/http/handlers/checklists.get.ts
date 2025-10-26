//apps/packages/api/http/handlers/checklists.get.ts
import { PostgresChecklistRepo } from "@infra/db/repo.postgres";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params; // 👈 await the params
  const repo = PostgresChecklistRepo();
  const c = await repo.getChecklist(id);
  if (!c) return new Response("Not found", { status: 404 });
  return Response.json(c);
}
