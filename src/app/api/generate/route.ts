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
import {
  validateRequestBody,
  validateContractId,
  validateValues,
  validateString,
} from "@/lib/validation"
import { checkRateLimit, getRateLimitHeaders, RATE_LIMITS } from "@/lib/rate-limit"
import { markdownToHTML } from "@/lib/markdown-to-html"

export async function POST(req: Request) {
  // Rate limiting
  const rateLimitResult = checkRateLimit(req, RATE_LIMITS.GENERATE)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfter: rateLimitResult.retryAfter,
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    )
  }

  try {
    // Parse and validate request body
    let body
    try {
      body = await req.json()
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    // Validate required fields
    const bodyValidation = validateRequestBody(body, ["contractId", "values"])
    if (!bodyValidation.valid) {
      return NextResponse.json(
        { error: bodyValidation.error },
        { status: 400 }
      )
    }

    const { contractId, values, templateCode } = body

    // Validate contractId format
    const contractIdValidation = validateContractId(contractId)
    if (!contractIdValidation.valid) {
      return NextResponse.json(
        { error: contractIdValidation.error },
        { status: 400 }
      )
    }

    // Validate values object
    const valuesValidation = validateValues(values)
    if (!valuesValidation.valid) {
      return NextResponse.json(
        { error: valuesValidation.error },
        { status: 400 }
      )
    }

    // Validate templateCode if provided
    if (templateCode !== undefined) {
      const templateCodeValidation = validateString(templateCode, "templateCode", 50000)
      if (!templateCodeValidation.valid) {
        return NextResponse.json(
          { error: templateCodeValidation.error },
          { status: 400 }
        )
      }
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

    // If it's a direct document, convert to HTML and return
    if (isDirectDocument) {
      const html = markdownToHTML(templateStructure)
      return NextResponse.json({ html, markdown: templateStructure }) // Keep markdown for backward compatibility
    }

    // Otherwise, use GPT-4 to generate the document from the template structure
    try {
      const markdown = await generateLegalDocumentWithGPT4({
        templateName,
        userInputs: values,
        templateStructure,
      })

      // Convert markdown to HTML for storage
      const html = markdownToHTML(markdown)

      return NextResponse.json({ html, markdown }) // Return both HTML and markdown for backward compatibility
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
