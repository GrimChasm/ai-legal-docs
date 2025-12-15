"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/**
 * SignaturePad Component
 * 
 * Provides three methods for capturing signatures:
 * 1. Draw - Mouse/touch drawing on canvas
 * 2. Type - Text input with stylized fonts
 * 3. Upload - Image file upload
 * 
 * Exports signature as base64 PNG image for storage.
 * 
 * Usage:
 * <SignaturePad onSign={handleSignature} />
 */
interface SignaturePadProps {
  onSign: (signatureData: string, signatureType: "drawn" | "typed" | "uploaded", typedText?: string) => void
  onCancel?: () => void
  initialName?: string
}

type SignatureMode = "draw" | "type" | "upload"

export default function SignaturePad({ onSign, onCancel, initialName = "" }: SignaturePadProps) {
  const [mode, setMode] = useState<SignatureMode>("draw")
  const [typedName, setTypedName] = useState(initialName)
  const [fontStyle, setFontStyle] = useState<"script" | "cursive" | "elegant">("script")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const [hasDrawing, setHasDrawing] = useState(false)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Function to resize canvas properly
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      // Set actual size in memory (scaled for device pixel ratio)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      // Scale the drawing context to match device pixel ratio
      ctx.scale(dpr, dpr)
      
      // Set display size (CSS pixels)
      canvas.style.width = rect.width + "px"
      canvas.style.height = rect.height + "px"
      
      // Set drawing style
      ctx.strokeStyle = "#101623"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }

    resizeCanvas()
    
    // Re-resize on window resize
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  // Get accurate coordinates accounting for device pixel ratio and canvas scaling
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    // Calculate coordinates relative to canvas, accounting for any scaling
    const x = clientX - rect.left
    const y = clientY - rect.top

    return { x, y }
  }

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault() // Prevent default to avoid scrolling on touch
    isDrawingRef.current = true
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    e.preventDefault() // Prevent default to avoid scrolling on touch

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasDrawing(true)
  }

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e) {
      e.preventDefault()
    }
    isDrawingRef.current = false
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawing(false)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB")
      return
    }

    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Get font family for typed signature
  // Each style uses distinct fonts to ensure they look different and match their labels
  const getFontFamily = () => {
    switch (fontStyle) {
      case "script":
        // Script: True cursive handwriting - flowing, connected letters like traditional cursive
        // Uses Google Fonts loaded in layout.tsx: Caveat, Satisfy, Kalam
        return "'Caveat', 'Satisfy', 'Kalam', 'Lucida Handwriting', 'Comic Sans MS', cursive"
      case "cursive":
        // Cursive: Bold brush script style - thick, flowing script letters
        return "'Brush Script MT', 'Brush Script', 'Lucida Handwriting', cursive"
      case "elegant":
        // Elegant: Formal elegant script - refined, sophisticated calligraphy
        return "'Great Vibes', 'Lucida Calligraphy', 'Playfair Display', serif"
      default:
        return "'Brush Script MT', cursive"
    }
  }

  // Generate signature image
  const generateSignatureImage = (): Promise<string> => {
    return new Promise((resolve) => {
      if (mode === "draw") {
        const canvas = canvasRef.current
        if (!canvas || !hasDrawing) {
          resolve("")
          return
        }
        resolve(canvas.toDataURL("image/png"))
      } else if (mode === "type") {
        if (!typedName.trim()) {
          resolve("")
          return
        }
        // Create a canvas for typed signature
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve("")
          return
        }

        canvas.width = 400
        canvas.height = 100

        ctx.font = `48px ${getFontFamily()}`
        ctx.fillStyle = "#101623"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(typedName, canvas.width / 2, canvas.height / 2)

        resolve(canvas.toDataURL("image/png"))
      } else if (mode === "upload") {
        if (!uploadPreview) {
          resolve("")
          return
        }
        resolve(uploadPreview)
      } else {
        resolve("")
      }
    })
  }

  // Handle sign button
  const handleSign = async () => {
    const signatureData = await generateSignatureImage()
    
    if (!signatureData) {
      alert("Please provide a signature")
      return
    }

    // Map SignatureMode to signatureType expected by onSign
    const signatureType = mode === "draw" ? "drawn" : mode === "type" ? "typed" : "uploaded"
    onSign(signatureData, signatureType, mode === "type" ? typedName : undefined)
  }

  return (
    <Card className="border-2 border-border">
      <CardContent className="p-6 md:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-xl font-semibold text-text-main mb-2">
              Sign Document
            </h3>
            <p className="text-sm text-text-muted">
              Choose how you'd like to sign
            </p>
          </div>

          {/* Mode Selection */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={mode === "draw" ? "primary" : "outline"}
              size="sm"
              onClick={() => setMode("draw")}
              className="hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
            >
              Draw
            </Button>
            <Button
              type="button"
              variant={mode === "type" ? "primary" : "outline"}
              size="sm"
              onClick={() => setMode("type")}
              className="hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
            >
              Type Name
            </Button>
            <Button
              type="button"
              variant={mode === "upload" ? "primary" : "outline"}
              size="sm"
              onClick={() => setMode("upload")}
              className="hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
            >
              Upload Image
            </Button>
          </div>

          {/* Draw Mode */}
          {mode === "draw" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-main">
                Draw your signature below
              </label>
              <div className="border-2 border-border rounded-lg p-4 bg-bg">
                <canvas
                  ref={canvasRef}
                  className="w-full h-48 touch-none cursor-crosshair"
                  style={{ touchAction: "none" }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  onTouchCancel={stopDrawing}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="w-full hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
              >
                Clear
              </Button>
            </div>
          )}

          {/* Type Mode */}
          {mode === "type" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">
                  Type your name as you want it to appear
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Your name"
                  className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">
                  Font Style
                </label>
                <select
                  value={fontStyle}
                  onChange={(e) => setFontStyle(e.target.value as typeof fontStyle)}
                  className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                >
                  <option value="script">Script</option>
                  <option value="cursive">Cursive</option>
                  <option value="elegant">Elegant</option>
                </select>
              </div>
              {typedName && (
                <div className="border-2 border-border rounded-lg p-6 bg-bg text-center">
                  <div
                    style={{
                      fontFamily: getFontFamily(),
                      fontSize: "2rem",
                      color: "#101623",
                    }}
                  >
                    {typedName}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Mode */}
          {mode === "upload" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">
                  Upload signature image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main transition-all duration-200 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                />
                <p className="text-xs text-text-muted mt-2">
                  Accepted formats: PNG, JPG, GIF. Max size: 2MB
                </p>
              </div>
              {uploadPreview && (
                <div className="border-2 border-border rounded-lg p-4 bg-bg">
                  <img
                    src={uploadPreview}
                    alt="Signature preview"
                    className="max-w-full h-auto max-h-48 mx-auto"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-border">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
              >
                Cancel
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              onClick={handleSign}
              className="flex-1"
            >
              Confirm Signature
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

