# PostgreSQL Migration Guide

This guide will help you migrate from SQLite to PostgreSQL for production use.

## Why PostgreSQL?

- **Production-ready**: SQLite is not suitable for production web applications
- **Concurrent access**: PostgreSQL handles multiple simultaneous connections
- **Scalability**: Better performance under load
- **Features**: Advanced features like full-text search, JSON support, etc.
- **Reliability**: Better data integrity and transaction support

## Prerequisites

1. PostgreSQL installed locally (for development) or access to a PostgreSQL service (for production)
2. Backup of your current SQLite database (if you have existing data)
3. Updated Prisma schema (already done)

## Step 1: Install PostgreSQL

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Windows
Download and install from: https://www.postgresql.org/download/windows/

### Docker (Alternative)
```bash
docker run --name postgres-contractvault \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=contractvault \
  -p 5432:5432 \
  -d postgres:15
```

## Step 2: Create Database

### Using psql (Command Line)
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE contractvault;

# Create user (optional, for better security)
CREATE USER contractvault_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE contractvault TO contractvault_user;

# Exit psql
\q
```

### Using pgAdmin (GUI)
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `contractvault`
4. Click "Save"

## Step 3: Update Environment Variables

### Local Development (.env.local)
```env
# Replace SQLite URL with PostgreSQL URL
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/contractvault?schema=public"

# Or with a specific user:
DATABASE_URL="postgresql://contractvault_user:your_secure_password@localhost:5432/contractvault?schema=public"
```

### Production
Use your PostgreSQL service's connection string. Examples:

**Vercel Postgres:**
```env
DATABASE_URL="postgres://user:password@host:5432/dbname?sslmode=require"
```

**Supabase:**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**AWS RDS:**
```env
DATABASE_URL="postgresql://username:password@your-instance.region.rds.amazonaws.com:5432/contractvault"
```

## Step 4: Migrate Existing Data (If Applicable)

If you have existing data in SQLite, you'll need to export and import it.

### Option A: Manual Export/Import (Recommended for small datasets)

1. **Export from SQLite:**
```bash
# Install sqlite3 if not already installed
# macOS: brew install sqlite3
# Linux: sudo apt-get install sqlite3

# Export data to SQL
sqlite3 prisma/dev.db .dump > sqlite_dump.sql
```

2. **Convert SQLite SQL to PostgreSQL SQL:**
   - SQLite and PostgreSQL have some syntax differences
   - You may need to manually edit the SQL file
   - Or use a tool like `pgloader` (see Option B)

3. **Import to PostgreSQL:**
```bash
psql -U postgres -d contractvault -f converted_dump.sql
```

### Option B: Using pgloader (Recommended for larger datasets)

```bash
# Install pgloader
# macOS: brew install pgloader
# Linux: sudo apt-get install pgloader

# Migrate data
pgloader sqlite://prisma/dev.db postgresql://postgres:password@localhost:5432/contractvault
```

### Option C: Fresh Start (If no important data)

If you don't have important data, you can start fresh:
```bash
# Just run migrations - no data import needed
npx prisma migrate dev
```

## Step 5: Run Prisma Migrations

```bash
# Generate Prisma Client for PostgreSQL
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name migrate_to_postgresql

# Or if you want to start fresh:
npx prisma migrate reset
npx prisma migrate dev
```

## Step 6: Verify Migration

```bash
# Open Prisma Studio to verify data
npx prisma studio

# Or connect via psql
psql -U postgres -d contractvault
\dt  # List tables
SELECT COUNT(*) FROM "User";  # Check user count
```

## Step 7: Update Application Code (If Needed)

The Prisma schema has been updated. Most code should work without changes, but verify:

1. **Check for SQLite-specific queries:**
   - Search for `.db` file references
   - Check for SQLite-specific SQL syntax

2. **Test critical paths:**
   - User authentication
   - Document generation
   - Draft saving
   - Payment processing

## Production Deployment

### Vercel Postgres (Recommended for Vercel deployments)

1. **Install Vercel Postgres:**
```bash
vercel addons create postgres
```

2. **Get connection string:**
```bash
vercel env pull .env.local
```

3. **Deploy:**
```bash
vercel --prod
```

### Supabase (Free tier available)

1. Create account at https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Add to environment variables

### AWS RDS

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Get endpoint and credentials
4. Add to environment variables

### Other Services

- **Neon**: https://neon.tech (Serverless PostgreSQL)
- **Railway**: https://railway.app
- **Render**: https://render.com
- **DigitalOcean**: https://www.digitalocean.com/products/managed-databases

## Connection Pooling (Recommended for Production)

For production, use connection pooling to handle multiple connections efficiently.

### Using PgBouncer (Recommended)
```env
# Use pooled connection
DATABASE_URL="postgresql://user:pass@pgbouncer-host:6432/dbname?pgbouncer=true"
```

### Using Prisma's Connection Pooling
Prisma automatically handles connection pooling, but you can configure it:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname?connection_limit=10"
```

## Troubleshooting

### Connection Issues

**Error: "password authentication failed"**
- Check username and password
- Verify PostgreSQL is running: `pg_isready` or `brew services list`

**Error: "database does not exist"**
- Create the database: `CREATE DATABASE contractvault;`

**Error: "connection refused"**
- Check PostgreSQL is running
- Verify port (default: 5432)
- Check firewall settings

### Migration Issues

**Error: "relation already exists"**
- Database might have existing tables
- Use `npx prisma migrate reset` to start fresh (⚠️ deletes all data)

**Error: "column does not exist"**
- Run `npx prisma generate` to regenerate Prisma Client
- Check schema matches database

### Performance Issues

- Enable connection pooling
- Add database indexes (already in schema)
- Monitor slow queries
- Consider read replicas for high traffic

## Rollback Plan

If you need to rollback to SQLite:

1. **Backup PostgreSQL data:**
```bash
pg_dump -U postgres contractvault > backup.sql
```

2. **Revert schema:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

3. **Update DATABASE_URL:**
```env
DATABASE_URL="file:./dev.db"
```

4. **Run migrations:**
```bash
npx prisma migrate dev
```

## Next Steps

After migration:

1. ✅ Test all application features
2. ✅ Set up database backups
3. ✅ Configure monitoring
4. ✅ Set up connection pooling
5. ✅ Document production database credentials securely

## Support

- **Prisma Docs**: https://www.prisma.io/docs/guides/database/postgresql
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres

