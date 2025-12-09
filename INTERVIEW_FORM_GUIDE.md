# Interview-Style Document Builder Guide

## Overview

The Interview-Style Document Builder is a dynamic, metadata-driven system that automatically generates user-friendly questionnaires for any legal document template. It presents questions in plain English with helpful descriptions, making it easy for non-lawyers to create professional legal documents.

## Features

- **Step-by-Step Mode**: One question at a time with Next/Back navigation
- **Grouped Mode**: Questions organized by sections (e.g., "Parties", "Dates & Terms")
- **Progress Tracking**: Visual progress bars showing completion status
- **Plain-English Questions**: User-friendly questions instead of technical labels
- **Helpful Descriptions**: Context and guidance for each field
- **Field Grouping**: Related questions grouped together logically
- **Auto-Detection**: Automatically uses appropriate input types (date picker, jurisdiction selector, etc.)

## How It Works

The system is **metadata-driven**. When you define a contract template, you can add interview-style metadata to each field:

```typescript
formSchema: {
  clientName: { 
    label: "Client Name",           // Technical label (used internally)
    type: "text",
    question: "What is your company name?",  // Plain-English question shown to user
    description: "Enter your business or organization name.",  // Helpful explanation
    helpText: "This is the name that will appear in the document.",  // Additional tip
    group: "Parties",               // Group related fields together
    order: 1                        // Order within the group
  }
}
```

## Field Configuration Options

### Required Properties
- `label`: Technical label used internally (e.g., "clientName")
- `type`: Field type (`"text"`, `"textarea"`, `"date"`, `"number"`, `"country/state"`)

### Interview-Style Metadata (Optional)
- `question`: Plain-English question shown to users (defaults to `label` if not provided)
- `description`: Helpful explanation of what the field is for
- `helpText`: Additional guidance, tips, or examples
- `group`: Group name for organizing related fields (defaults to "General Information")
- `order`: Number for ordering fields within a group (lower numbers appear first)
- `required`: Whether field is required (defaults to `true` unless label contains "(Optional)")

## Example: Adding Interview Metadata to a Contract

### Before (Basic)
```typescript
formSchema: {
  effectiveDate: { label: "Effective Date", type: "date" },
  jurisdiction: { label: "Governing State", type: "country/state" }
}
```

### After (With Interview Metadata)
```typescript
formSchema: {
  effectiveDate: { 
    label: "Effective Date", 
    type: "date",
    question: "When should this agreement take effect?",
    description: "Select the date when the agreement becomes legally binding.",
    helpText: "This is usually today's date or a future date when the agreement starts.",
    group: "Dates & Terms",
    order: 1
  },
  jurisdiction: { 
    label: "Governing State", 
    type: "country/state",
    question: "Which state or country's laws will govern this agreement?",
    description: "Select the jurisdiction where legal disputes would be resolved.",
    helpText: "Typically, this is the state where your business is located.",
    group: "Dates & Terms",
    order: 2
  }
}
```

## Field Types

The system automatically uses the appropriate input component based on `type`:

- `"text"`: Standard text input
- `"textarea"`: Multi-line text area
- `"date"`: Calendar date picker with month/year dropdowns
- `"number"`: Number input
- `"country/state"`: Jurisdiction selector with country/state dropdown

## Grouping Fields

Fields with the same `group` value are displayed together:

```typescript
formSchema: {
  clientName: { 
    label: "Client Name", 
    type: "text",
    group: "Parties",      // Same group
    order: 1
  },
  contractorName: { 
    label: "Contractor Name", 
    type: "text",
    group: "Parties",      // Same group
    order: 2
  },
  startDate: { 
    label: "Start Date", 
    type: "date",
    group: "Timeline",     // Different group
    order: 1
  }
}
```

In **Grouped Mode**, these will appear as collapsible sections: "Parties" and "Timeline".

## User Experience

### Step-by-Step Mode
- Shows one question at a time
- Progress bar at top showing "Question X of Y"
- Step indicators (dots) showing which questions are completed
- Next/Back buttons for navigation
- Group badge showing which section the current question belongs to

### Grouped Mode
- Shows all questions organized by groups
- Collapsible sections (click to expand/collapse)
- Progress bar for overall completion
- Individual progress bars for each group
- All fields visible when sections are expanded

## Adding New Templates

To add a new template with interview-style questions:

1. **Define the contract** in `src/lib/contracts.ts`:

```typescript
export const contractRegistry: ContractRegistry = {
  "my-new-contract": {
    id: "my-new-contract",
    title: "My New Contract",
    description: "A contract for...",
    formSchema: {
      field1: {
        label: "Field 1",
        type: "text",
        question: "What is...?",      // Add interview metadata
        description: "This field is for...",
        group: "Section Name",
        order: 1
      },
      // ... more fields
    },
    template: myNewContractTemplate
  }
}
```

2. **The InterviewForm will automatically**:
   - Display questions in plain English
   - Group related fields together
   - Use appropriate input types
   - Show progress and completion status
   - Provide helpful descriptions and tips

## Backward Compatibility

The system is **fully backward compatible**. If you don't add interview metadata:

- `question` defaults to `label`
- `group` defaults to "General Information"
- `order` defaults to 999 (appears at end)
- Fields still work exactly as before

## Best Practices

1. **Use Plain Language**: Write questions as if talking to a non-lawyer
   - ✅ "What is your company name?"
   - ❌ "Enter the legal entity name of the disclosing party"

2. **Provide Context**: Use `description` to explain what the field is for
   - ✅ "The date when the agreement becomes legally binding"
   - ❌ "Effective date"

3. **Give Examples**: Use `helpText` to provide examples or tips
   - ✅ "Common terms are 2-5 years. Some NDAs last indefinitely."
   - ❌ "Enter a number"

4. **Logical Grouping**: Group related fields together
   - "Parties", "Dates & Terms", "Payment", "Services & Scope"

5. **Order Matters**: Use `order` to control the sequence within groups
   - Lower numbers appear first
   - Helps create a logical flow

## Technical Details

- **Component**: `src/components/interview-form.tsx`
- **Type Definitions**: `src/lib/contracts.ts` (FieldConfig interface)
- **Integration**: `src/components/contract-form.tsx` uses InterviewForm
- **Mode Toggle**: Users can switch between "Step-by-Step" and "By Section" modes

## Future Enhancements

Potential additions:
- Live preview that updates as user answers
- Conditional fields (show field B only if field A has value X)
- Field validation with custom error messages
- Save progress and resume later
- Multi-step wizard with summary before generation

