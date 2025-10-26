// apps/packages/core/ports/ChecklistRepo.ts
import type { Checklist, AnswerItem } from "../domain/checklist";

export interface ChecklistRepo {
  /**
   * Get the active (DRAFT or REVIEW) checklist ID for a user and optional lab
   * @param userId - User ID
   * @param labId - Laboratory ID (optional - if provided, only checks for active checklist for this lab)
   * @returns Checklist ID or null if no active checklist
   */
  getActiveChecklistIdForUser(userId: string, labId?: string): Promise<string | null>;

  /**
   * Create a new checklist for a lab
   * @param labId - Laboratory ID
   * @param userId - User ID creating the checklist
   * @returns Created checklist ID
   */
  createChecklist(labId: string, userId: string): Promise<string>;

  /**
   * Get a checklist by ID with full details including lab name
   * @param id - Checklist ID
   * @returns Checklist or null if not found
   */
  getChecklist(id: string): Promise<Checklist | null>;

  /**
   * Save answers for a checklist section
   * @param id - Checklist ID
   * @param expectedVersion - Expected version for optimistic locking
   * @param items - Array of answer items
   */
  saveAnswers(
    id: string,
    expectedVersion: number,
    items: AnswerItem[]
  ): Promise<void>;

  /**
   * Update checklist status
   * @param id - Checklist ID
   * @param status - New status
   */
  setStatus(
    id: string,
    status: "DRAFT" | "REVIEW" | "LOCKED" | "FINAL"
  ): Promise<void>;

  /**
   * Increment checklist version (for optimistic locking)
   * @param id - Checklist ID
   * @returns New version number
   */
  bumpVersion(id: string): Promise<number>;
}