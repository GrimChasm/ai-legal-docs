export interface DocumentStyle {
  id: string
  name: string
  fontFamily: string
  fontSize: number
  lineHeight: number
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  color: string
  headingFormat: "bold" | "uppercase" | "both"
}

export const documentStyles: DocumentStyle[] = [
  {
    id: "professional",
    name: "Professional",
    fontFamily: "Times New Roman, serif",
    fontSize: 12,
    lineHeight: 1.6,
    margin: { top: 72, right: 72, bottom: 72, left: 72 },
    color: "#000000",
    headingFormat: "bold",
  },
  {
    id: "modern",
    name: "Modern",
    fontFamily: "Arial, sans-serif",
    fontSize: 11,
    lineHeight: 1.5,
    margin: { top: 60, right: 60, bottom: 60, left: 60 },
    color: "#333333",
    headingFormat: "bold",
  },
  {
    id: "compact",
    name: "Compact",
    fontFamily: "Calibri, sans-serif",
    fontSize: 10,
    lineHeight: 1.4,
    margin: { top: 50, right: 50, bottom: 50, left: 50 },
    color: "#000000",
    headingFormat: "uppercase",
  },
]

export const defaultStyle = documentStyles[0]

