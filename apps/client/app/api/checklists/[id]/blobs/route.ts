// apps/client/app/api/checklists/[id]/blobs/route.ts
import { db } from "@infra/db";
import { blobs } from "@infra/db/schema";
import Busboy from "busboy";
import { Readable } from "stream";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Convert Web ReadableStream to Node.js Readable stream
  const nodeStream = Readable.from(req.body as any);
  
  const bb = Busboy({ headers: Object.fromEntries(req.headers) });
  const chunks: Buffer[] = [];
  let filename = "evidence.bin";
  let mime = "application/octet-stream";
  
  const done = new Promise<void>((resolve, reject) => {
    bb.on("file", (_name, file, info) => {
      filename = info.filename;
      mime = info.mimeType;
      file.on("data", (d: Buffer) => chunks.push(d));
      file.on("end", () => {});
    });
    bb.on("finish", resolve);
    bb.on("error", reject);
  });
  
  // Pipe the Node.js stream to Busboy
  nodeStream.pipe(bb);
  await done;

  const buf = Buffer.concat(chunks);
  
  await db.insert(blobs).values({
    checklistId: id,
    filename,
    mime,
    bytes: buf.toString('base64') // Store as base64 if using text field
  });

  return Response.json({ ok: true, size: buf.length });
}