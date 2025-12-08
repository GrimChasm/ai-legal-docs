# Free AI Options for Legal Document Generation

## Google Gemini (Recommended for Free Tier)

### Setup
1. Get API key from https://makersuite.google.com/app/apikey
2. Add to `.env.local`:
   ```
   GEMINI_API_KEY=...
   ```

### Models Available
- `gemini-1.5-flash` - Fast, free tier
- `gemini-1.5-pro` - Higher quality, free tier

### Usage
Select "Google Gemini" in the AI model selector dropdown.

## HuggingFace

### Setup
1. Get API token from https://huggingface.co/settings/tokens
2. Create a "read" or "write" access token
3. Add to `.env.local`:
   ```
   HUGGINGFACE_API_KEY=hf_...
   HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf
   ```

### Recommended Models
- `meta-llama/Llama-2-7b-chat-hf` - Reliable, works on free endpoints

### Limitations
- Some models require paid Inference Endpoints
- Large models may not be available on free router endpoint
- Response times may be slower than paid APIs

### Usage
Select "HuggingFace" in the AI model selector dropdown.

## Comparison

| Provider | Free Tier | Quality | Speed | Reliability |
|----------|-----------|---------|-------|-------------|
| Google Gemini | ✅ Yes | Good | Fast | Good |
| HuggingFace | ✅ Yes | Good | Moderate | Moderate |

## Recommendation

For free usage, we recommend **Google Gemini** as it provides the best balance of quality, speed, and reliability on the free tier.

