"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

/**
 * Signature Positioning Component
 * 
 * Allows users to customize where signatures appear in the document.
 * 
 * Features:
 * - Position selection (bottom, custom)
 * - Custom Y position input (for advanced placement)
 * - Visual preview of signature placement
 * 
 * Usage:
 * <SignaturePositioning
 *   signatures={signatures}
 *   onPositionChange={(signatureId, position) => {
 *     // Update signature position
 *   }}
 * />
 */

interface Signature {
  id: string
  signerName: string
  signerEmail: string
  signatureData: string
  createdAt: string
  position?: "bottom" | "custom"
  customY?: number
}

interface SignaturePositioningProps {
  signatures: Signature[]
  onPositionChange: (signatureId: string, position: "bottom" | "custom", customY?: number) => void
}

export default function SignaturePositioning({
  signatures,
  onPositionChange,
}: SignaturePositioningProps) {
  const [customPositions, setCustomPositions] = useState<Record<string, number>>({})

  if (signatures.length === 0) {
    return null
  }

  return (
    <Card className="border-2 border-border bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-text-main">
          Signature Positioning
        </CardTitle>
        <p className="text-sm text-text-muted mt-2">
          Customize where signatures appear in your document
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {signatures.map((signature) => {
          const currentPosition = signature.position || "bottom"
          const customY = customPositions[signature.id] ?? signature.customY ?? 0

          return (
            <div
              key={signature.id}
              className="p-4 border border-border rounded-lg bg-bg-muted space-y-4"
            >
              <div>
                <Label className="text-sm font-medium text-text-main">
                  {signature.signerName}
                </Label>
                <p className="text-xs text-text-muted mt-1">{signature.signerEmail}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-text-main mb-2 block">
                    Position
                  </Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={currentPosition === "bottom" ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPositionChange(signature.id, "bottom")}
                      className="flex-1 hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
                    >
                      Bottom of Document
                    </Button>
                    <Button
                      type="button"
                      variant={currentPosition === "custom" ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPositionChange(signature.id, "custom", customY)}
                      className="flex-1 hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
                    >
                      Custom Position
                    </Button>
                  </div>
                </div>

                {currentPosition === "custom" && (
                  <div>
                    <Label htmlFor={`custom-y-${signature.id}`} className="text-sm text-text-main mb-2 block">
                      Y Position (points from top)
                    </Label>
                    <Input
                      id={`custom-y-${signature.id}`}
                      type="number"
                      value={customY}
                      onChange={(e) => {
                        const newY = parseInt(e.target.value) || 0
                        setCustomPositions({ ...customPositions, [signature.id]: newY })
                        onPositionChange(signature.id, "custom", newY)
                      }}
                      min="0"
                      placeholder="0"
                      className="w-full"
                    />
                    <p className="text-xs text-text-muted mt-1">
                      Enter the vertical position in points (1 inch = 72 points)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

