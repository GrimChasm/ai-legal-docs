# AI Model Configuration

## Overview

This application **exclusively uses OpenAI GPT-4** for all AI functionality, including:
- Document generation
- Template code generation
- Document analysis and explanations
- All AI-driven features

## Required Configuration

### OpenAI API Key (Required)

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4  # Optional, defaults to gpt-4
   ```

## Model Configuration

The model is configured in `src/config/openai.ts`:

```typescript
export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4"
export const OPENAI_SETTINGS = {
  model: OPENAI_MODEL,
  temperature: 0.2,
  max_tokens: 4000,
}
```

To change the model (e.g., to use a different GPT-4 variant), update `OPENAI_MODEL` in your `.env.local` file or modify the default in `src/config/openai.ts`.

## Why GPT-4?

GPT-4 provides:
- High-quality legal document generation
- Consistent, professional output
- Reliable API with excellent uptime
- Strong understanding of legal terminology and structure

## Troubleshooting

### API Key Errors
- Ensure `OPENAI_API_KEY` is set in `.env.local`
- Verify the key is valid at https://platform.openai.com/api-keys
- Check that your OpenAI account has sufficient credits

### Quota Exceeded
- Check your billing at https://platform.openai.com/account/billing
- Ensure your account has available credits
- Consider upgrading your OpenAI plan if needed
