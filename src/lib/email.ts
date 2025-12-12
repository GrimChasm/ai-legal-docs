/**
 * Email Service
 * 
 * Handles sending emails for signature invites and notifications.
 * 
 * To use Resend (recommended):
 * 1. Sign up at https://resend.com
 * 2. Get your API key
 * 3. Add RESEND_API_KEY to your .env file
 * 
 * To use Nodemailer (alternative):
 * 1. Configure SMTP settings in .env
 * 2. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 * 
 * For development, emails will be logged to console if no service is configured.
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

/**
 * Send email using configured service
 * Falls back to console logging in development if no service is configured
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html, from } = options

  // Try Resend first (recommended)
  if (process.env.RESEND_API_KEY) {
    try {
      const emailFrom = from || process.env.EMAIL_FROM || "ContractVault <noreply@contractvault.com>"
      
      console.log("Attempting to send email via Resend...")
      console.log("From:", emailFrom)
      console.log("To:", to)
      console.log("Subject:", subject)
      
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [to],
          subject,
          html,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Email sent successfully via Resend")
        console.log("   Email ID:", data.id)
        return true
      } else {
        const error = await response.json().catch(() => ({ message: "Unknown error" }))
        console.error("❌ Resend API error:")
        console.error("   Status:", response.status)
        console.error("   Error:", JSON.stringify(error, null, 2))
        
        // Provide helpful error messages
        if (error.message?.includes("Invalid API key") || response.status === 401) {
          console.error("   💡 Fix: Check your RESEND_API_KEY is correct")
        } else if (error.message?.includes("testing emails") || error.message?.includes("verify a domain")) {
          console.error("   💡 Fix: Resend test mode only allows sending to your account email")
          console.error("      Option 1: Send test emails to juveellis@gmail.com")
          console.error("      Option 2: Verify a domain at https://resend.com/domains")
          console.error("      Option 3: Use onboarding@resend.dev (still limited to verified emails)")
        } else if (error.message?.includes("domain") || error.message?.includes("not verified")) {
          console.error("   💡 Fix: Verify your domain in Resend or use onboarding@resend.dev for testing")
        } else if (error.message?.includes("rate limit")) {
          console.error("   💡 Fix: You've hit Resend's rate limit. Wait a bit and try again.")
        }
        
        return false
      }
    } catch (error) {
      console.error("❌ Error sending email via Resend:")
      console.error("   Error:", error instanceof Error ? error.message : String(error))
      if (error instanceof Error && error.stack) {
        console.error("   Stack:", error.stack)
      }
      return false
    }
  }

  // Try Nodemailer if available
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      // Dynamic import to avoid bundling issues if not installed
      // Use type assertion to handle optional dependency
      const nodemailer = await import("nodemailer").catch(() => null)
      if (!nodemailer) {
        console.warn("Nodemailer not installed. Install it with: npm install nodemailer")
        return false
      }
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      const emailFrom = from || process.env.EMAIL_FROM || process.env.SMTP_USER
      
      console.log("Attempting to send email via SMTP...")
      console.log("From:", emailFrom)
      console.log("To:", to)
      console.log("Subject:", subject)
      
      await transporter.sendMail({
        from: emailFrom,
        to,
        subject,
        html,
      })

      console.log("✅ Email sent successfully via SMTP")
      return true
    } catch (error) {
      console.error("❌ Error sending email via SMTP:")
      console.error("   Error:", error instanceof Error ? error.message : String(error))
      if (error instanceof Error && error.stack) {
        console.error("   Stack:", error.stack)
      }
      return false
    }
  }

  // Fallback: Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("=".repeat(50))
    console.log("EMAIL (Development Mode - Not Actually Sent)")
    console.log("To:", to)
    console.log("Subject:", subject)
    console.log("HTML:", html)
    console.log("=".repeat(50))
    return true // Return true so the app continues normally
  }

  console.warn("No email service configured. Email not sent.")
  return false
}

/**
 * Generate signature invite email HTML
 */
export function generateSignatureInviteEmail(
  signerName: string,
  documentTitle: string,
  signingUrl: string,
  senderName?: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Signature Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h1 style="color: #1A73E8; margin-top: 0;">ContractVault</h1>
  </div>
  
  <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e0e5ec; border-radius: 8px;">
    <h2 style="color: #101623; margin-top: 0;">Signature Request</h2>
    
    <p>Hello ${signerName},</p>
    
    <p>${senderName || "Someone"} has requested your signature on a document:</p>
    
    <div style="background-color: #f3f5f7; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <strong>${documentTitle}</strong>
    </div>
    
    <p>Please review and sign the document by clicking the button below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${signingUrl}" 
         style="display: inline-block; background-color: #1A73E8; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Sign Document
      </a>
    </div>
    
    <p style="font-size: 12px; color: #6c7783;">
      Or copy and paste this link into your browser:<br>
      <a href="${signingUrl}" style="color: #1A73E8; word-break: break-all;">${signingUrl}</a>
    </p>
    
    <hr style="border: none; border-top: 1px solid #e0e5ec; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #6c7783;">
      This link will expire after the document is signed. If you did not expect this request, please ignore this email.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6c7783;">
    <p>© ${new Date().getFullYear()} ContractVault. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}

