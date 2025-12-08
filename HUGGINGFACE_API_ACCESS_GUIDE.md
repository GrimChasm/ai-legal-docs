# HuggingFace API Access Guide

## Understanding HuggingFace Model Access

### Free Models
Some models are available through the free API endpoints:
- `meta-llama/Llama-2-7b-chat-hf` ✅ (Recommended)
- Many smaller models

### Gated Models
Some models require:
1. Accepting the model's terms of use on HuggingFace
2. Requesting access (may take time to approve)
3. Using a "read" or "write" access token

### Large Models
Very large models (like DeepSeek-V3.2) may require:
- Paid Inference Endpoints
- Not available through free router endpoint

## Getting Access

### Step 1: Create HuggingFace Account
1. Go to https://huggingface.co/join
2. Create an account

### Step 2: Get API Token
1. Go to https://huggingface.co/settings/tokens
2. Create a new token
3. Choose "read" or "write" access
4. Copy the token

### Step 3: Accept Model Terms (if needed)
1. Visit the model page (e.g., https://huggingface.co/meta-llama/Llama-2-7b-chat-hf)
2. Accept the terms of use
3. Request access if required

### Step 4: Configure
Add to `.env.local`:
```env
HUGGINGFACE_API_KEY=hf_...
HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf
```

## Recommended Model

**`meta-llama/Llama-2-7b-chat-hf`**
- ✅ Works reliably on free endpoints
- ✅ Good quality for legal documents
- ✅ No special access required (for most users)
- ✅ Fast response times

## Troubleshooting

If you get "model not found" errors:
1. Verify the model name is correct
2. Check if the model requires special access
3. Try `meta-llama/Llama-2-7b-chat-hf` as a fallback
4. Consider using Google Gemini as an alternative

## Links

- HuggingFace Models: https://huggingface.co/models
- API Tokens: https://huggingface.co/settings/tokens
- Inference Endpoints: https://huggingface.co/pricing

