/**
 * Document Generation API Route
 * 
 * NOTE: All legal documents in this application are generated exclusively using OpenAI GPT-4.
 * This ensures high-quality, structured output and consistent formatting across all templates.
 * 
 * POST /api/generate
 * Body: { contractId, values, templateCode? }
 * 
 * Generates legal documents using GPT-4 based on template and user-provided values.
 * All document generation flows through the standardized generateLegalDocumentWithGPT4() function.
 */

import { NextResponse } from "next/server"
import { contractRegistry } from "@/lib/contracts"
import { generateLegalDocumentWithGPT4, getTemplateName } from "@/lib/legal-document-generator"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { contractId, values, templateCode } = body

    if (!contractId) {
      return NextResponse.json({ error: "Missing contractId" }, { status: 400 })
    }

    if (!values) {
      return NextResponse.json({ error: "Missing values" }, { status: 400 })
    }

    // Get template name
    const templateName = getTemplateName(contractId, contractRegistry)

    // Get template structure/prompt
    let templateStructure = ""

    // Handle custom templates
    if (contractId.startsWith("custom-") && templateCode) {
      try {
        // Execute the template code to get the structure/prompt
        const templateFunction = new Function("values", `
          ${templateCode}
          return template(values);
        `)
        templateStructure = templateFunction(values)
      } catch (error: any) {
        return NextResponse.json(
          { error: `Template execution error: ${error.message}` },
          { status: 500 }
        )
      }
    } else {
      // Handle standard templates from registry
      const contract = contractRegistry[contractId]
      if (!contract) {
        return NextResponse.json({ error: `Invalid contractId: ${contractId}` }, { status: 400 })
      }

      // Call template function to get structure/prompt
      templateStructure = (contract.template as (values: Record<string, string | number>) => string)(values)
    }

    if (!templateStructure) {
      return NextResponse.json({ error: "Failed to generate template structure" }, { status: 500 })
    }

    // Check if template output is a direct document (already complete)
    // Direct documents typically start with markdown headers (#) or contain structured legal content
    // AI prompts typically contain instructions like "Generate a..." or "Create a..."
    const isDirectDocument = 
      templateStructure.trim().startsWith("#") || 
      (templateStructure.includes("##") &&
       !templateStructure.toLowerCase().includes("generate") && 
       !templateStructure.toLowerCase().includes("create") &&
       !templateStructure.toLowerCase().includes("requirements:") &&
       !templateStructure.toLowerCase().includes("include sections:") &&
       !templateStructure.toLowerCase().includes("instructions:"))

    // If it's a direct document, return it immediately without AI
    if (isDirectDocument) {
      return NextResponse.json({ markdown: templateStructure })
    }

    // Otherwise, use GPT-4 to generate the document from the template structure
    try {
      const markdown = await generateLegalDocumentWithGPT4({
        templateName,
        userInputs: values,
        templateStructure,
      })

      return NextResponse.json({ markdown })
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        "Failed to generate document. Please check your OpenAI API key and try again."
      
      return NextResponse.json(
        {
          error: errorMessage,
          suggestion: "Make sure OPENAI_API_KEY is configured in your environment variables.",
        },
        { status: 500 }
      )
    }
  } catch (err: any) {
    console.error("API Error:", err)
    const errorMessage = err?.message || "Internal server error"
    const errorStack = process.env.NODE_ENV === "development" ? err?.stack : undefined

    return NextResponse.json(
      {
        error: errorMessage,
        ...(errorStack && { stack: errorStack }),
      },
      { status: 500 }
    )
  }
}
