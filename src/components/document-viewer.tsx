"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface DocumentViewerProps {
  content: string
  className?: string
}

export default function DocumentViewer({
  content,
  className = "",
}: DocumentViewerProps) {
  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: '#101623',
        lineHeight: '1.8',
      }}
    >
      <div style={{ padding: '24px 0' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  )
}

