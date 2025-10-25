import { CreateChecklistBody } from "@api/openapi/schema";
import { requireRole } from "../middleware/auth";
import { PostgresChecklistRepo } from "@infra/db/repo.postgres";

export async function POST(req: Request) {
  const auth = requireRole(req, ["OFFICER","ADMIN"]);
  if (auth instanceof Response) return auth;
  const body = CreateChecklistBody.parse(await req.json());
  const repo = PostgresChecklistRepo();
  const result = await (await import("@core/usecases/createChecklist"))
    .createChecklistUseCase(repo, { labId: body.labId, userId: auth.userId });
  return Response.json(result);
}
