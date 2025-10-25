import { getServerSession } from "next-auth";
export type Role = "ADMIN"|"OFFICER"|"AUDITOR";

// Works inside Next route handlers (admin/client apps)
export async function requireRole(_req: Request, roles: Role[]) {
  // next-auth is app-local; at runtime this will resolve
  const { auth } = await import("next-auth");
  const session = await auth?.();
  const role = (session?.user as any)?.role ?? "OFFICER";
  const userId = (session?.user as any)?.id ?? "00000000-0000-0000-0000-000000000001";
  if (!roles.includes(role)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  return { userId, role };
}
