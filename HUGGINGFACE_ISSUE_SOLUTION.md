# HuggingFace Issue Solution

## Problem

Many HuggingFace models are not available through the free API endpoints. You may encounter errors like:
- "Model not found"
- "404 Not Found"
- "Model requires paid Inference Endpoints"

## Solution

### Option 1: Use Recommended Model (Free)
Use `meta-llama/Llama-2-7b-chat-hf` which works reliably on free endpoints:

```env
HUGGINGFACE_API_KEY=hf_...
HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf
```

### Option 2: Use Google Gemini (Free Alternative)
Google Gemini provides a better free tier experience:

1. Get API key from https://makersuite.google.com/app/apikey
2. Add to `.env.local`:
   ```
   GEMINI_API_KEY=...
   ```
3. Select "Google Gemini" in the model selector

### Option 3: Use Paid Inference Endpoints
For larger models, you may need to:
1. Set up a paid Inference Endpoint on HuggingFace
2. Use the endpoint URL instead of the model name
3. This requires a paid HuggingFace subscription

## Why This Happens

- Free API endpoints have limitations
- Large models require significant compute resources
- Some models are gated and require approval
- Router endpoint may not support all models

## Recommendation

For free usage, we recommend:
1. **Google Gemini** - Best free tier experience
2. **meta-llama/Llama-2-7b-chat-hf** - Reliable HuggingFace option

For paid usage:
- **OpenAI GPT-4o** - Best overall quality
- **Claude 3.5 Sonnet** - Premium quality for complex documents

