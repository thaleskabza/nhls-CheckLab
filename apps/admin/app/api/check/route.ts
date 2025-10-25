//apps/admin/app/api/check/route.ts
export async function GET() {
    return Response.json({ ok: true, app: "admin", time: new Date().toISOString() });
  }
  