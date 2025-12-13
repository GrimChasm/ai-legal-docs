"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { isHTML } from "@/lib/markdown-to-html"
import { htmlToPlainText } from "@/lib/html-to-text"
import { markdownToHTML } from "@/lib/markdown-to-html"

interface EditableDocumentProps {
  content: string | null
  onSave: (editedContent: string) => Promise<void>
  onCancel?: () => void
  isSaving?: boolean
}

/**
 * Editable Document Component
 * 
 * Allows users to edit the document content in plain language (markdown-like text).
 * Converts HTML to plain text for editing, then converts back to HTML on save.
 */
export default function EditableDocument({
  content,
  onSave,
  onCancel,
  isSaving = false,
}: EditableDocumentProps) {
  // Convert HTML to plain text for editing if content is HTML
  const getPlainTextForEditing = (htmlContent: string | null): string => {
    if (!htmlContent) return ""
    if (isHTML(htmlContent)) {
      return htmlToPlainText(htmlContent)
    }
    return htmlContent
  }

  // Memoize the plain text version of the original content
  const originalPlainText = useMemo(() => getPlainTextForEditing(content), [content])
  
  const [editedContent, setEditedContent] = useState(originalPlainText)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditedContent(originalPlainText)
  }, [originalPlainText])

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      // Move cursor to end
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      )
    }
  }, [])

  const handleSave = async () => {
    if (!editedContent.trim()) {
      alert("Content cannot be empty")
      return
    }
    
    // Convert plain text back to HTML for saving
    // The edited content is plain text, so we convert it to HTML
    const htmlContent = markdownToHTML(editedContent.trim())
    
    await onSave(htmlContent)
  }

  const handleCancel = () => {
    setEditedContent(getPlainTextForEditing(content))
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h4 className="text-lg font-semibold text-text-main">Edit Document</h4>
          <p className="text-sm text-text-muted mt-1">
            Edit your document in plain language below. Use headings (## for sections, ### for subsections), 
            bold (**text**), italic (*text*), and lists (- for bullets, 1. for numbered).
          </p>
        </div>
      </div>

      {/* Edit Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Editing Tips:</strong>
        </p>
        <ul className="text-sm text-blue-800 mt-2 list-disc list-inside space-y-1">
          <li>Use <code className="bg-blue-100 px-1 rounded">## Section Title</code> for main sections</li>
          <li>Use <code className="bg-blue-100 px-1 rounded">### Subsection</code> for subsections</li>
          <li>Use <code className="bg-blue-100 px-1 rounded">**bold**</code> for bold text</li>
          <li>Use <code className="bg-blue-100 px-1 rounded">*italic*</code> for italic text</li>
          <li>Use <code className="bg-blue-100 px-1 rounded">- item</code> for bullet lists</li>
          <li>Use <code className="bg-blue-100 px-1 rounded">1. item</code> for numbered lists</li>
        </ul>
      </div>

      {/* Textarea Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full min-h-[500px] p-4 border border-border rounded-lg font-sans text-sm bg-bg text-text-main focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-y leading-relaxed"
          placeholder="Edit your document content here in plain language..."
          spellCheck={true}
        />
        <div className="absolute top-2 right-2 text-xs text-text-muted bg-bg/80 px-2 py-1 rounded">
          {editedContent.length} characters
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving || !editedContent.trim() || editedContent === originalPlainText}
          className="min-w-[100px]"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}

