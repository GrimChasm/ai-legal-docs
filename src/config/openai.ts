/**
 * OpenAI Configuration
 * 
 * NOTE: This application exclusively uses OpenAI GPT-4 for all AI functionality.
 * If you want to support additional models in the future, update OPENAI_MODEL below.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get your OpenAI API key from: https://platform.openai.com/api-keys
 * 2. Add to your .env.local file:
 *    - OPENAI_API_KEY=sk-...
 *    - OPENAI_MODEL=gpt-4o (optional, defaults to gpt-4o)
 * 
 * AVAILABLE GPT-4 MODELS:
 * - gpt-4o (recommended) - GPT-4 Optimized, faster and more accessible
 * - gpt-4o-mini - Smaller, faster, cheaper GPT-4 variant
 * - gpt-4-turbo - GPT-4 Turbo version
 * - gpt-4 - Base GPT-4 (may require special access)
 * - gpt-4-0613 - Specific GPT-4 version
 * 
 * If you get a 404 error, try:
 * 1. Use gpt-4o (most accessible)
 * 2. Check your OpenAI account has billing enabled
 * 3. Verify your API key has access to GPT-4 models
 * 4. Check available models at: https://platform.openai.com/docs/models
 */

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o"

export const OPENAI_SETTINGS = {
  model: OPENAI_MODEL,
  temperature: 0.2,
  max_tokens: 4000,
} as const

/**
 * System instructions for legal document generation.
 * 
 * This message is sent to GPT-4 as the system role for all legal document generation.
 * It establishes the AI's role, constraints, and output requirements.
 */
export const SYSTEM_INSTRUCTIONS = `You are an expert legal document generator powered by GPT-4.

Your role is to create legally structured, coherent, and professional contracts and legal documents based strictly on user inputs and template requirements.

CRITICAL RULES:
1. You must avoid offering legal advice; only structure the document using the provided information
2. Ensure the final output uses consistent formatting, spacing, paragraph breaks, clause numbering, and clear section headers
3. Maintain professional legal language and terminology appropriate for the document type
4. Do not add information that was not provided by the user unless it's a standard legal boilerplate clause
5. If information is missing, use neutral, standard legal language rather than making assumptions
6. Output only the document text in markdown format - no explanations, commentary, or meta-text
7. Use proper markdown formatting: ## for main sections, ### for subsections, **bold** for emphasis
8. Ensure all user-provided values (names, dates, amounts, etc.) are accurately inserted in the correct locations
9. Maintain logical flow and structure throughout the document
10. Include standard legal clauses where appropriate for the document type

Your output must be a complete, ready-to-use legal document that can be directly exported or saved.`

/**
 * Legacy system message (kept for backward compatibility)
 * @deprecated Use SYSTEM_INSTRUCTIONS instead
 */
export const LEGAL_DOCUMENT_SYSTEM_MESSAGE = SYSTEM_INSTRUCTIONS
