// src/app/api/generate/route.ts

import { NextResponse } from "next/server"
import { contractRegistry } from "@/lib/contracts"

// Dynamic import for OpenAI to avoid build-time errors if package is missing
let OpenAI: any = null
async function getOpenAI() {
  if (!OpenAI) {
    OpenAI = (await import("openai")).default
  }
  return OpenAI
}

type AIModel = "gpt-4-turbo" | "gpt-4o-mini" | "claude-3-5-sonnet" | "huggingface" | "gemini" | "auto" | "free"

// -------------------------------
// HuggingFace Helper
// -------------------------------
async function callHuggingFace(
  prompt: string,
  model: string = "meta-llama/Llama-2-7b-chat-hf",
  apiKey: string
): Promise<string> {
  const endpoints = [
    `https://api-inference.huggingface.co/models/${model}`,
    `https://router.huggingface.co/models/${model}`,
  ]

  let lastError: any = null

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.2,
          },
        }),
      })

      if (response.status === 503) {
        // Model is loading, wait and retry
        await new Promise((resolve) => setTimeout(resolve, 5000))
        continue
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorData: any = {}
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }

        if (response.status === 404) {
          throw new Error(
            `HuggingFace model "${model}" not found. Please check your HUGGINGFACE_MODEL setting. Try using "meta-llama/Llama-2-7b-chat-hf" or visit https://huggingface.co/models to find available text generation models. Note: Very large models may not be available through the router endpoint.`
          )
        }

        if (response.status === 401 || response.status === 403) {
          throw new Error("HuggingFace API authentication failed. Please check your HUGGINGFACE_API_KEY.")
        }

        lastError = new Error(`HuggingFace API error: ${errorData.error || response.statusText}`)
        continue
      }

      const data = await response.json()

      // Handle different response formats
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text
      }
      if (data.generated_text) {
        return data.generated_text
      }
      if (data.summary_text) {
        return data.summary_text
      }
      if (typeof data === "string") {
        return data
      }

      return JSON.stringify(data, null, 2)
    } catch (error: any) {
      lastError = error
      if (error.message?.includes("not found") || error.message?.includes("404")) {
        throw error
      }
      continue
    }
  }

  throw lastError || new Error("HuggingFace API request failed on all endpoints")
}

