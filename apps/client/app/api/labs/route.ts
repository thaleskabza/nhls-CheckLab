// apps/client/app/api/labs/route.ts
import { db } from "@infra/db";
import { labs } from "@infra/db/schema";

export async function GET() {
  try {
    const labsList = await db.select().from(labs).orderBy(labs.name);
    return Response.json(labsList);
  } catch (error) {
    console.error("Failed to fetch labs:", error);
    return Response.json([], { status: 500 });
  }
}