#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * 
 * Checks if required environment variables are set correctly
 * for the send for signature system.
 * 
 * Usage: node scripts/verify-env.js
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env');
  
  // Check if .env.local exists
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local file not found!', 'red');
    log('   Create it in the project root directory.', 'yellow');
    return false;
  }
  
  log('✅ .env.local file exists', 'green');
  
  // Read and parse .env.local
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  const vars = {};
  let hasErrors = false;
  
  // Parse variables
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }
    
    // Check for format issues
    if (trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const keyTrimmed = key.trim();
      const value = valueParts.join('=').trim();
      
      // Remove quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, '');
      
      vars[keyTrimmed] = cleanValue;
      
      // Check for common issues
      if (key.includes(' ') || value.includes(' ') && !value.startsWith('"') && !value.startsWith("'")) {
        log(`⚠️  Line ${index + 1}: Spaces around = sign (might be OK if quoted)`, 'yellow');
      }
    } else {
      log(`⚠️  Line ${index + 1}: No = sign found, skipping: ${trimmed.substring(0, 50)}`, 'yellow');
    }
  });
  
  log(`\n📋 Found ${Object.keys(vars).length} environment variables\n`, 'cyan');
  
  // Check required variables
  const required = {
    'NEXTAUTH_URL': {
      required: true,
      description: 'Base URL for signing links (REQUIRED for signature system)',
      validate: (val) => {
        if (!val) return 'Missing value';
        if (val.endsWith('/')) return 'Should not have trailing slash';
        if (!val.startsWith('http://') && !val.startsWith('https://')) {
          return 'Should start with http:// or https://';
        }
        return null;
      }
    },
    'DATABASE_URL': {
      required: true,
      description: 'Database connection string',
      validate: (val) => {
        if (!val) return 'Missing value';
        if (val === 'undefined') return 'Value is "undefined" (likely not set)';
        return null;
      }
    },
    'NEXTAUTH_SECRET': {
      required: true,
      description: 'NextAuth secret key',
      validate: (val) => {
        if (!val) return 'Missing value';
        if (val.length < 16) return 'Should be at least 16 characters';
        return null;
      }
    },
    'OPENAI_API_KEY': {
      required: true,
      description: 'OpenAI API key',
      validate: (val) => {
        if (!val) return 'Missing value';
        if (!val.startsWith('sk-')) return 'Should start with "sk-"';
        return null;
      }
    }
  };
  
  // Check optional but important variables
  const optional = {
    'RESEND_API_KEY': {
      description: 'Resend API key (for email)',
      validate: (val) => {
        if (val && !val.startsWith('re_')) {
          return 'Should start with "re_"';
        }
        return null;
      }
    },
    'SMTP_HOST': {
      description: 'SMTP host (alternative to Resend)',
    },
    'SMTP_USER': {
      description: 'SMTP username',
    },
    'SMTP_PASS': {
      description: 'SMTP password',
    },
    'EMAIL_FROM': {
      description: 'Email "from" address',
    }
  };
  
  log('🔍 Checking Required Variables:\n', 'blue');
  
  let allRequiredPresent = true;
  
  Object.entries(required).forEach(([key, config]) => {
    const value = vars[key];
    const altKey = key === 'NEXTAUTH_SECRET' ? 'AUTH_SECRET' : null;
    const altValue = altKey ? vars[altKey] : null;
    const actualValue = value || altValue;
    
    if (!actualValue) {
      log(`❌ ${key}: MISSING`, 'red');
      log(`   ${config.description}`, 'yellow');
      if (altKey) {
        log(`   (Also checking ${altKey}...)`, 'yellow');
      }
      allRequiredPresent = false;
    } else {
      const error = config.validate ? config.validate(actualValue) : null;
      if (error) {
        log(`⚠️  ${key}: ${error}`, 'yellow');
        log(`   Current value: ${actualValue.substring(0, 20)}...`, 'yellow');
      } else {
        log(`✅ ${key}: OK`, 'green');
        if (key === 'NEXTAUTH_URL') {
          log(`   Value: ${actualValue}`, 'cyan');
        }
      }
    }
  });
  
  log('\n📧 Checking Email Configuration:\n', 'blue');
  
  const hasResend = !!vars.RESEND_API_KEY;
  const hasSMTP = !!(vars.SMTP_HOST && vars.SMTP_USER && vars.SMTP_PASS);
  
  if (hasResend) {
    const error = optional.RESEND_API_KEY.validate(vars.RESEND_API_KEY);
    if (error) {
      log(`⚠️  RESEND_API_KEY: ${error}`, 'yellow');
    } else {
      log(`✅ Resend configured`, 'green');
      if (vars.EMAIL_FROM) {
        log(`   From: ${vars.EMAIL_FROM}`, 'cyan');
      }
    }
  } else if (hasSMTP) {
    log(`✅ SMTP configured`, 'green');
    log(`   Host: ${vars.SMTP_HOST}`, 'cyan');
    log(`   Port: ${vars.SMTP_PORT || '587'}`, 'cyan');
    if (vars.EMAIL_FROM) {
      log(`   From: ${vars.EMAIL_FROM}`, 'cyan');
    }
  } else {
    log(`⚠️  No email service configured`, 'yellow');
    log(`   Signature system will work, but emails won't be sent automatically.`, 'yellow');
    log(`   You'll need to manually share signing URLs.`, 'yellow');
  }
  
  // Check for signature-specific issues
  log('\n🔐 Signature System Check:\n', 'blue');
  
  if (vars.NEXTAUTH_URL) {
    log(`✅ NEXTAUTH_URL is set: ${vars.NEXTAUTH_URL}`, 'green');
    log(`   Signing URLs will use this base URL.`, 'cyan');
  } else {
    log(`❌ NEXTAUTH_URL is missing!`, 'red');
    log(`   Signature system will NOT work correctly.`, 'red');
    log(`   Add: NEXTAUTH_URL=http://localhost:3000`, 'yellow');
  }
  
  // Summary
  log('\n' + '='.repeat(50), 'cyan');
  if (allRequiredPresent && vars.NEXTAUTH_URL) {
    log('✅ All required variables are present!', 'green');
    log('   Your .env.local file looks good for the signature system.', 'green');
  } else {
    log('⚠️  Some required variables are missing or incorrect.', 'yellow');
    log('   Please fix the issues above.', 'yellow');
  }
  log('='.repeat(50) + '\n', 'cyan');
  
  return allRequiredPresent && !!vars.NEXTAUTH_URL;
}

// Run the check
try {
  const isValid = checkEnvFile();
  process.exit(isValid ? 0 : 1);
} catch (error) {
  log(`❌ Error checking .env.local: ${error.message}`, 'red');
  process.exit(1);
}



