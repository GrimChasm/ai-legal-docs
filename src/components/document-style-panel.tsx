"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DocumentStyle, defaultStyle, presets } from "@/lib/document-styles"

interface DocumentStylePanelProps {
  style: DocumentStyle
  onChange: (style: DocumentStyle) => void
}

/**
 * Document Style Panel Component
 * 
 * Provides controls for customizing document appearance:
 * - Font family, size, spacing
 * - Heading styles
 * - Layout and margins
 * - Numbering style
 * 
 * All changes are applied immediately to the preview.
 */
export default function DocumentStylePanel({
  style,
  onChange,
}: DocumentStylePanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const handlePresetChange = (presetName: string) => {
    const preset = presets[presetName]
    if (preset) {
      setSelectedPreset(presetName)
      onChange(preset)
    }
  }

  const handleStyleChange = <K extends keyof DocumentStyle>(
    key: K,
    value: DocumentStyle[K]
  ) => {
    setSelectedPreset(null) // Clear preset when manually changing
    onChange({ ...style, [key]: value })
  }

  return (
    <Card className="border-2 border-border">
      <CardContent className="p-6 md:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-xl font-semibold text-text-main mb-2">
              Document Style
            </h3>
            <p className="text-sm text-text-muted">
              Customize the appearance of your document
            </p>
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-main">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={selectedPreset === "standard-legal" ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePresetChange("standard-legal")}
                className="hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
              >
                Standard Legal
              </Button>
              <Button
                type="button"
                variant={selectedPreset === "readable-business" ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePresetChange("readable-business")}
                className="hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
              >
                Readable Business
              </Button>
              <Button
                type="button"
                variant={selectedPreset === "compact-print" ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePresetChange("compact-print")}
                className="hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
              >
                Compact Print
              </Button>
            </div>
          </div>

          {/* Typography Section */}
          <div className="space-y-4 border-t border-border pt-6">
            <h4 className="text-base font-semibold text-text-main">Typography</h4>

            {/* Font Family */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Font Family
              </label>
              <select
                value={style.fontFamily}
                onChange={(e) =>
                  handleStyleChange("fontFamily", e.target.value as DocumentStyle["fontFamily"])
                }
                className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                <option value="modern">Modern (Sans-serif)</option>
                <option value="classic">Classic (Serif)</option>
                <option value="mono">Code-style (Monospace)</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Font Size
              </label>
              <select
                value={style.fontSize}
                onChange={(e) =>
                  handleStyleChange("fontSize", e.target.value as DocumentStyle["fontSize"])
                }
                className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                <option value="small">Small (11pt)</option>
                <option value="medium">Medium (12pt)</option>
                <option value="large">Large (14pt)</option>
              </select>
            </div>

            {/* Line Spacing */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Line Spacing
              </label>
              <select
                value={style.lineSpacing}
                onChange={(e) =>
                  handleStyleChange("lineSpacing", e.target.value as DocumentStyle["lineSpacing"])
                }
                className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                <option value="single">Single (1.0)</option>
                <option value="onePointOneFive">1.15</option>
                <option value="onePointFive">1.5</option>
              </select>
            </div>

            {/* Paragraph Spacing */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Paragraph Spacing
              </label>
              <select
                value={style.paragraphSpacing}
                onChange={(e) =>
                  handleStyleChange("paragraphSpacing", e.target.value as DocumentStyle["paragraphSpacing"])
                }
                className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="roomy">Roomy</option>
              </select>
            </div>
          </div>

          {/* Heading Style Section */}
          <div className="space-y-4 border-t border-border pt-6">
            <h4 className="text-base font-semibold text-text-main">Heading Style</h4>

            {/* Heading Weight */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Heading Weight
              </label>
              <select
                value={style.headingStyle}
                onChange={(e) =>
                  handleStyleChange("headingStyle", e.target.value as DocumentStyle["headingStyle"])
                }
                className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                <option value="regular">Regular</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            {/* Heading Case */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Heading Case
              </label>
              <select
                value={style.headingCase}
                onChange={(e) =>
                  handleStyleChange("headingCase", e.target.value as DocumentStyle["headingCase"])
                }
                className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                <option value="normal">Normal Case</option>
                <option value="uppercase">UPPERCASE</option>
              </select>
            </div>

            {/* Heading Indent */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Heading Alignment
              </label>
              <select
                value={style.headingIndent}
                onChange={(e) =>
                  handleStyleChange("headingIndent", e.target.value as DocumentStyle["headingIndent"])
                }
                className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                <option value="flush">Flush Left</option>
                <option value="indented">Indented</option>
              </select>
            </div>
          </div>

          {/* Layout Section */}
          <div className="space-y-4 border-t border-border pt-6">
            <h4 className="text-base font-semibold text-text-main">Layout</h4>

            {/* Page Layout */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Page Layout
              </label>
              <select
                value={style.layout}
                onChange={(e) =>
                  handleStyleChange("layout", e.target.value as DocumentStyle["layout"])
                }
                className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                <option value="standard">Standard Margins</option>
                <option value="wide">Wide Margins</option>
              </select>
            </div>

            {/* Numbering Style */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-main">
                Numbering Style
              </label>
              <select
                value={style.numberingStyle}
                onChange={(e) =>
                  handleStyleChange("numberingStyle", e.target.value as DocumentStyle["numberingStyle"])
                }
                className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                <option value="numeric">1., 2., 3.</option>
                <option value="decimal">1.1, 1.2, 1.3</option>
                <option value="alpha">(a), (b), (c)</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedPreset(null)
                onChange(defaultStyle)
              }}
              className="w-full hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

