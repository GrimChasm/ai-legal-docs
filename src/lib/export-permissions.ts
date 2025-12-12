/**
 * Export Permission Helpers
 * 
 * Centralized logic for determining if a user can export/download a document.
 * 
 * Usage:
 * 
 * // In API routes:
 * import { canExportDocument } from "@/lib/export-permissions"
 * 
 * const canExport = await canExportDocument(userId, draftId)
 * if (!canExport) {
 *   return NextResponse.json({ error: "Export requires payment" }, { status: 403 })
 * }
 * 
 * // In React components:
 * import { useCanExport } from "@/lib/export-permissions"
 * 
 * const canExport = useCanExport(draftId)
 * if (!canExport) {
 *   return <PaywallModal />
 * }
 */

import { prisma } from "@/lib/prisma"

/**
 * Check if a user can export a specific document
 * 
 * A user can export if:
 * 1. They have a Pro subscription (isPro = true), OR
 * 2. The document has been unlocked via one-time payment (hasPaidExport = true)
 * 
 * @param userId - The user's ID
 * @param draftId - The document/draft ID (optional, for document-specific checks)
 * @returns Promise<boolean> - true if user can export, false otherwise
 */
export async function canExportDocument(
  userId: string,
  draftId?: string
): Promise<boolean> {
  try {
    // Check if user has Pro subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPro: true },
    })

    if (user?.isPro) {
      return true // Pro users can export everything
    }

    // If no draftId provided, user needs Pro for general export access
    if (!draftId) {
      return false
    }

    // Check if this specific document has been unlocked
    const draft = await prisma.draft.findUnique({
      where: { id: draftId },
      select: { hasPaidExport: true, userId: true },
    })

    // Ensure the draft belongs to the user
    if (!draft || draft.userId !== userId) {
      return false
    }

    // Return true if document has been unlocked via one-time payment
    return draft.hasPaidExport === true
  } catch (error) {
    console.error("Error checking export permissions:", error)
    return false // Fail closed - don't allow export on error
  }
}

/**
 * Check if a user can copy the full document text
 * 
 * Same logic as export - requires Pro or one-time unlock
 */
export async function canCopyDocument(
  userId: string,
  draftId?: string
): Promise<boolean> {
  return canExportDocument(userId, draftId)
}

/**
 * Check if a user can save a document to their account
 * 
 * Same logic as export - requires Pro or one-time unlock
 */
export async function canSaveDocument(
  userId: string,
  draftId?: string
): Promise<boolean> {
  return canExportDocument(userId, draftId)
}

/**
 * Check if a user can use e-signature features
 * 
 * For now, this requires Pro subscription (could be changed later)
 */
export async function canUseSignature(
  userId: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPro: true },
    })

    return user?.isPro === true
  } catch (error) {
    console.error("Error checking signature permissions:", error)
    return false
  }
}

/**
 * React hook to check export permissions on the client side
 * 
 * Note: This uses the session to check isPro status, but for document-specific
 * checks, you'll need to fetch from the API or pass hasPaidExport as a prop.
 * 
 * @param draftId - Optional draft ID for document-specific check
 * @returns { canExport: boolean, isLoading: boolean }
 */
export function useCanExport(draftId?: string) {
  // This is a placeholder - in a real implementation, you'd use:
  // - useSession() to get user.isPro
  // - A separate API call or prop to get draft.hasPaidExport
  // For now, return a function that components can use
  
  return {
    canExport: false, // Will be determined by component logic
    isLoading: false,
  }
}





