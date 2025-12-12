#!/usr/bin/env node

/**
 * Test Email Configuration
 * 
 * Tests if email service is properly configured and can send emails
 */

// Try to load .env.local if dotenv is available
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, that's OK - env vars should be in environment
  console.log('Note: dotenv not found, using environment variables directly\n');
}

async function testResend() {
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not found in environment');
    return false;
  }

  console.log('✅ RESEND_API_KEY found');
  console.log(`   Key starts with: ${process.env.RESEND_API_KEY.substring(0, 5)}...`);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "ContractVault <onboarding@resend.dev>",
        to: ["test@example.com"], // Test email (won't actually send)
        subject: "Test Email",
        html: "<p>This is a test email</p>",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Resend API connection successful!');
      console.log(`   Response:`, data);
      return true;
    } else {
      console.log('❌ Resend API error:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error:`, data);
      
      // Common errors
      if (data.message?.includes('Invalid API key')) {
        console.log('\n💡 Fix: Your RESEND_API_KEY is invalid. Get a new one from https://resend.com/api-keys');
      } else if (data.message?.includes('domain')) {
        console.log('\n💡 Fix: Your EMAIL_FROM domain is not verified in Resend. Use onboarding@resend.dev for testing.');
      } else if (data.message?.includes('rate limit')) {
        console.log('\n💡 Fix: You\'ve hit Resend\'s rate limit. Wait a bit and try again.');
      }
      
      return false;
    }
  } catch (error) {
    console.log('❌ Error connecting to Resend API:');
    console.log(`   ${error.message}`);
    return false;
  }
}

async function testSMTP() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ SMTP configuration incomplete');
    return false;
  }

  console.log('✅ SMTP configuration found');
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT || '587'}`);
  console.log(`   User: ${process.env.SMTP_USER}`);

  try {
    const nodemailer = await import("nodemailer");
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    return true;
  } catch (error) {
    console.log('❌ SMTP connection failed:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Fix: Check SMTP_HOST and SMTP_PORT are correct');
    } else if (error.message.includes('Invalid login')) {
      console.log('\n💡 Fix: Check SMTP_USER and SMTP_PASS are correct');
    } else if (error.message.includes('Cannot find module')) {
      console.log('\n💡 Fix: Install nodemailer: npm install nodemailer');
    }
    
    return false;
  }
}

async function main() {
  console.log('🧪 Testing Email Configuration\n');
  console.log('='.repeat(50));

  const hasResend = !!process.env.RESEND_API_KEY;
  const hasSMTP = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!hasResend && !hasSMTP) {
    console.log('❌ No email service configured');
    console.log('\nTo configure:');
    console.log('1. Resend (recommended): Add RESEND_API_KEY to .env.local');
    console.log('2. SMTP: Add SMTP_HOST, SMTP_USER, SMTP_PASS to .env.local');
    process.exit(1);
  }

  let success = false;

  if (hasResend) {
    console.log('\n📧 Testing Resend...');
    success = await testResend();
  }

  if (hasSMTP && !success) {
    console.log('\n📧 Testing SMTP...');
    success = await testSMTP();
  }

  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('✅ Email service is configured and working!');
  } else {
    console.log('❌ Email service test failed. Check the errors above.');
    console.log('\nCommon issues:');
    console.log('- Invalid API key (for Resend)');
    console.log('- Unverified domain (for Resend)');
    console.log('- Wrong SMTP credentials');
    console.log('- Server not restarted after adding env vars');
  }
  console.log('='.repeat(50));
}

main().catch(console.error);

