# Environment Variables Setup Guide

## Required API Keys

Copy `.env.example` to `.env.local` and fill in your API keys:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI (Optional but recommended)
OPENAI_API_KEY=sk-...

# Anthropic / Claude (Optional, for premium quality)
ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini (Optional, free tier available)
GEMINI_API_KEY=...

# HuggingFace (Optional, free tier available)
HUGGINGFACE_API_KEY=hf_...
HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf

# DocuSign (Optional, for e-signatures)
DOCUSIGN_INTEGRATION_KEY=...
DOCUSIGN_USER_ID=...
DOCUSIGN_ACCOUNT_ID=...
DOCUSIGN_RSA_PRIVATE_KEY=...
DOCUSIGN_API_BASE_URL=https://demo.docusign.net/restapi

# HelloSign (Optional, for e-signatures)
HELLOSIGN_API_KEY=...
```

## Getting API Keys

### OpenAI
1. Visit https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy to `OPENAI_API_KEY`

### Anthropic (Claude)
1. Visit https://console.anthropic.com/
2. Create an API key
3. Copy to `ANTHROPIC_API_KEY`

### Google Gemini
1. Visit https://makersuite.google.com/app/apikey
2. Create an API key
3. Copy to `GEMINI_API_KEY`

### HuggingFace
1. Visit https://huggingface.co/settings/tokens
2. Create a "read" or "write" access token
3. Copy to `HUGGINGFACE_API_KEY`
4. Set `HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf`

### NextAuth Secret
Generate a random string:
```bash
openssl rand -base64 32
```

## Minimum Required

At minimum, you need one AI API key:
- `OPENAI_API_KEY` OR
- `GEMINI_API_KEY` OR
- `HUGGINGFACE_API_KEY`

The system will automatically use the best available option.

## Testing

After setting up, test your configuration:
1. Start the dev server: `npm run dev`
2. Try generating a document
3. Check the console for any API key errors

