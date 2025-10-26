// apps/admin/app/api/docs/route.ts
export async function GET() {
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "NHLS WasteCheck API",
      version: "1.0.0",
      description: "Healthcare Waste Management Checklist System"
    },
    servers: [
      { url: "http://localhost:3001", description: "Development" }
    ],
    paths: {
      "/api/checklists": {
        post: {
          summary: "Create checklist",
          tags: ["Checklists"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["labId"],
                  properties: {
                    labId: { type: "string", format: "uuid", example: "264e3577-7708-4a0c-bbd9-c909d9f4edfb" }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Checklist created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      checklistId: { type: "string", format: "uuid" }
                    }
                  }
                }
              }
            },
            400: { description: "Active checklist already exists" },
            401: { description: "Unauthorized" }
          }
        }
      },
      "/api/checklists/{id}": {
        get: {
          summary: "Get checklist",
          tags: ["Checklists"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Checklist ID"
            }
          ],
          responses: {
            200: {
              description: "Checklist details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string", format: "uuid" },
                      labId: { type: "string", format: "uuid" },
                      createdBy: { type: "string", format: "uuid" },
                      status: { type: "string", enum: ["DRAFT", "REVIEW", "LOCKED", "FINAL"] },
                      version: { type: "integer" },
                      title: { type: "string" },
                      startedAt: { type: "string", format: "date-time" },
                      finalizedAt: { type: "string", format: "date-time", nullable: true },
                      definition: { type: "object" }
                    }
                  }
                }
              }
            },
            404: { description: "Checklist not found" }
          }
        }
      },
      "/api/checklists/{id}/answers": {
        post: {
          summary: "Submit answers",
          tags: ["Checklists"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Checklist ID"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["checklistId", "expectedVersion", "items"],
                  properties: {
                    checklistId: { type: "string", format: "uuid" },
                    expectedVersion: { type: "integer" },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["sectionCode", "questionCode", "answer"],
                        properties: {
                          sectionCode: { type: "string", example: "A" },
                          questionCode: { type: "string", example: "A1" },
                          answer: { type: "string", enum: ["Y", "N", "NA"] },
                          comment: { type: "string", nullable: true },
                          dueDate: { type: "string", format: "date", nullable: true }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Answers submitted successfully" },
            400: { description: "Invalid data or checklist not editable" },
            409: { description: "Version conflict" }
          }
        }
      },
      "/api/checklists/{id}/pdf": {
        get: {
          summary: "Export PDF",
          tags: ["Checklists"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Checklist ID"
            }
          ],
          responses: {
            200: {
              description: "PDF file",
              content: {
                "application/pdf": {
                  schema: { type: "string", format: "binary" }
                }
              }
            },
            404: { description: "Checklist not found" }
          }
        }
      },
      "/api/reports/lab/{labId}": {
        get: {
          summary: "Lab report",
          tags: ["Reports"],
          parameters: [
            {
              name: "labId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Laboratory ID",
              example: "264e3577-7708-4a0c-bbd9-c909d9f4edfb"
            }
          ],
          responses: {
            200: {
              description: "Lab compliance report",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      labId: { type: "string", format: "uuid" },
                      checklistId: { type: "string", format: "uuid" },
                      sections: {
                        type: "object",
                        properties: {
                          A: { $ref: "#/components/schemas/SectionSummary" },
                          B: { $ref: "#/components/schemas/SectionSummary" },
                          C: { $ref: "#/components/schemas/SectionSummary" }
                        }
                      }
                    }
                  }
                }
              }
            },
            404: { description: "No checklist found for lab" }
          }
        }
      },
      "/api/reports/executive": {
        get: {
          summary: "Executive roll-up",
          tags: ["Reports"],
          parameters: [
            {
              name: "from",
              in: "query",
              required: false,
              schema: { type: "string", format: "date" },
              description: "Start date (YYYY-MM-DD)",
              example: "2025-01-01"
            },
            {
              name: "to",
              in: "query",
              required: false,
              schema: { type: "string", format: "date" },
              description: "End date (YYYY-MM-DD)",
              example: "2025-12-31"
            }
          ],
          responses: {
            200: {
              description: "Executive compliance summary",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalChecklists: { type: "integer" },
                      compliance: {
                        type: "object",
                        properties: {
                          A: { type: "number", description: "Percentage" },
                          B: { type: "number", description: "Percentage" },
                          C: { type: "number", description: "Percentage" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/stats": {
        get: {
          summary: "Admin stats",
          tags: ["Admin"],
          responses: {
            200: {
              description: "System statistics",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totals: {
                        type: "object",
                        properties: {
                          all: { type: "integer" },
                          drafts: { type: "integer" },
                          finals: { type: "integer" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        SectionSummary: {
          type: "object",
          properties: {
            count: {
              type: "object",
              properties: {
                Y: { type: "integer", description: "Yes answers" },
                N: { type: "integer", description: "No answers" },
                NA: { type: "integer", description: "Not applicable answers" }
              }
            },
            weightedCompliancePct: { type: "number", description: "Compliance percentage" },
            weightedNonCompliancePct: { type: "number", description: "Non-compliance percentage" }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  };
  
  return Response.json(spec);
}