// apps/client/app/api/checklists/[id]/answers/route.ts
import { NextRequest } from "next/server";
import { PostgresChecklistRepo } from "@infra/db/repo.postgres";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate request body
    if (!body.checklistId || !body.expectedVersion || !body.items) {
      return Response.json(
        { error: "Missing required fields: checklistId, expectedVersion, items" },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return Response.json(
        { error: "Items must be a non-empty array" },
        { status: 400 }
      );
    }

    // Initialize repository
    const repo = PostgresChecklistRepo();

    // Save answers
    await repo.saveAnswers(id, body.expectedVersion, body.items);

    // Bump version after successful save
    const newVersion = await repo.bumpVersion(id);

    return Response.json({
      ok: true,
      version: newVersion,
      message: "Answers saved successfully"
    });

  } catch (error: any) {
    console.error("Error saving answers:", error);

    // Handle specific error cases
    if (error.message === "NotFound") {
      return Response.json(
        { error: "Checklist not found" },
        { status: 404 }
      );
    }

    if (error.message === "NotEditable") {
      return Response.json(
        { error: "Checklist is not in DRAFT status and cannot be edited" },
        { status: 403 }
      );
    }

    if (error.message === "VersionConflict") {
      return Response.json(
        { error: "Version conflict - checklist was modified by another user" },
        { status: 409 }
      );
    }

    // Generic error
    return Response.json(
      { 
        error: "Failed to save answers", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}