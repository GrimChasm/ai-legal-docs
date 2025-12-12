#!/usr/bin/env node

/**
 * Quick NextAuth Configuration Test
 * Tests if NextAuth is properly configured
 */

console.log('🔍 Testing NextAuth Configuration...\n');

// Check environment variables
const required = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'DATABASE_URL'];
const missing = [];

required.forEach(key => {
  if (process.env[key]) {
    console.log(`✅ ${key}: Set`);
  } else {
    console.log(`❌ ${key}: MISSING`);
    missing.push(key);
  }
});

// Check if auth files exist
const fs = require('fs');
const path = require('path');

const files = [
  'src/lib/auth.ts',
  'src/lib/auth-helper.ts',
  'src/app/api/auth/[...nextauth]/route.ts',
  'src/components/providers.tsx',
  'src/types/next-auth.d.ts'
];

console.log('\n📁 Checking Required Files:');
files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}: NOT FOUND`);
  }
});

// Check if Providers is used in layout
const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  if (layoutContent.includes('Providers') && layoutContent.includes('SessionProvider')) {
    console.log('\n✅ SessionProvider is wrapped in app layout');
  } else {
    console.log('\n⚠️  SessionProvider might not be properly set up in layout');
  }
}

console.log('\n' + '='.repeat(50));
if (missing.length === 0) {
  console.log('✅ NextAuth appears to be properly configured!');
  console.log('\nTo fully test:');
  console.log('1. Start server: npm run dev');
  console.log('2. Try logging in at /auth/signin');
  console.log('3. Check if session persists');
} else {
  console.log('⚠️  Some environment variables are missing');
  console.log('   Add them to your .env.local file');
}
console.log('='.repeat(50));
