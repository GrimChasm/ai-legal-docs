#!/bin/bash

# PostgreSQL Migration Script
# This script helps migrate from SQLite to PostgreSQL

set -e  # Exit on error

echo "🚀 PostgreSQL Migration Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL environment variable is not set${NC}"
    echo ""
    echo "Please set DATABASE_URL in your .env.local file:"
    echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/contractvault?schema=public\""
    exit 1
fi

# Check if PostgreSQL connection string
if [[ ! "$DATABASE_URL" == postgresql://* ]] && [[ ! "$DATABASE_URL" == postgres://* ]]; then
    echo -e "${RED}❌ Error: DATABASE_URL does not appear to be a PostgreSQL connection string${NC}"
    echo "Current DATABASE_URL: $DATABASE_URL"
    echo ""
    echo "Please update DATABASE_URL to use PostgreSQL format:"
    echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/contractvault?schema=public\""
    exit 1
fi

echo -e "${GREEN}✓ DATABASE_URL is set${NC}"
echo ""

# Check if SQLite database exists
if [ -f "prisma/dev.db" ]; then
    echo -e "${YELLOW}⚠️  SQLite database found at prisma/dev.db${NC}"
    echo ""
    read -p "Do you want to export data from SQLite? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Exporting SQLite data..."
        
        # Check if sqlite3 is installed
        if ! command -v sqlite3 &> /dev/null; then
            echo -e "${RED}❌ sqlite3 is not installed${NC}"
            echo "Install it with:"
            echo "  macOS: brew install sqlite3"
            echo "  Linux: sudo apt-get install sqlite3"
            exit 1
        fi
        
        # Export SQLite data
        sqlite3 prisma/dev.db .dump > sqlite_dump.sql
        echo -e "${GREEN}✓ Data exported to sqlite_dump.sql${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  Note: You'll need to manually convert this SQL for PostgreSQL${NC}"
        echo "   Or use pgloader: pgloader sqlite://prisma/dev.db $DATABASE_URL"
    fi
else
    echo -e "${GREEN}✓ No SQLite database found - starting fresh${NC}"
fi

echo ""
echo "🔄 Generating Prisma Client..."
npx prisma generate

echo ""
echo "📊 Running Prisma migrations..."
read -p "Do you want to create a new migration? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma migrate dev --name migrate_to_postgresql
else
    echo "Applying existing migrations..."
    npx prisma migrate deploy
fi

echo ""
echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Test your application: npm run dev"
echo "2. Verify data: npx prisma studio"
echo "3. Check the logs for any errors"
echo ""





