//apps/packages/api/http/handlers/checklists.pdf.ts
import PDFDocument from "pdfkit";
import { PostgresChecklistRepo } from "@infra/db/repo.postgres";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const repo = PostgresChecklistRepo();
  const c = await repo.getChecklist(id);
  if (!c) return new Response("Not found", { status: 404 });

  const doc = new PDFDocument();
  const chunks: Buffer[] = [];
  doc.on("data", (d) => chunks.push(d));
  const ready = new Promise<Buffer>((r)=>doc.on("end", ()=>r(Buffer.concat(chunks))));

  doc.fontSize(14).text("NHLS – Waste Generator Site Inspection", { underline: true });
  doc.moveDown().fontSize(10).text(`Checklist: ${c.id}`);
  doc.text(`Lab: ${c.labId}`);
  doc.text(`Status: ${c.status}  ·  Version: ${c.version}`);
  doc.text(`Started: ${c.startedAt}`);
  if (c.finalizedAt) doc.text(`Finalized: ${c.finalizedAt}`);
  doc.moveDown();

  for (const s of c.definition.sections) {
    doc.fontSize(12).text(`${s.code}. ${s.title}`);
    for (const q of s.items) {
      doc.fontSize(10).text(`${q.code} — ${q.prompt}`);
    }
    doc.moveDown();
  }

  doc.end();
  const pdf = await ready;

  return new Response(pdf, {
    headers: { "content-type": "application/pdf", "content-disposition": `inline; filename="checklist-${c.id}.pdf"` }
  });
}
