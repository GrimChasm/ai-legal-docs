# Reusable UI Components Usage Guide

This document explains how to use the DatePicker and JurisdictionSelector components in your contract/document generator app.

## DatePicker Component

### Overview
The DatePicker component provides a calendar-based date selection interface for any date field in your contracts.

### Features
- ✅ Calendar popover with month/year dropdowns
- ✅ Keyboard accessible (Esc to close, Enter/Space to select)
- ✅ Mobile-friendly (uses native date input on mobile devices)
- ✅ Proper positioning (anchored to input, handles viewport edges)
- ✅ ARIA attributes for screen readers
- ✅ Outputs dates in YYYY-MM-DD format (ISO standard)

### Usage in Contract Forms

To use the DatePicker in any contract form, simply set the field type to `"date"` in your form schema:

```typescript
// In src/lib/contracts.ts or your contract template
formSchema: {
  effectiveDate: { label: "Effective Date", type: "date" },
  startDate: { label: "Start Date", type: "date" },
  endDate: { label: "End Date (Optional)", type: "date" },
  signatureDate: { label: "Signature Date", type: "date" },
  leaseStart: { label: "Lease Start Date", type: "date" },
  leaseEnd: { label: "Lease End Date", type: "date" },
  closingDate: { label: "Closing Date", type: "date" },
  // ... any other date field
}
```

The `ContractForm` component automatically detects fields with `type: "date"` and uses the DatePicker component.

### Direct Usage (Advanced)

If you need to use the DatePicker directly in a custom component:

```tsx
import DatePicker from "@/components/date-picker"

function MyCustomForm() {
  const [date, setDate] = useState("")
  
  return (
    <DatePicker
      value={date}
      onChange={(value) => setDate(value)}
      id="my-date-field"
      required
      placeholder="Select date"
      label="Date Label" // Optional, for accessibility
    />
  )
}
```

### Date Format
- **Input/Output**: YYYY-MM-DD (ISO 8601 format)
- **Display**: MM/DD/YYYY (US format for readability)

### Adding Date Fields to New Contracts

1. Open your contract template file (e.g., `src/templates/my-contract.ts`)
2. Add date fields to the `formSchema`:
   ```typescript
   formSchema: {
     myDateField: { label: "My Date Field", type: "date" },
   }
   ```
3. The DatePicker will automatically be used when the form renders

---

## JurisdictionSelector Component

### Overview
The JurisdictionSelector component provides a two-step selection interface for choosing country and state/province/territory.

### Features
- ✅ Two-step selection: Country first, then State/Province/Territory
- ✅ Search functionality for both countries and states
- ✅ Handles countries without sub-regions gracefully
- ✅ Keyboard accessible (Esc to close, arrow keys to navigate)
- ✅ Proper positioning (anchored to input, handles viewport edges)
- ✅ ARIA attributes for screen readers
- ✅ Output format: "State, Country" or "Country" (if no state)

### Usage in Contract Forms

To use the JurisdictionSelector in any contract form, set the field type to `"country/state"` in your form schema:

```typescript
// In src/lib/contracts.ts or your contract template
formSchema: {
  governingState: { label: "Governing State", type: "country/state" },
  propertyLocation: { label: "Property Location", type: "country/state" },
  partyLocation: { label: "Party Location", type: "country/state" },
  // ... any other jurisdiction field
}
```

The `ContractForm` component automatically detects fields with `type: "country/state"` and uses the JurisdictionSelector component with `includeState={true}`.

### Direct Usage (Advanced)

If you need to use the JurisdictionSelector directly:

```tsx
import JurisdictionSelector from "@/components/jurisdiction-selector"

function MyCustomForm() {
  const [jurisdiction, setJurisdiction] = useState("")
  
  return (
    <JurisdictionSelector
      value={jurisdiction}
      onChange={(value) => setJurisdiction(value)}
      id="my-jurisdiction-field"
      required
      placeholder="Select jurisdiction"
      includeState={true} // Set to false for country-only selection
      label="Jurisdiction Label" // Optional, for accessibility
    />
  )
}
```

### Output Format
- **With state**: `"California, United States"`
- **Without state** (if `includeState={false}` or country has no states): `"United States"`

### Adding Jurisdiction Fields to New Contracts

1. Open your contract template file (e.g., `src/templates/my-contract.ts`)
2. Add jurisdiction fields to the `formSchema`:
   ```typescript
   formSchema: {
     myJurisdictionField: { label: "Governing Law", type: "country/state" },
   }
   ```
3. The JurisdictionSelector will automatically be used when the form renders

---

## Adding More Countries/States

To add more countries or states to the JurisdictionSelector:

1. Open `src/components/jurisdiction-selector.tsx`
2. Find the `countries` array (around line 50)
3. Add new country objects:
   ```typescript
   { code: "XX", name: "Country Name", states: ["State1", "State2", ...] }
   ```
   - `code`: ISO country code (2 letters)
   - `name`: Full country name
   - `states`: Optional array of states/provinces/territories

### Example: Adding a new country with states
```typescript
{ code: "NZ", name: "New Zealand", states: ["Auckland", "Wellington", "Canterbury", "Otago"] }
```

### Example: Adding a country without states
```typescript
{ code: "SG", name: "Singapore" }
```

---

## Styling and Customization

Both components use the design system tokens defined in `src/app/globals.css`:
- Colors: `--color-text-main`, `--color-accent`, `--color-bg`, etc.
- Spacing: Consistent padding and margins
- Borders: `border-border` class
- Focus states: `focus:ring-2 focus:ring-accent`

To customize styling, modify the component files directly or update the design tokens in `globals.css`.

---

## Accessibility

Both components include:
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader announcements
- ✅ Proper focus indicators

Ensure form labels are properly associated with inputs using the `id` prop.

---

## Troubleshooting

### DatePicker not showing calendar
- Check that the field type is set to `"date"` in the form schema
- Verify the component is imported correctly
- Check browser console for errors

### JurisdictionSelector dropdown not appearing
- Check that the field type is set to `"country/state"` in the form schema
- Verify z-index is not being overridden by other elements
- Check browser console for errors

### Dates not saving correctly
- DatePicker outputs dates in YYYY-MM-DD format
- Ensure your backend/API accepts this format
- Check that the `onChange` handler is properly connected

---

## Examples

### Example 1: NDA with Effective Date
```typescript
formSchema: {
  effectiveDate: { label: "Effective Date", type: "date" },
  governingState: { label: "Governing State", type: "country/state" },
}
```

### Example 2: Lease Agreement with Multiple Dates
```typescript
formSchema: {
  leaseStart: { label: "Lease Start Date", type: "date" },
  leaseEnd: { label: "Lease End Date", type: "date" },
  propertyLocation: { label: "Property Location", type: "country/state" },
}
```

### Example 3: Service Agreement
```typescript
formSchema: {
  startDate: { label: "Start Date", type: "date" },
  endDate: { label: "End Date (Optional)", type: "date" },
  jurisdiction: { label: "Governing Jurisdiction", type: "country/state" },
}
```

---

For more information, see the component source files:
- `src/components/date-picker.tsx`
- `src/components/jurisdiction-selector.tsx`

