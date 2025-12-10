/**
 * Legal Document Generator
 * 
 * NOTE: All legal documents in this application are generated exclusively using OpenAI GPT-4.
 * This ensures high-quality, structured output and consistent formatting across all templates.
 * 
 * This module provides a standardized pipeline for generating legal documents based on:
 * - User-provided form inputs
 * - Template structure and requirements
 * - Customization options
 * 
 * All document generation flows through generateLegalDocumentWithGPT4().
 */

import { generateWithGPT4 } from "./openai-client"
import { SYSTEM_INSTRUCTIONS } from "@/config/openai"
import { buildDocumentTypePromptEnhancement } from "./document-type-prompts"

export interface LegalDocumentGenerationOptions {
  /** The template name/type (e.g., "NDA", "Contractor Agreement") */
  templateName: string
  /** User-entered form data as key-value pairs */
  userInputs: Record<string, string | number>
  /** Template structure or base prompt from the template */
  templateStructure?: string
  /** Any additional clauses or customizations */
  customizations?: string[]
  /** Additional context or instructions */
  additionalContext?: string
}

/**
 * Generates a legal document using GPT-4 based on user inputs and template structure.
 * 
 * This is the single source of truth for all legal document generation in the application.
 * All document generation workflows (Generate Document, Preview, Regenerate, etc.) 
 * should call this function.
 * 
 * @param options - Document generation options
 * @returns Generated document markdown text
 */
export async function generateLegalDocumentWithGPT4(
  options: LegalDocumentGenerationOptions
): Promise<string> {
  const { templateName, userInputs, templateStructure, customizations, additionalContext } = options

  // Build the standardized prompt
  const userPrompt = buildLegalDocumentPrompt({
    templateName,
    userInputs,
    templateStructure,
    customizations,
    additionalContext,
  })

  // Log prompt construction in development
  if (process.env.NODE_ENV === "development") {
    console.log("\n" + "🔨 PROMPT CONSTRUCTION:")
    console.log("-".repeat(80))
    console.log(`📄 Document Type: ${templateName}`)
    console.log(`📋 User Inputs: ${Object.keys(userInputs).length} fields`)
    console.log(`📝 Template Structure: ${templateStructure ? "Yes" : "No"}`)
    console.log(`🎯 Document-Specific Enhancement: ${buildDocumentTypePromptEnhancement(templateName) ? "Yes" : "No"}`)
    console.log(`📏 Final Prompt Length: ${userPrompt.length} characters`)
    console.log("-".repeat(80) + "\n")
  }

  // Generate document using GPT-4
  const document = await generateWithGPT4(userPrompt, SYSTEM_INSTRUCTIONS)

  return document
}

/**
 * Builds a standardized prompt for legal document generation.
 * 
 * Combines template structure, user inputs, and instructions into a coherent prompt
 * that GPT-4 can use to generate a properly structured legal document.
 */
function buildLegalDocumentPrompt(options: LegalDocumentGenerationOptions): string {
  const { templateName, userInputs, templateStructure, customizations, additionalContext } = options

  let prompt = `You are GPT-4 and your task is to generate a legally-structured, professional document.

Document Type: ${templateName}

`

  // Include document-type-specific enhancements
  const documentTypeEnhancement = buildDocumentTypePromptEnhancement(templateName)
  if (documentTypeEnhancement) {
    prompt += documentTypeEnhancement
  }

  // Include template structure if provided
  if (templateStructure) {
    prompt += `## Template Structure/Requirements
${templateStructure}

`
  }

  // Include user inputs
  prompt += `## User-Provided Information
The following information has been provided by the user and must be accurately incorporated into the document:
${JSON.stringify(userInputs, null, 2)}

`

  // Include customizations if any
  if (customizations && customizations.length > 0) {
    prompt += `## Additional Clauses/Customizations
The user has requested these additional provisions:
${customizations.map((c, i) => `${i + 1}. ${c}`).join("\n")}

`
  }

  // Add comprehensive instructions
  prompt += `## Generation Instructions

### Content Requirements
- Use the template structure and document-specific requirements as the foundation for the document format
- Insert ALL user-provided information into the correct positions within the document
- Ensure every piece of user data (names, dates, amounts, addresses, etc.) is accurately placed
- Do not omit any user-provided information
- If information is missing for a standard clause, use neutral, legally standard language rather than making assumptions

### Legal Structure and Formatting
- Maintain legally coherent formatting and structure throughout
- Ensure proper clause order following legal document conventions
- Use consistent numbering for sections (1., 2., 3.) and subsections (a., b., c.)
- Include clear section headers using markdown ## for main sections and ### for subsections
- Use proper paragraph breaks for readability
- DO NOT include signature lines or signature sections - signatures are handled separately via the signature feature
- Add date fields where appropriate (effective date, execution date, etc.)

### Language and Tone
- Use professional, legally appropriate language
- Maintain consistency in terminology throughout the document
- Use precise legal language where standard terms apply
- Ensure the tone is appropriate for the document type (formal for contracts, clear for policies)

### Output Format
- Produce ONLY the final document text — no commentary, explanations, meta-text, or notes
- Format in clean markdown with proper headers (## for sections, ### for subsections)
- Use bold (**text**) for:
  - Important terms and definitions
  - Party names when first introduced
  - Key dates and amounts
  - Section titles in lists
- Use proper markdown formatting for lists, paragraphs, and emphasis
- Ensure the document is complete and ready for use

### Quality Standards
- The document must be comprehensive and include all standard clauses for this document type
- All sections should be fully developed, not just placeholders
- The document should be ready for execution/signing without additional editing
- Ensure proper legal structure that would be recognized by legal professionals
- Include all necessary boilerplate language for enforceability

`

  // Add additional context if provided
  if (additionalContext) {
    prompt += `## Additional Context
${additionalContext}

`
  }

  prompt += `## Final Instructions

Generate the complete, final legal document in markdown format. The output should be a polished, professional document that:
1. Incorporates all user-provided information accurately
2. Follows all document-specific requirements and best practices
3. Includes all required sections and standard clauses
4. Is properly formatted and ready for use
5. Represents the final, complete document (not a draft or template)
6. DOES NOT include signature lines or signature sections - signatures are handled separately via the signature feature

Begin generating the document now.`

  return prompt
}

/**
 * Helper function to extract template name from contract ID
 */
export function getTemplateName(contractId: string, contractRegistry: Record<string, any>): string {
  if (contractId.startsWith("custom-")) {
    return "Custom Template"
  }
  
  const contract = contractRegistry[contractId]
  return contract?.title || contractId
}

