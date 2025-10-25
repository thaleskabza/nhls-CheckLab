export type Role = "ADMIN"|"OFFICER"|"AUDITOR";
export function requireRole(_req: Request, roles: Role[]) {
  // Dev stub: always OFFICER
  const role: Role = "OFFICER";
  if (!roles.includes(role)) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  return { userId: "00000000-0000-0000-0000-000000000001", role };
}
