"use client"

import { Label } from "./ui/label"

interface AIModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function AIModelSelector({ value, onChange }: AIModelSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>AI Model Selection</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-[#E0E5EC] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] outline-none bg-white"
      >
        <option value="auto">Auto (Recommended)</option>
        <option value="gpt-4-turbo">GPT-4 Turbo</option>
        <option value="gpt-4o-mini">GPT-4o Mini</option>
        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
        <option value="gemini">Google Gemini</option>
        <option value="huggingface">HuggingFace</option>
      </select>
      <p className="text-xs text-[#6C7783]">
        {value === "auto" && "Automatically selects the best available model"}
        {value === "gpt-4-turbo" && "High-quality, fast generation (OpenAI)"}
        {value === "gpt-4o-mini" && "Cost-effective option (OpenAI)"}
        {value === "claude-3-5-sonnet" && "Premium quality for complex documents (Anthropic)"}
        {value === "gemini" && "Free tier available (Google)"}
        {value === "huggingface" && "Open-source models (Free)"}
      </p>
    </div>
  )
}

