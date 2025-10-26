import { PostgresChecklistRepo } from "@infra/db/repo.postgres";
import { db } from "@infra/db";
import { blobs } from "@infra/db/schema";
import Busboy from "busboy";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bb = Busboy({ headers: Object.fromEntries(req.headers) });
  const chunks: Buffer[] = [];
  let filename = "evidence.bin"; let mime = "application/octet-stream";
  const done = new Promise<void>((resolve, reject) => {
    bb.on("file", (_name, file, info) => {
      filename = info.filename; mime = info.mimeType;
      file.on("data", (d: Buffer) => chunks.push(d));
      file.on("end", () => {});
    });
    bb.on("finish", resolve);
    bb.on("error", reject);
  });
  req.body?.pipe(bb);
  await done;

  const buf = Buffer.concat(chunks);
  await db.insert(blobs).values({
    checklistId: id, filename, mime, bytes: buf
  });

  return Response.json({ ok: true, size: buf.length });
}
