import { SubmitAnswersBody } from "@api/openapi/schema";
import { requireRole } from "../middleware/auth";
import { PostgresChecklistRepo } from "@infra/db/repo.postgres";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ["OFFICER","ADMIN"]);
  if (auth instanceof Response) return auth;
  const body = SubmitAnswersBody.parse(await req.json());
  if (body.checklistId !== params.id) return new Response(JSON.stringify({ error: "IdMismatch" }), { status: 400 });
  const repo = PostgresChecklistRepo();
  try {
    const result = await (await import("@core/usecases/submitSection"))
      .submitSectionUseCase(repo, { checklistId: body.checklistId, expectedVersion: body.expectedVersion, items: body.items });
    return Response.json(result);
  } catch (e: any) {
    if (String(e.message) === "VersionConflict") return new Response(JSON.stringify({ error: "VersionConflict" }), { status: 409 });
    if (String(e.message) === "NotEditable") return new Response(JSON.stringify({ error: "NotEditable" }), { status: 400 });
    throw e;
  }
}
