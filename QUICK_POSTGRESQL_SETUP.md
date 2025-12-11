# Quick PostgreSQL Setup Guide

This is a quick-start guide for setting up PostgreSQL. For detailed instructions, see `POSTGRESQL_MIGRATION.md`.

## Option 1: Local PostgreSQL (Development)

### macOS
```bash
# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb contractvault

# Or using psql
psql postgres
CREATE DATABASE contractvault;
\q
```

### Linux
```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb contractvault
```

### Docker (Easiest)
```bash
# Run PostgreSQL in Docker
docker run --name postgres-contractvault \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=contractvault \
  -p 5432:5432 \
  -d postgres:15

# Connection string:
# postgresql://postgres:postgres@localhost:5432/contractvault?schema=public
```

## Option 2: Cloud Services (Production)

### Vercel Postgres (Recommended for Vercel deployments)
```bash
# Install Vercel CLI
npm i -g vercel

# Add Postgres addon
vercel addons create postgres

# Get connection string
vercel env pull .env.local
```

### Supabase (Free tier available)
1. Go to https://supabase.com
2. Create account and new project
3. Go to Settings → Database
4. Copy connection string
5. Add to `.env.local`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Neon (Serverless PostgreSQL)
1. Go to https://neon.tech
2. Create account and new project
3. Copy connection string
4. Add to `.env.local`

## Update Environment Variables

Add to `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/contractvault?schema=public"
```

Replace:
- `postgres` with your PostgreSQL username
- `password` with your PostgreSQL password
- `localhost:5432` with your host and port (if different)
- `contractvault` with your database name

## Run Migration

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name migrate_to_postgresql
```

## Verify

```bash
# Open Prisma Studio to view data
npx prisma studio

# Or test connection
npx prisma db pull
```

## Troubleshooting

**Can't connect?**
- Check PostgreSQL is running: `pg_isready` or `brew services list`
- Verify credentials in DATABASE_URL
- Check firewall/port (default: 5432)

**Migration fails?**
- Ensure database exists: `psql -l` to list databases
- Check user has permissions
- Try: `npx prisma migrate reset` (⚠️ deletes all data)

**Need help?**
See `POSTGRESQL_MIGRATION.md` for detailed instructions.




