# Legal Document Generation Pipeline

## Overview

All legal document generation in this application is handled exclusively through a standardized GPT-4 pipeline. This ensures consistent, high-quality output across all document types and generation workflows.

## Architecture

### Core Components

1. **`src/config/openai.ts`**
   - Centralized GPT-4 configuration
   - `SYSTEM_INSTRUCTIONS`: Standardized system message for all legal document generation
   - `OPENAI_MODEL`: Set to "gpt-4" (configurable via env var)
   - `OPENAI_SETTINGS`: Temperature (0.2) and max_tokens (4000)

2. **`src/lib/openai-client.ts`**
   - OpenAI client initialization
   - `generateWithGPT4()`: Low-level GPT-4 API wrapper
   - Handles authentication, quota errors, and API errors

3. **`src/lib/legal-document-generator.ts`** ⭐ **PRIMARY ENTRY POINT**
   - `generateLegalDocumentWithGPT4()`: Main function for all document generation
   - `buildLegalDocumentPrompt()`: Constructs standardized prompts
   - Combines template structure, user inputs, and instructions

4. **`src/app/api/generate/route.ts`**
   - API endpoint: `POST /api/generate`
   - Accepts: `{ contractId, values, templateCode? }`
   - Routes all requests through `generateLegalDocumentWithGPT4()`

## Document Generation Flow

```
User Action (Generate Document, Preview, etc.)
    ↓
Frontend calls /api/generate
    ↓
API route extracts template structure and user inputs
    ↓
generateLegalDocumentWithGPT4()
    ↓
buildLegalDocumentPrompt() - Creates standardized prompt
    ↓
generateWithGPT4() - Calls OpenAI API
    ↓
GPT-4 generates document
    ↓
Returns markdown document to frontend
```

## Standardized Prompt Structure

Every document generation uses this prompt structure:

```
You are GPT-4 and your task is to generate a legally-structured document.

Document Type: [Template Name]

Template Structure/Requirements:
[Template structure or requirements]

User Inputs:
[JSON of all user-provided form values]

Additional Clauses/Customizations:
[Any custom clauses if provided]

Instructions:
- Use the template structure as a base
- Insert all user inputs into correct positions
- Maintain legally coherent formatting
- Ensure proper clause order, spacing, paragraph breaks
- Use consistent numbering for sections
- Do not hallucinate missing details
- Keep tone professional and legally valid
- Produce final document only — no commentary
- Format in clean markdown with proper headers
- Use bold for important terms where appropriate
- Ensure all user values are accurately placed

[Additional Context if provided]

Now generate the complete legal document in markdown format.
```

## System Instructions

All GPT-4 calls use these standardized system instructions:

```
You are an expert legal document generator powered by GPT-4.

Your role is to create legally structured, coherent, and professional 
contracts and legal documents based strictly on user inputs and template 
requirements.

CRITICAL RULES:
1. Avoid offering legal advice; only structure documents
2. Use consistent formatting, spacing, paragraph breaks, clause numbering
3. Maintain professional legal language
4. Do not add information not provided by user
5. Use neutral, standard language for missing information
6. Output only document text — no explanations or commentary
7. Use proper markdown formatting
8. Accurately insert all user-provided values
9. Maintain logical flow and structure
10. Include standard legal clauses where appropriate
```

## Integration Points

All document generation workflows use the same pipeline:

### 1. Generate Document Button
- Location: `src/components/contract-form.tsx`
- Calls: `POST /api/generate`
- Uses: `generateLegalDocumentWithGPT4()`

### 2. Preview Document
- Location: `src/components/contract-form.tsx`
- Calls: `POST /api/generate`
- Uses: `generateLegalDocumentWithGPT4()`

### 3. Regenerate/Modify
- Location: `src/components/contract-form.tsx`
- Calls: `POST /api/generate`
- Uses: `generateLegalDocumentWithGPT4()`

### 4. Template Library → Use Template
- Location: Template pages
- Calls: `POST /api/generate`
- Uses: `generateLegalDocumentWithGPT4()`

### 5. Custom Template Creation
- Location: `src/app/templates/create/page.tsx`
- Template code execution → `POST /api/generate`
- Uses: `generateLegalDocumentWithGPT4()`

## Key Features

✅ **Single Source of Truth**: All document generation flows through `generateLegalDocumentWithGPT4()`

✅ **Consistent Prompts**: Standardized prompt structure ensures consistent output quality

✅ **User Input Integration**: All form values are properly formatted and included in prompts

✅ **Template Structure Support**: Templates can provide structure/requirements that GPT-4 follows

✅ **Customization Support**: Additional clauses and customizations can be added

✅ **Error Handling**: Comprehensive error handling for API failures, quota issues, etc.

✅ **No Model Selection**: GPT-4 is the only model used - no dropdowns, no fallbacks

## Configuration

### Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...

# Optional (defaults to gpt-4)
OPENAI_MODEL=gpt-4
```

### Model Settings

- **Model**: GPT-4 (configurable via `OPENAI_MODEL`)
- **Temperature**: 0.2 (for consistent, structured output)
- **Max Tokens**: 4000 (sufficient for most legal documents)

## Direct Document Detection

The system can detect if a template returns a complete document (not a prompt):

- Documents starting with `#` (markdown headers)
- Documents with `##` (section headers)
- Documents without "generate", "create", "requirements", or "instructions" keywords

If detected, the document is returned directly without GPT-4 processing.

## Future Enhancements

To add new document generation features:

1. Always use `generateLegalDocumentWithGPT4()` from `src/lib/legal-document-generator.ts`
2. Never bypass the standardized prompt structure
3. Always include user inputs and template structure
4. Maintain the system instructions in `src/config/openai.ts`

## Notes

- All legal documents are generated exclusively using GPT-4
- No other models (GPT-3.5, Claude, Gemini, etc.) are used
- All prompts follow the standardized structure
- System instructions ensure consistent, professional output
- The pipeline is designed to be maintainable and extensible






