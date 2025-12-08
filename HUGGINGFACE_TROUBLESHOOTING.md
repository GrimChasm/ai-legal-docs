# HuggingFace Troubleshooting Guide

## Common Issues

### 1. Model Not Found (404 Error)

**Error**: `HuggingFace model "model-name" not found`

**Solutions**:
- Use a verified working model: `meta-llama/Llama-2-7b-chat-hf`
- Check model availability at https://huggingface.co/models
- Some models require paid Inference Endpoints

**Recommended Model**: `meta-llama/Llama-2-7b-chat-hf`

### 2. Model Loading (503 Error)

**Error**: Model is loading

**Solution**: The system automatically retries after a delay. Wait a few moments and try again.

### 3. Authentication Failed (401/403 Error)

**Error**: `HuggingFace API authentication failed`

**Solutions**:
- Verify your API token at https://huggingface.co/settings/tokens
- Ensure you're using a "read" or "write" access token
- Check that `HUGGINGFACE_API_KEY` is correctly set in `.env.local`

### 4. Endpoint Deprecated

**Error**: `https://api-inference.huggingface.co is no longer supported`

**Solution**: The system automatically tries both endpoints:
- `https://api-inference.huggingface.co` (legacy)
- `https://router.huggingface.co` (current)

### 5. Large Models Not Available

**Error**: Model not available through router endpoint

**Solution**: Very large models (like DeepSeek-V3.2) may require paid Inference Endpoints. Use `meta-llama/Llama-2-7b-chat-hf` instead.

## Recommended Configuration

```env
HUGGINGFACE_API_KEY=hf_...
HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf
```

## Alternative Models

If the default model doesn't work, try:
- `meta-llama/Llama-2-7b-chat-hf` (recommended)
- Visit https://huggingface.co/models to find other available text generation models

## Getting Help

1. Check model status at https://huggingface.co/models
2. Verify API token permissions
3. Consider using Google Gemini as an alternative free option

