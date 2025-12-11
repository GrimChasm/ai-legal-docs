# Environment Variables Setup Guide

## Required API Keys

Copy `.env.example` to `.env.local` and fill in your API keys:

```env
# Database
# For development with SQLite (not recommended for production):
# DATABASE_URL="file:./dev.db"
# For production with PostgreSQL (recommended):
DATABASE_URL="postgresql://user:password@localhost:5432/contractvault?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI (Required)
# This application exclusively uses OpenAI GPT-4 for all AI functionality
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4  # Optional, defaults to gpt-4

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

### OpenAI (Required)
1. Visit https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy to `OPENAI_API_KEY`
4. Optionally set `OPENAI_MODEL=gpt-4` (this is the default)

### NextAuth Secret
Generate a random string:
```bash
openssl rand -base64 32
```

## Required Configuration

**You must configure `OPENAI_API_KEY`** for the application to function. This application exclusively uses OpenAI GPT-4 for all AI-related functionality.

## Database Setup

### Development (SQLite - Quick Start)
For quick local development, you can use SQLite:
```env
DATABASE_URL="file:./dev.db"
```

### Production (PostgreSQL - Required)
For production, you **must** use PostgreSQL. See `POSTGRESQL_MIGRATION.md` for detailed instructions.

Quick setup:
1. Install PostgreSQL locally or use a cloud service
2. Create a database: `CREATE DATABASE contractvault;`
3. Update DATABASE_URL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/contractvault?schema=public"
```

**Recommended PostgreSQL Services:**
- **Vercel Postgres** (if deploying to Vercel)
- **Supabase** (free tier available)
- **Neon** (serverless PostgreSQL)
- **AWS RDS** (enterprise-grade)

## Testing

After setting up, test your configuration:
1. Start the dev server: `npm run dev`
2. Try generating a document
3. Check the console for any API key errors
4. Verify database connection: `npx prisma studio`
