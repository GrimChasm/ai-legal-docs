"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import DatePicker from "@/components/date-picker"
import JurisdictionSelector from "@/components/jurisdiction-selector"
import { FieldConfig } from "@/lib/contracts"

interface InterviewFormProps {
  formSchema: Record<string, FieldConfig>
  values: Record<string, string>
  onChange: (field: string, value: string) => void
  onFocus?: (field: string | null) => void
  onBlur?: () => void
  mode?: "step-by-step" | "grouped" // Step-by-step shows one question at a time, grouped shows sections
  focusedField?: string | null // Current focused field for highlighting
}

/**
 * InterviewForm Component
 * 
 * A dynamic, interview-style form builder that presents questions in a friendly,
 * step-by-step manner. Supports both one-question-at-a-time and grouped section modes.
 * 
 * Features:
 * - Plain-English questions with helpful descriptions
 * - Progress tracking
 * - Next/Back navigation
 * - Field grouping for related questions
 * - Auto-advance on completion (optional)
 * - Visual feedback for completed fields
 */
export default function InterviewForm({
  formSchema,
  values,
  onChange,
  onFocus,
  onBlur,
  mode = "step-by-step",
  focusedField = null
}: InterviewFormProps) {
  const fields = Object.entries(formSchema)
  
  // Group fields by their group property, or create default groups
  const groupedFields = useMemo(() => {
    const groups: Record<string, Array<[string, FieldConfig]>> = {}
    const ungrouped: Array<[string, FieldConfig]> = []
    
    fields.forEach(([key, config]) => {
      const group = config.group || "General Information"
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push([key, config])
    })
    
    // Sort fields within each group by order property
    Object.keys(groups).forEach(group => {
      groups[group].sort((a, b) => {
        const orderA = a[1].order ?? 999
        const orderB = b[1].order ?? 999
        return orderA - orderB
      })
    })
    
    return groups
  }, [fields])

  // For step-by-step mode: track current question index
  const [currentStep, setCurrentStep] = useState(0)
  const [currentGroup, setCurrentGroup] = useState<string | null>(null)
  
  // Flatten grouped fields into a single array for step-by-step navigation
  const stepFields = useMemo(() => {
    const flat: Array<{ group: string; field: [string, FieldConfig] }> = []
    Object.entries(groupedFields).forEach(([groupName, groupFields]) => {
      groupFields.forEach(field => {
        flat.push({ group: groupName, field })
      })
    })
    return flat
  }, [groupedFields])

  // For grouped mode: track which group is expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  // Calculate progress
  const filledCount = Object.values(values).filter(v => {
    if (!v || typeof v !== 'string') return false
    const trimmed = v.trim()
    return trimmed !== "" && trimmed !== "undefined" && trimmed !== "null"
  }).length
  
  const totalFields = fields.length
  const progress = totalFields > 0 ? (filledCount / totalFields) * 100 : 0

  // Check if current step has a value
  const currentField = stepFields[currentStep]?.field
  const currentFieldValue = currentField ? values[currentField[0]] : ""
  const hasCurrentValue = currentFieldValue && 
    typeof currentFieldValue === 'string' && 
    currentFieldValue.trim() !== "" && 
    currentFieldValue.trim() !== "undefined" && 
    currentFieldValue.trim() !== "null"

  // Navigation functions
  const goToNext = () => {
    if (currentStep < stepFields.length - 1) {
      setCurrentStep(currentStep + 1)
      // Focus the next field
      const nextField = stepFields[currentStep + 1]?.field[0]
      if (nextField && onFocus) {
        setTimeout(() => onFocus(nextField), 100)
      }
    }
  }

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      // Focus the previous field
      const prevField = stepFields[currentStep - 1]?.field[0]
      if (prevField && onFocus) {
        setTimeout(() => onFocus(prevField), 100)
      }
    }
  }

  const goToStep = (index: number) => {
    if (index >= 0 && index < stepFields.length) {
      setCurrentStep(index)
      const field = stepFields[index]?.field[0]
      if (field && onFocus) {
        setTimeout(() => onFocus(field), 100)
      }
    }
  }

  // Auto-advance when field is completed (optional - can be disabled)
  useEffect(() => {
    if (mode === "step-by-step" && hasCurrentValue && currentStep < stepFields.length - 1) {
      // Optional: Auto-advance after a short delay
      // Uncomment if desired:
      // const timer = setTimeout(() => goToNext(), 500)
      // return () => clearTimeout(timer)
    }
  }, [hasCurrentValue, currentStep, stepFields.length, mode])

  // Render a single field input
  const renderField = (fieldKey: string, config: FieldConfig, isFocused: boolean = false) => {
    const fieldValue = values[fieldKey] || ""
    const hasValue = fieldValue && 
      typeof fieldValue === 'string' && 
      fieldValue.trim() !== "" && 
      fieldValue.trim() !== "undefined" && 
      fieldValue.trim() !== "null"
    
    const fieldType = config.type?.toLowerCase().trim() || "text"
    const isRequired = config.required !== false && !config.label.includes("(Optional)")
    const isCurrentlyFocused = focusedField === fieldKey || isFocused

    return (
      <div key={fieldKey} className="space-y-4">
        {/* Question/Label */}
        <div className="space-y-2">
          <Label htmlFor={fieldKey} className={isCurrentlyFocused ? "text-accent" : ""}>
            {config.question || config.label}
            {isRequired && <span className="text-danger ml-1">*</span>}
          </Label>
          
          {/* Description */}
          {config.description && (
            <p className="text-sm text-text-muted leading-relaxed">
              {config.description}
            </p>
          )}
          
          {/* Help Text */}
          {config.helpText && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Tip:</p>
              <p>{config.helpText}</p>
            </div>
          )}
        </div>

        {/* Input Field */}
        {fieldType === "textarea" ? (
          <Textarea
            id={fieldKey}
            value={fieldValue}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            onFocus={() => onFocus?.(fieldKey)}
            onBlur={() => onBlur?.()}
            required={isRequired}
            placeholder={`Enter ${(config.question || config.label).toLowerCase()}...`}
            className={hasValue && !isCurrentlyFocused ? "border-blue-300 bg-blue-50" : ""}
            rows={4}
          />
        ) : fieldType === "date" ? (
          <DatePicker
            id={fieldKey}
            value={fieldValue}
            onChange={(value) => onChange(fieldKey, value)}
            required={isRequired}
            placeholder={`Select ${(config.question || config.label).toLowerCase()}...`}
            label={config.question || config.label}
          />
        ) : fieldType === "country/state" ? (
          <JurisdictionSelector
            id={fieldKey}
            value={fieldValue}
            onChange={(value) => onChange(fieldKey, value)}
            required={isRequired}
            placeholder={`Select ${(config.question || config.label).toLowerCase()}...`}
            includeState={true}
            label={config.question || config.label}
          />
        ) : (
          <Input
            id={fieldKey}
            type={fieldType === "number" ? "number" : "text"}
            value={fieldValue}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            onFocus={() => onFocus?.(fieldKey)}
            onBlur={() => onBlur?.()}
            required={isRequired}
            placeholder={`Enter ${(config.question || config.label).toLowerCase()}...`}
            className={hasValue && !isCurrentlyFocused ? "border-blue-300 bg-blue-50" : ""}
          />
        )}

        {/* Completion indicator */}
        {hasValue && !isCurrentlyFocused && (
          <div className="flex items-center text-blue-700 text-sm font-semibold">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Answered</span>
          </div>
        )}
      </div>
    )
  }

  // Step-by-step mode: Show one question at a time
  if (mode === "step-by-step") {
    const currentFieldData = stepFields[currentStep]
    if (!currentFieldData) {
      return <div>No fields to display</div>
    }

    const [fieldKey, config] = currentFieldData.field
    const currentGroupName = currentFieldData.group

    return (
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Question {currentStep + 1} of {stepFields.length}</span>
            <span className="font-medium text-text-main">{filledCount} of {totalFields} completed</span>
          </div>
          <div className="h-3 bg-bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Question Card */}
        <Card className="border-2 border-accent shadow-xl relative">
          <CardContent className="p-6 md:p-8">
            {/* Group indicator */}
            {currentGroupName && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                  {currentGroupName}
                </span>
              </div>
            )}

            {renderField(fieldKey, config, true)}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              goToPrevious()
            }}
            disabled={currentStep === 0}
            className="min-w-[120px]"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          {/* Step indicators */}
          <div className="flex items-center gap-3 flex-1 justify-center max-w-md overflow-x-auto py-2">
            {stepFields.map((_, index) => {
              const fieldKey = stepFields[index]?.field[0]
              const hasValue = fieldKey && values[fieldKey] && 
                typeof values[fieldKey] === 'string' && 
                values[fieldKey].trim() !== "" && 
                values[fieldKey].trim() !== "undefined" && 
                values[fieldKey].trim() !== "null"
              
              const isCurrentStep = index === currentStep
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    goToStep(index)
                  }}
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isCurrentStep
                      ? "w-10 h-10"
                      : "w-8 h-8"
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                >
                  {/* Current step - large with ring and number */}
                  {isCurrentStep ? (
                    <>
                      {/* Outer ring with pulse animation */}
                      <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-2 border-accent ring-2 ring-accent/30" />
                      {/* Step number */}
                      <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-accent-light border-2 border-accent text-accent font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Completed step - green with checkmark */}
                      {hasValue ? (
                        <div className="relative w-full h-full rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center shadow-md">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        /* Incomplete step - gray circle */
                        <div className="w-full h-full rounded-full bg-gray-300 border-2 border-gray-400" />
                      )}
                    </>
                  )}
                </button>
              )
            })}
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              goToNext()
            }}
            disabled={currentStep === stepFields.length - 1}
            className="min-w-[120px]"
          >
            Next
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    )
  }

  // Grouped mode: Show fields organized by groups
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Progress</span>
          <span className="font-medium text-text-main">{filledCount} of {totalFields} completed</span>
        </div>
        <div className="h-3 bg-bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Grouped Fields */}
      <div className="space-y-8">
        {Object.entries(groupedFields).map(([groupName, groupFields]) => {
          const groupFilled = groupFields.filter(([key]) => {
            const val = values[key]
            return val && typeof val === 'string' && val.trim() !== "" && val.trim() !== "undefined" && val.trim() !== "null"
          }).length
          const groupProgress = groupFields.length > 0 ? (groupFilled / groupFields.length) * 100 : 0
          const isExpanded = expandedGroups.has(groupName)

          return (
            <Card key={groupName} className="overflow-hidden">
              <button
                onClick={() => {
                  const newExpanded = new Set(expandedGroups)
                  if (isExpanded) {
                    newExpanded.delete(groupName)
                  } else {
                    newExpanded.add(groupName)
                  }
                  setExpandedGroups(newExpanded)
                }}
                className="w-full"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-text-main mb-2">{groupName}</h3>
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span>{groupFilled} of {groupFields.length} completed</span>
                        <div className="h-2 bg-bg-muted rounded-full flex-1 max-w-[200px] overflow-hidden">
                          <div 
                            className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${groupProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-6 h-6 text-text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </CardContent>
              </button>

              {isExpanded && (
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6 border-t border-border pt-6 overflow-visible" style={{ height: '1600px' }}>
                  {groupFields.map(([fieldKey, config]) => renderField(fieldKey, config))}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

