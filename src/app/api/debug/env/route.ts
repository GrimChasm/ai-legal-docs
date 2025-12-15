import { NextResponse } from "next/server"

export async function GET() {
  const openaiKey = process.env.OPENAI_API_KEY
  const openaiVars = Object.keys(process.env)
    .filter(key => key.toUpperCase().includes('OPENAI'))
    .map(key => ({
      name: key,
      hasValue: !!process.env[key],
      valueLength: process.env[key]?.length || 0,
      preview: process.env[key]?.substring(0, 10) + "..." || "undefined"
    }))

  // Also check LLM_PROVIDER
  const llmProvider = process.env.LLM_PROVIDER

  return NextResponse.json({
    openaiApiKey: {
      exists: !!openaiKey,
      length: openaiKey?.length || 0,
      preview: openaiKey?.substring(0, 10) + "..." || "undefined",
      startsWith: openaiKey?.substring(0, 7) || "N/A"
    },
    llmProvider: llmProvider || "not set",
    allOpenaiVars: openaiVars,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || "not set",
    message: openaiKey 
      ? "✅ OPENAI_API_KEY is loaded!" 
      : "❌ OPENAI_API_KEY is missing"
  })
}

