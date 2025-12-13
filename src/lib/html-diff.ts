/**
 * HTML Diff Utility
 * 
 * Compares two HTML documents and generates a human-readable summary of changes.
 * This is used to notify recipients when documents are edited after they've signed.
 */

import { htmlToPlainText } from "./html-to-text"

interface DocumentChange {
  type: "added" | "removed" | "modified" | "unchanged"
  section?: string
  content: string
  oldContent?: string
}

/**
 * Simple diff algorithm to compare two plain text documents
 * Returns a summary of changes suitable for email notification
 */
export function generateDocumentDiff(oldHtml: string, newHtml: string): {
  hasChanges: boolean
  summary: string
  changes: DocumentChange[]
} {
  const oldText = htmlToPlainText(oldHtml || "")
  const newText = htmlToPlainText(newHtml || "")

  // If identical, no changes
  if (oldText === newText) {
    return {
      hasChanges: false,
      summary: "No changes detected.",
      changes: [],
    }
  }

  const changes: DocumentChange[] = []
  const oldLines = oldText.split("\n").filter(line => line.trim())
  const newLines = newText.split("\n").filter(line => line.trim())

  // Simple line-by-line comparison
  const maxLength = Math.max(oldLines.length, newLines.length)
  let addedCount = 0
  let removedCount = 0
  let modifiedCount = 0

  // Compare sections (headings indicate sections)
  const oldSections = extractSections(oldText)
  const newSections = extractSections(newText)

  // Find added sections
  for (const newSection of newSections) {
    const oldSection = oldSections.find(s => s.title === newSection.title)
    if (!oldSection) {
      changes.push({
        type: "added",
        section: newSection.title,
        content: newSection.content,
      })
      addedCount++
    } else if (oldSection.content !== newSection.content) {
      changes.push({
        type: "modified",
        section: newSection.title,
        content: newSection.content,
        oldContent: oldSection.content,
      })
      modifiedCount++
    }
  }

  // Find removed sections
  for (const oldSection of oldSections) {
    const newSection = newSections.find(s => s.title === oldSection.title)
    if (!newSection) {
      changes.push({
        type: "removed",
        section: oldSection.title,
        content: oldSection.content,
      })
      removedCount++
    }
  }

  // If no section-based changes, do a simpler word-level diff
  if (changes.length === 0) {
    const oldWords = oldText.split(/\s+/).filter(w => w.length > 0)
    const newWords = newText.split(/\s+/).filter(w => w.length > 0)
    
    if (oldWords.length !== newWords.length) {
      const wordDiff = newWords.length - oldWords.length
      if (wordDiff > 0) {
        changes.push({
          type: "added",
          content: `Approximately ${Math.abs(wordDiff)} words added to the document.`,
        })
        addedCount++
      } else {
        changes.push({
          type: "removed",
          content: `Approximately ${Math.abs(wordDiff)} words removed from the document.`,
        })
        removedCount++
      }
    } else {
      // Same word count but different content - assume modification
      changes.push({
        type: "modified",
        content: "Document content has been modified. Please review the updated version.",
      })
      modifiedCount++
    }
  }

  // Generate summary
  const summaryParts: string[] = []
  if (addedCount > 0) {
    summaryParts.push(`${addedCount} section${addedCount > 1 ? "s" : ""} added`)
  }
  if (removedCount > 0) {
    summaryParts.push(`${removedCount} section${removedCount > 1 ? "s" : ""} removed`)
  }
  if (modifiedCount > 0) {
    summaryParts.push(`${modifiedCount} section${modifiedCount > 1 ? "s" : ""} modified`)
  }

  const summary = summaryParts.length > 0
    ? `The document has been updated: ${summaryParts.join(", ")}.`
    : "The document has been updated."

  return {
    hasChanges: true,
    summary,
    changes,
  }
}

/**
 * Extract sections from a document (based on headings)
 */
function extractSections(text: string): Array<{ title: string; content: string }> {
  const sections: Array<{ title: string; content: string }> = []
  const lines = text.split("\n")
  
  let currentSection: { title: string; content: string } | null = null
  
  for (const line of lines) {
    // Detect headings (starts with #)
    if (line.trim().startsWith("#")) {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection)
      }
      
      // Extract title (remove # and trim)
      const title = line.trim().replace(/^#+\s*/, "").trim()
      currentSection = {
        title,
        content: "",
      }
    } else if (currentSection) {
      // Add to current section content
      if (currentSection.content) {
        currentSection.content += "\n"
      }
      currentSection.content += line.trim()
    }
  }
  
  // Add last section
  if (currentSection) {
    sections.push(currentSection)
  }
  
  return sections
}

/**
 * Format changes for email display
 */
export function formatChangesForEmail(changes: DocumentChange[]): string {
  if (changes.length === 0) {
    return "<p>No specific changes were detected.</p>"
  }

  let html = "<div style='margin: 20px 0;'>"

  for (const change of changes) {
    html += "<div style='margin-bottom: 20px; padding: 15px; border-left: 4px solid;"
    
    if (change.type === "added") {
      html += " background-color: #d4edda; border-color: #28a745;'>"
      html += "<strong style='color: #155724;'>✓ Added:</strong>"
    } else if (change.type === "removed") {
      html += " background-color: #f8d7da; border-color: #dc3545;'>"
      html += "<strong style='color: #721c24;'>✗ Removed:</strong>"
    } else if (change.type === "modified") {
      html += " background-color: #fff3cd; border-color: #ffc107;'>"
      html += "<strong style='color: #856404;'>↻ Modified:</strong>"
    } else {
      html += " border-color: #ccc;'>"
    }

    if (change.section) {
      html += `<br><strong>Section:</strong> ${escapeHtml(change.section)}`
    }

    if (change.content) {
      // Truncate long content for email
      const content = change.content.length > 500
        ? change.content.substring(0, 500) + "..."
        : change.content
      html += `<br><div style='margin-top: 10px; padding: 10px; background-color: rgba(0,0,0,0.05); border-radius: 4px;'>${escapeHtml(content)}</div>`
    }

    if (change.oldContent && change.type === "modified") {
      html += `<br><strong>Previous content:</strong>`
      const oldContent = change.oldContent.length > 200
        ? change.oldContent.substring(0, 200) + "..."
        : change.oldContent
      html += `<div style='margin-top: 5px; padding: 10px; background-color: rgba(0,0,0,0.03); border-radius: 4px; font-size: 0.9em; color: #666;'><em>${escapeHtml(oldContent)}</em></div>`
    }

    html += "</div>"
  }

  html += "</div>"
  return html
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}


