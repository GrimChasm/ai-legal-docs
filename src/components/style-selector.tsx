"use client"

import { presets, DocumentStyle } from "@/lib/document-styles"
import { Button } from "@/components/ui/button"

interface StyleSelectorProps {
  selectedStyle: DocumentStyle
  onStyleChange: (style: DocumentStyle) => void
}

// Helper function to check if two DocumentStyle objects are equal
function stylesEqual(style1: DocumentStyle, style2: DocumentStyle): boolean {
  return (
    style1.fontFamily === style2.fontFamily &&
    style1.fontSize === style2.fontSize &&
    style1.lineSpacing === style2.lineSpacing &&
    style1.paragraphSpacing === style2.paragraphSpacing &&
    style1.headingStyle === style2.headingStyle &&
    style1.headingCase === style2.headingCase &&
    style1.headingIndent === style2.headingIndent &&
    style1.layout === style2.layout &&
    style1.numberingStyle === style2.numberingStyle
  )
}

export default function StyleSelector({
  selectedStyle,
  onStyleChange,
}: StyleSelectorProps) {
  // Convert presets object to array with id and name
  const styleOptions = Object.entries(presets).map(([id, style]) => ({
    id,
    name: id.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
    style,
  }))

  return (
    <div className="flex gap-2 flex-wrap">
      {styleOptions.map((option) => (
        <Button
          key={option.id}
          variant={stylesEqual(selectedStyle, option.style) ? "primary" : "outline"}
          onClick={() => onStyleChange(option.style)}
          className="text-sm"
        >
          {option.name}
        </Button>
      ))}
    </div>
  )
}

