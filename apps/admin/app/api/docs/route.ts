//apps/admin/app/api/docs/route.ts
export async function GET() {
    // Minimal spec — extend as needed
    const spec = {
      openapi: "3.0.3",
      info: { title: "NHLS WasteCheck API", version: "1.0.0" },
      paths: {
        "/api/checklists": { post: { summary: "Create checklist" } },
        "/api/checklists/{id}": { get: { summary: "Get checklist" } },
        "/api/checklists/{id}/answers": { post: { summary: "Submit answers" } },
        "/api/checklists/{id}/pdf": { get: { summary: "Export PDF" } },
        "/api/reports/lab/{labId}": { get: { summary: "Lab report" } },
        "/api/reports/executive": { get: { summary: "Executive roll-up" } },
        "/api/stats": { get: { summary: "Admin stats" } }
      }
    };
    return Response.json(spec);
  }
  