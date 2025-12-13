# OpenAI Model Setup Guide

## Quick Fix for "Model does not exist" Error

If you're getting a `404 The model 'gpt-4' does not exist or you do not have access to it` error, follow these steps:

### Option 1: Use GPT-4o (Recommended - Most Accessible)

Add to your `.env.local` file:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
```

`gpt-4o` is the newer, optimized GPT-4 model that's more widely accessible and often faster.

### Option 2: Use GPT-4o-mini (Budget-Friendly)

If you want a cheaper option:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

This is a smaller, faster, and more cost-effective GPT-4 variant that still provides excellent quality.

### Option 3: Use GPT-4 Turbo

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo
```

## Available GPT-4 Models

| Model | Description | Access Level |
|-------|-------------|--------------|
| `gpt-4o` | GPT-4 Optimized (recommended) | Most accessible |
| `gpt-4o-mini` | Smaller GPT-4 variant | Most accessible, cheaper |
| `gpt-4-turbo` | GPT-4 Turbo version | Widely available |
| `gpt-4` | Base GPT-4 | May require special access |
| `gpt-4-0613` | Specific GPT-4 version | May require special access |

## Troubleshooting

### 1. Check Your OpenAI Account

- Ensure billing is enabled: https://platform.openai.com/account/billing
- Verify you have credits or a payment method on file
- Some models require a minimum payment history

### 2. Verify API Key Access

- Generate a new API key at: https://platform.openai.com/api-keys
- Ensure the key has access to GPT-4 models
- Check your API usage limits

### 3. Check Available Models

Visit https://platform.openai.com/docs/models to see which models your account can access.

### 4. Test Your Configuration

After updating your `.env.local` file:

1. Restart your development server
2. Try generating a document
3. Check the console for any error messages

## Default Configuration

The application defaults to `gpt-4o` if no `OPENAI_MODEL` is specified. This is the most accessible GPT-4 model.

## Model Comparison

### gpt-4o (Recommended)
- ✅ Most accessible
- ✅ Fast response times
- ✅ High quality output
- ✅ Good for legal documents

### gpt-4o-mini
- ✅ Very accessible
- ✅ Fast and cheap
- ✅ Good quality for most use cases
- ⚠️ Slightly less capable than gpt-4o

### gpt-4-turbo
- ✅ Widely available
- ✅ Good performance
- ⚠️ May be slower than gpt-4o

### gpt-4
- ⚠️ May require special access
- ⚠️ Can be slower
- ✅ Original GPT-4 model

## Need Help?

If you continue to have issues:

1. Check the error message - it will suggest alternative models
2. Verify your OpenAI account status
3. Try using `gpt-4o` or `gpt-4o-mini` first
4. Check OpenAI's status page: https://status.openai.com/