// -------------------------------
// OpenAI Helper
// -------------------------------
async function callOpenAI(
  prompt: string,
  model: "gpt-4-turbo" | "gpt-4o-mini" = "gpt-4o-mini",
  apiKey: string
): Promise<string> {
  const OpenAIClass = await getOpenAI()
  const openai = new OpenAIClass({ apiKey })

  const modelMap: Record<string, string> = {
    "gpt-4-turbo": "gpt-4o",
    "gpt-4o-mini": "gpt-4o-mini",
  }

  const actualModel = modelMap[model] || "gpt-4o-mini"

  try {
    const completion = await openai.chat.completions.create({
      model: actualModel,
      messages: [
        {
          role: "system",
          content: "You are a legal document generator. Generate professional, legally sound documents in markdown format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    })

    return completion.choices[0].message.content ?? ""
  } catch (error: any) {
    if (error?.message?.includes("quota") || error?.status === 429) {
      throw new Error(
        "OpenAI quota exceeded. Please check your billing at https://platform.openai.com/account/billing. You can also try using Premium Quality (Claude) if you have ANTHROPIC_API_KEY configured."
      )
    }
    throw error
  }
}

// -------------------------------
// Claude Helper
// -------------------------------
async function callClaude(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are a legal document generator. Generate professional, legally sound documents in markdown format.\n\n${prompt}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`Claude API error: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.content[0].text
}

// -------------------------------
// Gemini Helper
// -------------------------------
async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro"]

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a legal document generator. Generate professional, legally sound documents in markdown format.\n\n${prompt}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2000,
            },
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        if (response.status === 404 && modelsToTry.indexOf(model) < modelsToTry.length - 1) {
          continue // Try next model
        }
        throw new Error(`Gemini API error: ${response.status} ${JSON.stringify(error)}`)
      }

      const data = await response.json()
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text
      }
      throw new Error("Unexpected Gemini response format")
    } catch (error: any) {
      if (modelsToTry.indexOf(model) < modelsToTry.length - 1) {
        continue // Try next model
      }
      throw error
    }
  }

  throw new Error("All Gemini models failed")
}

// -------------------------------
// Model Selection Logic
// -------------------------------
function selectModel(
  requestedModel: AIModel,
  documentType?: string,
  complexity?: "simple" | "complex"
): AIModel {
  if (requestedModel !== "auto") {
    return requestedModel
  }

  // Auto-selection logic
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const hasClaude = !!process.env.ANTHROPIC_API_KEY
  const hasGemini = !!process.env.GEMINI_API_KEY
  const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY

  // For complex documents, prefer Claude or GPT-4 Turbo
  if (complexity === "complex") {
    if (hasClaude) return "claude-3-5-sonnet"
    if (hasOpenAI) return "gpt-4-turbo"
  }

  // Default priority: GPT-4o Mini > Gemini > HuggingFace
  if (hasOpenAI) return "gpt-4o-mini"
  if (hasGemini) return "gemini"
  if (hasHuggingFace) return "huggingface"

  throw new Error("No AI model API keys configured. Please set at least one: OPENAI_API_KEY, GEMINI_API_KEY, or HUGGINGFACE_API_KEY")
}

// -------------------------------
// Main API Route
// -------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { contractId, values, requestedModel = "auto", templateCode } = body

    if (!contractId) {
      return NextResponse.json({ error: "Missing contractId" }, { status: 400 })
    }

    if (!values) {
      return NextResponse.json({ error: "Missing values" }, { status: 400 })
    }

    let prompt = ""

    // Handle custom templates
    if (contractId.startsWith("custom-") && templateCode) {
      try {
        // Execute the template code in a safe way
        // Create a function from the template code
        const templateFunction = new Function("values", `
          ${templateCode}
          return template(values);
        `)
        prompt = templateFunction(values)
      } catch (error: any) {
        return NextResponse.json(
          { error: `Template execution error: ${error.message}` },
          { status: 500 }
        )
      }
    } else {
      // Handle standard templates from registry
      const contract = contractRegistry[contractId]
      if (!contract) {
        return NextResponse.json({ error: `Invalid contractId: ${contractId}` }, { status: 400 })
      }

      // Call template function with proper typing
      prompt = (contract.template as (values: Record<string, string | number>) => string)(values)
    }

    if (!prompt) {
      return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 })
    }

    // Select model
    const contract = contractId.startsWith("custom-") ? undefined : contractRegistry[contractId]
    const selectedModel = selectModel(requestedModel as AIModel, contract?.id)
    let markdown = ""
    let error: any = null

    // Try selected model first, then fallback chain
    const fallbackChain: AIModel[] = [
      selectedModel,
      "gpt-4o-mini",
      "gemini",
      "huggingface",
    ].filter((m) => m !== selectedModel) as AIModel[]

    const modelsToTry = [selectedModel, ...fallbackChain]

    for (const model of modelsToTry) {
      try {
        switch (model) {
          case "gpt-4-turbo":
          case "gpt-4o-mini": {
            const apiKey = process.env.OPENAI_API_KEY
            if (!apiKey) {
              error = new Error("OpenAI API key not configured")
              continue
            }
            markdown = await callOpenAI(prompt, model, apiKey)
            break
          }
          case "claude-3-5-sonnet": {
            const apiKey = process.env.ANTHROPIC_API_KEY
            if (!apiKey) {
              error = new Error("Anthropic API key not configured")
              continue
            }
            markdown = await callClaude(prompt, apiKey)
            break
          }
          case "gemini": {
            const apiKey = process.env.GEMINI_API_KEY
            if (!apiKey) {
              error = new Error("Gemini API key not configured")
              continue
            }
            markdown = await callGemini(prompt, apiKey)
            break
          }
          case "huggingface": {
            const apiKey = process.env.HUGGINGFACE_API_KEY
            const modelName = process.env.HUGGINGFACE_MODEL || "meta-llama/Llama-2-7b-chat-hf"
            if (!apiKey) {
              error = new Error("HuggingFace API key not configured")
              continue
            }
            markdown = await callHuggingFace(prompt, modelName, apiKey)
            break
          }
          default:
            error = new Error(`Unknown model: ${model}`)
            continue
        }

        // Success - break out of loop
        if (markdown) {
          break
        }
      } catch (err: any) {
        error = err
        // Continue to next model in fallback chain
        continue
      }
    }

    if (!markdown) {
      const errorMessage =
        error?.message ||
        "Failed to generate document. Please check your API keys and try again."
      return NextResponse.json(
        {
          error: errorMessage,
          suggestion:
            "Make sure you have at least one AI API key configured: OPENAI_API_KEY, GEMINI_API_KEY, ANTHROPIC_API_KEY, or HUGGINGFACE_API_KEY",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ markdown })
  } catch (err: any) {
    console.error("API Error:", err)
    const errorMessage = err?.message || "Internal server error"
    const errorStack = process.env.NODE_ENV === "development" ? err?.stack : undefined

    return NextResponse.json(
      {
        error: errorMessage,
        ...(errorStack && { stack: errorStack }),
      },
      { status: 500 }
    )
  }
}
