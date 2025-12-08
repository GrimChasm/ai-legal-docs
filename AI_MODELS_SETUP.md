# AI Models Setup Guide

## Required API Keys

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ```

### Anthropic (Claude)
1. Go to https://console.anthropic.com/
2. Create an API key
3. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

### Google Gemini
1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Add to `.env.local`:
   ```
   GEMINI_API_KEY=...
   ```

### HuggingFace
1. Go to https://huggingface.co/settings/tokens
2. Create a "read" or "write" access token
3. Add to `.env.local`:
   ```
   HUGGINGFACE_API_KEY=hf_...
   HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf
   ```

## Model Selection

The system automatically selects the best available model based on:
1. User preference (if specified)
2. Document complexity
3. Available API keys
4. Fallback chain: GPT-4o Mini → Gemini → HuggingFace

