# OpenAI Quota Error Solution

## Problem
You may encounter quota errors when using OpenAI:
```
OpenAI quota exceeded. Please check your billing at https://platform.openai.com/account/billing
```

## Solutions

### Option 1: Add Anthropic API Key (Recommended)
1. Get an API key from https://console.anthropic.com/
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. The system will automatically fallback to Claude when OpenAI quota is exceeded

### Option 2: Use Google Gemini (Free)
1. Get an API key from https://makersuite.google.com/app/apikey
2. Add to `.env.local`:
   ```
   GEMINI_API_KEY=...
   ```
3. Select "Google Gemini" in the model selector

### Option 3: Use HuggingFace (Free)
1. Get an API key from https://huggingface.co/settings/tokens
2. Add to `.env.local`:
   ```
   HUGGINGFACE_API_KEY=hf_...
   HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf
   ```
3. Select "HuggingFace" in the model selector

### Option 4: Increase OpenAI Quota
1. Go to https://platform.openai.com/account/billing
2. Add payment method
3. Increase usage limits

## Automatic Fallback

The system automatically tries alternative models if the primary model fails, so you don't need to manually switch.

