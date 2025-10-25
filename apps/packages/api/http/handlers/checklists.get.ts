import { PostgresChecklistRepo } from "@infra/db/repo.postgres";
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const repo = PostgresChecklistRepo();
  const c = await repo.getChecklist(params.id);
  if (!c) return new Response("Not found", { status: 404 });
  return Response.json(c);
}
