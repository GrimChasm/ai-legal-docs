"use client"

import { documentStyles, DocumentStyle } from "@/lib/document-styles"
import { Button } from "@/components/ui/button"

interface StyleSelectorProps {
  selectedStyle: DocumentStyle
  onStyleChange: (style: DocumentStyle) => void
}

export default function StyleSelector({
  selectedStyle,
  onStyleChange,
}: StyleSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {documentStyles.map((style) => (
        <Button
          key={style.id}
          variant={selectedStyle.id === style.id ? "default" : "outline"}
          onClick={() => onStyleChange(style)}
          className="text-sm"
        >
          {style.name}
        </Button>
      ))}
    </div>
  )
}

