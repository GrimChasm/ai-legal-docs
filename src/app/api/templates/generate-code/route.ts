/**
 * Template Code Generation API Route
 * 
 * NOTE: This application exclusively uses OpenAI GPT-4 for all AI functionality.
 * 
 * POST /api/templates/generate-code
 * Body: { title, description, formSchema }
 * 
 * Generates JavaScript template function code using GPT-4.
 */

import { NextRequest, NextResponse } from "next/server"
import { generateWithGPT4 } from "@/lib/openai-client"

const TEMPLATE_GENERATION_SYSTEM_MESSAGE = 
  "You are an expert JavaScript developer. Generate clean, production-ready JavaScript template function code for legal document generation. " +
  "Output ONLY the function code, no explanations or markdown code blocks."

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, formSchema } = body

    if (!title || !description || !formSchema) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, or formSchema" },
        { status: 400 }
      )
    }

    const prompt = `Generate a JavaScript template function for a legal document generator.

Document Title: ${title}
Description: ${description}

Form Schema (fields that will be available in the values object):
${JSON.stringify(formSchema, null, 2)}

Requirements:
1. Create a function named "template" that takes a "values" parameter (object with form field values)
2. Return a markdown-formatted legal document string
3. Use template literals with \${} interpolation for dynamic values
4. Include proper legal document structure (sections, headings, clauses)
5. Use the field values from the "values" object
6. Generate professional, legally sound content
7. Output ONLY the function code, no explanations or markdown code blocks

Example structure:
function template(values) {
  return \`# Document Title

## Section 1
Content using \${values.fieldName}

## Section 2
More content...
\`
}`

    try {
      let templateCode = await generateWithGPT4(prompt, TEMPLATE_GENERATION_SYSTEM_MESSAGE)

      // Clean up the response - remove markdown code blocks if present
      templateCode = templateCode.replace(/^```(?:javascript|js)?\n?/gm, "").replace(/```$/gm, "").trim()

      return NextResponse.json({
        templateCode: templateCode.trim(),
        model: "gpt-4",
      })
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to generate template code"
      
      return NextResponse.json(
        {
          error: errorMessage,
          suggestion: "Make sure OPENAI_API_KEY is configured in your environment variables.",
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Error generating template code:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
