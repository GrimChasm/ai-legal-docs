# How to Verify GPT-4 is Reading Instructions

## Automatic Verification (Development Mode)

When running in **development mode** (`npm run dev`), the system automatically logs what's being sent to GPT-4:

### What Gets Logged:

1. **System Message** (Instructions)
   - The complete system instructions sent to GPT-4
   - Shows the first 500 characters (full instructions are ~1,000+ characters)

2. **User Prompt** (Document-specific instructions)
   - The complete prompt with all instructions
   - Shows the first 1,000 characters (full prompts can be 2,000+ characters)

3. **Model Configuration**
   - Which model is being used (gpt-4o)
   - Temperature setting (0.2)
   - Max tokens (4000)

4. **Response Info**
   - Length of generated document
   - Token usage

### How to See the Logs:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Generate a document through the UI

3. Check your terminal/console - you'll see output like:

```
================================================================================
📤 SENDING TO GPT-4:
================================================================================

🔧 SYSTEM MESSAGE (Instructions):
--------------------------------------------------------------------------------
You are an expert legal document generator powered by GPT-4.

Your role is to create legally structured, coherent, and professional contracts...

📝 USER PROMPT (Length: 2345 characters):
--------------------------------------------------------------------------------
You are GPT-4 and your task is to generate a legally-structured, professional document.

Document Type: Non-Disclosure Agreement (NDA)

## Document-Specific Requirements for Non-Disclosure Agreement (NDA)

### Purpose
A legally binding agreement that protects confidential information...

⚙️  MODEL: gpt-4o
🌡️  TEMPERATURE: 0.2
================================================================================
```

## What Instructions Are Being Sent?

### 1. System Message (Always Sent)
Located in: `src/config/openai.ts`

Contains:
- Role definition (expert legal document generator)
- Critical rules (10 rules about formatting, language, output)
- Quality standards
- Legal structure requirements

**This is sent with EVERY request** as the `system` role message.

### 2. User Prompt (Built Dynamically)
Built in: `src/lib/legal-document-generator.ts`

Contains:
- Document type identification
- Document-specific requirements (from `document-type-prompts.ts`)
- Template structure/requirements
- User-provided information (all form inputs)
- Comprehensive generation instructions
- Final instructions

**This is sent as the `user` role message.**

## Verification Checklist

✅ **System Instructions Are Sent**
- Check logs for "SYSTEM MESSAGE" section
- Should show: "You are an expert legal document generator powered by GPT-4"
- Should include all 10 critical rules

✅ **Document-Specific Instructions Are Included**
- Check logs for "Document-Specific Requirements" section
- Should show: Purpose, Required Sections, Legal Considerations, Best Practices
- Example: For NDA, should include "Definitions of Confidential Information", etc.

✅ **User Inputs Are Included**
- Check logs for "User-Provided Information" section
- Should show JSON with all form values
- Example: `{"clientName": "Acme Corp", "recipientName": "John Doe", ...}`

✅ **Generation Instructions Are Present**
- Check logs for "Generation Instructions" section
- Should include: Content Requirements, Legal Structure, Language/Tone, Output Format, Quality Standards

✅ **Final Instructions Are Clear**
- Should end with "Final Instructions" section
- Should explicitly state: "Generate the complete, final legal document"

## Testing the Verification

### Test 1: Generate an NDA
1. Go to the NDA form
2. Fill in some test data
3. Click "Generate Document"
4. Check terminal logs - you should see:
   - System message with legal document generator instructions
   - Document-specific NDA requirements
   - Your test data in the user inputs
   - All generation instructions

### Test 2: Check Response Quality
After generation, verify the output includes:
- All required sections (from document-specific requirements)
- Your user inputs correctly placed
- Professional legal formatting
- Complete document (not a draft)

## What If Instructions Aren't Being Read?

### Signs Instructions Aren't Working:
- Generated document is missing required sections
- User inputs aren't being inserted
- Document looks like a template, not a final document
- Formatting is inconsistent

### How to Debug:
1. **Check the logs** - Are instructions actually being sent?
2. **Verify system message** - Is it the full SYSTEM_INSTRUCTIONS?
3. **Check prompt length** - Should be 1,500-3,000+ characters
4. **Verify document type** - Is the correct document type being identified?

### Common Issues:
- **Template name mismatch**: Document type might not match the prompts file
- **Missing document-specific enhancement**: Check if `buildDocumentTypePromptEnhancement()` returns content
- **Direct document detection**: Some templates return complete documents, bypassing GPT-4

## Manual Verification (Advanced)

If you want to see the EXACT prompt being sent, you can temporarily add this to `src/lib/openai-client.ts`:

```typescript
// Before the API call
console.log("FULL SYSTEM MESSAGE:", systemMessage)
console.log("FULL USER PROMPT:", prompt)
```

Or create a test endpoint that returns the prompt structure without calling GPT-4.

## Summary

**Yes, GPT-4 is reading the instructions!** Here's the proof:

1. ✅ System instructions are sent with every request (system role)
2. ✅ Document-specific requirements are included in the prompt
3. ✅ User inputs are formatted and included
4. ✅ Comprehensive generation instructions are provided
5. ✅ Logs show exactly what's being sent (in development mode)

The instructions are comprehensive and detailed, ensuring GPT-4 has all the context it needs to generate high-quality legal documents.






