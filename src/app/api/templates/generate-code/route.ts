// src/app/api/templates/generate-code/route.ts

import { NextRequest, NextResponse } from "next/server"

// Dynamic import for OpenAI to avoid build-time errors if package is missing
let OpenAI: any = null
async function getOpenAI() {
  if (!OpenAI) {
    OpenAI = (await import("openai")).default
  }
  return OpenAI
}

type AIModel = "gpt-4-turbo" | "gpt-4o-mini" | "claude-3-5-sonnet" | "huggingface" | "gemini" | "auto"

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
          content: "You are an expert JavaScript developer. Generate clean, production-ready JavaScript template function code for legal document generation.",
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
        "OpenAI quota exceeded. Please check your billing at https://platform.openai.com/account/billing."
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
          content: `You are an expert JavaScript developer. Generate clean, production-ready JavaScript template function code for legal document generation.\n\n${prompt}`,
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
                    text: `You are an expert JavaScript developer. Generate clean, production-ready JavaScript template function code for legal document generation.\n\n${prompt}`,
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
          continue
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
        continue
      }
      throw error
    }
  }

  throw new Error("All Gemini models failed")
}

// -------------------------------
// Model Selection Logic
// -------------------------------
function selectModel(requestedModel: AIModel, quality?: "premium" | "standard"): AIModel {
  if (requestedModel !== "auto") {
    return requestedModel
  }

  if (quality === "premium") {
    if (process.env.ANTHROPIC_API_KEY) return "claude-3-5-sonnet"
    if (process.env.OPENAI_API_KEY) return "gpt-4-turbo"
  }

  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const hasClaude = !!process.env.ANTHROPIC_API_KEY
  const hasGemini = !!process.env.GEMINI_API_KEY
  const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY

  if (hasOpenAI) return "gpt-4o-mini"
  if (hasClaude) return "claude-3-5-sonnet"
  if (hasGemini) return "gemini"
  if (hasHuggingFace) return "huggingface"

  throw new Error("No AI model API keys configured")
}

// -------------------------------
// Main API Route
// -------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, formSchema, model = "auto", quality } = body

    if (!title || !description || !formSchema) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, or formSchema" },
        { status: 400 }
      )
    }

    const selectedModel = selectModel(model as AIModel, quality)
    const prompt = `Generate a JavaScript template function for a legal document generator.

Document Title: ${title}
Description: ${description}

Form Schema (fields that will be available in the values object):
${JSON.stringify(formSchema, null, 2)}

Requirements:
1. Create a function named "template" that takes a "values" parameter (object with form field values)
2. Return a markdown-formatted legal document string
3. Use template literals with \${} interpolation for dynamic values
4. Include proper legal document structure (sections, headings, clauses)
5. Use the field values from the "values" object
6. Generate professional, legally sound content
7. Output ONLY the function code, no explanations or markdown code blocks

Example structure:
function template(values) {
  return \`# Document Title

## Section 1
Content using \${values.fieldName}

## Section 2
More content...
\`
}`

    let templateCode = ""
    let error: any = null

    const fallbackChain: AIModel[] = [
      selectedModel,
      "gpt-4o-mini",
      "gemini",
      "huggingface",
    ].filter((m) => m !== selectedModel) as AIModel[]

    const modelsToTry = [selectedModel, ...fallbackChain]

    for (const modelToTry of modelsToTry) {
      try {
        switch (modelToTry) {
          case "gpt-4-turbo":
          case "gpt-4o-mini": {
            const apiKey = process.env.OPENAI_API_KEY
            if (!apiKey) {
              error = new Error("OpenAI API key not configured")
              continue
            }
            templateCode = await callOpenAI(prompt, modelToTry, apiKey)
            break
          }
          case "claude-3-5-sonnet": {
            const apiKey = process.env.ANTHROPIC_API_KEY
            if (!apiKey) {
              error = new Error("Anthropic API key not configured")
              continue
            }
            templateCode = await callClaude(prompt, apiKey)
            break
          }
          case "gemini": {
            const apiKey = process.env.GEMINI_API_KEY
            if (!apiKey) {
              error = new Error("Gemini API key not configured")
              continue
            }
            templateCode = await callGemini(prompt, apiKey)
            break
          }
          case "huggingface": {
            const apiKey = process.env.HUGGINGFACE_API_KEY
            const modelName = process.env.HUGGINGFACE_MODEL || "meta-llama/Llama-2-7b-chat-hf"
            if (!apiKey) {
              error = new Error("HuggingFace API key not configured")
              continue
            }
            templateCode = await callHuggingFace(prompt, modelName, apiKey)
            break
          }
          default:
            error = new Error(`Unknown model: ${modelToTry}`)
            continue
        }

        if (templateCode) {
          // Clean up the response - remove markdown code blocks if present
          templateCode = templateCode.replace(/^```(?:javascript|js)?\n?/gm, "").replace(/```$/gm, "").trim()
          break
        }
      } catch (err: any) {
        error = err
        continue
      }
    }

    if (!templateCode) {
      return NextResponse.json(
        {
          error: error?.message || "Failed to generate template code",
          suggestion: "Make sure you have at least one AI API key configured",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      templateCode: templateCode.trim(),
      model: selectedModel,
    })
  } catch (error: any) {
    console.error("Error generating template code:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
