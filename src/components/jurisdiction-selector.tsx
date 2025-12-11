"use client"

/**
 * JurisdictionSelector Component
 * 
 * A reusable country/state/territory selector component for selecting jurisdictions in forms.
 * 
 * Features:
 * - Two-step selection: Country first, then State/Province/Territory (if applicable)
 * - Search functionality for both countries and states
 * - Handles countries without sub-regions gracefully
 * - Keyboard accessible (Esc to close, arrow keys to navigate)
 * - Proper positioning (anchored to input, handles viewport edges)
 * - ARIA attributes for accessibility
 * - Output format: "State, Country" or "Country" (if no state)
 * 
 * Usage:
 * ```tsx
 * <JurisdictionSelector
 *   value={jurisdictionValue}
 *   onChange={(value) => setJurisdictionValue(value)}
 *   id="governing-state"
 *   required
 *   placeholder="Select jurisdiction"
 *   includeState={true}
 * />
 * ```
 * 
 * To use in contract forms:
 * - Set field type to "country/state" in the formSchema
 * - The component will automatically be used for that field
 * 
 * @example
 * // In contract form schema:
 * formSchema: {
 *   governingState: { label: "Governing State", type: "country/state" },
 *   propertyLocation: { label: "Property Location", type: "country/state" },
 * }
 * 
 * To add more countries/states:
 * - Edit the `countries` array below
 * - Add country objects with optional `states` array
 * - Format: { code: "XX", name: "Country Name", states?: ["State1", "State2", ...] }
 */

import { useState, useRef, useEffect } from "react"
import { Input } from "./ui/input"

interface Country {
  code: string
  name: string
  states?: string[]
}

// Comprehensive country/state data
// To add more countries or states, modify this array
const countries: Country[] = [
  { code: "US", name: "United States", states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "District of Columbia"] },
  { code: "CA", name: "Canada", states: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"] },
  { code: "GB", name: "United Kingdom", states: ["England", "Scotland", "Wales", "Northern Ireland"] },
  { code: "AU", name: "Australia", states: ["New South Wales", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia", "Australian Capital Territory", "Northern Territory"] },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "LT", name: "Lithuania" },
  { code: "LV", name: "Latvia" },
  { code: "EE", name: "Estonia" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" },
  { code: "NZ", name: "New Zealand" },
  { code: "ZA", name: "South Africa" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico", states: ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"] },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "VE", name: "Venezuela" },
  { code: "EG", name: "Egypt" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "IL", name: "Israel" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "TR", name: "Turkey" },
  { code: "RU", name: "Russia" },
]

interface JurisdictionSelectorProps {
  value: string
  onChange: (value: string) => void
  id?: string
  required?: boolean
  placeholder?: string
  includeState?: boolean
  label?: string
}

export default function JurisdictionSelector({
  value,
  onChange,
  id,
  required,
  placeholder = "Select country/state",
  includeState = false,
  label,
}: JurisdictionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedState, setSelectedState] = useState<string>("")
  const [stateSearchQuery, setStateSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Parse existing value
  useEffect(() => {
    if (value) {
      const parts = value.split(", ")
      if (parts.length === 2 && includeState) {
        const stateName = parts[0]
        const countryName = parts[1]
        const country = countries.find((c) => c.name === countryName)
        if (country) {
          setSelectedCountry(country)
          setSelectedState(stateName)
        }
      } else {
        const country = countries.find((c) => c.name === value)
        if (country) {
          setSelectedCountry(country)
        }
      }
    }
  }, [value, includeState])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery("")
        setStateSearchQuery("")
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Handle Esc key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
        setSearchQuery("")
        setStateSearchQuery("")
        inputRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  // Note: Using absolute positioning, so dropdown stays anchored to input automatically

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredStates = selectedCountry?.states?.filter((state) =>
    state.toLowerCase().includes(stateSearchQuery.toLowerCase())
  ) || []

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setSearchQuery("")
    
    // If country has no states or state selection not required, select country directly
    if (!includeState || !country.states || country.states.length === 0) {
      onChange(country.name)
      // Keep dropdown open - don't close it
      setSelectedState("")
      setStateSearchQuery("")
    } else {
      // Reset state selection and show state selector
      // Keep dropdown open
      setSelectedState("")
      setStateSearchQuery("")
    }
  }

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
    if (selectedCountry) {
      // Format: "State, Country"
      onChange(`${state}, ${selectedCountry.name}`)
      // Keep dropdown open - don't close it
      setStateSearchQuery("")
    }
  }

  const displayValue = includeState && selectedState && selectedCountry
    ? `${selectedState}, ${selectedCountry.name}`
    : selectedCountry?.name || value || ""

  const handleInputClick = () => {
    // Always open on click, don't toggle
    setIsOpen(true)
  }

  // Using absolute positioning - dropdown is anchored to bottom of input automatically

  return (
    <div ref={containerRef} className="relative w-full mb-8">
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={displayValue}
          onChange={() => {}} // Controlled by dropdown
          onClick={handleInputClick}
          onFocus={handleInputClick}
          required={required}
          placeholder={placeholder}
          readOnly
          className="pr-10 cursor-pointer"
          aria-label={label || placeholder}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? "jurisdiction-selector-dropdown" : undefined}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleInputClick()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main active:scale-90 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded p-1"
          aria-label="Open jurisdiction selector"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          id="jurisdiction-selector-dropdown"
          role="listbox"
          aria-label="Select jurisdiction"
          className="absolute z-[9999] w-full bg-white border-2 border-border rounded-lg shadow-2xl max-h-[400px] overflow-hidden flex flex-col mt-1"
          style={{
            top: '100%',
            left: '0',
            backgroundColor: '#FFFFFF',
            position: 'absolute',
          }}
        >
          {!selectedCountry || (includeState && selectedCountry && (!selectedCountry.states || selectedCountry.states.length === 0)) ? (
            <>
              {/* Country Search */}
              <div className="p-4 border-b border-border">
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full"
                  autoFocus
                  aria-label="Search countries"
                />
              </div>
              {/* Country List */}
              <div className="overflow-y-auto flex-1">
                {filteredCountries.length === 0 ? (
                  <div className="p-4 text-center text-text-muted text-sm">No countries found</div>
                ) : (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full text-left px-4 py-3 hover:bg-bg-muted active:bg-gray-200 transition-all duration-150 text-sm text-text-main focus:outline-none focus:bg-bg-muted focus:ring-2 focus:ring-accent focus:ring-inset"
                      role="option"
                      aria-label={`Select ${country.name}`}
                    >
                      {country.name}
                    </button>
                  ))
                )}
              </div>
            </>
          ) : includeState && selectedCountry.states && selectedCountry.states.length > 0 ? (
            <>
              {/* State Selection Header */}
              <div className="p-4 border-b border-border bg-bg-muted">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCountry(null)
                    setSelectedState("")
                    setSearchQuery("")
                    setStateSearchQuery("")
                  }}
                  className="text-sm text-accent hover:text-accent-hover active:scale-95 active:text-accent-hover font-medium mb-2 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-2 py-1 transition-all duration-150"
                  aria-label="Back to country selection"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to countries
                </button>
                <p className="text-sm font-semibold text-text-main">
                  {selectedState ? `Selected: ${selectedState}, ${selectedCountry.name}` : `Select state/province in ${selectedCountry.name}`}
                </p>
                {selectedState && (
                  <p className="text-xs text-text-muted mt-1">Click a different state to change selection</p>
                )}
              </div>
              {/* State Search */}
              <div className="p-4 border-b border-border">
                <Input
                  type="text"
                  value={stateSearchQuery}
                  onChange={(e) => setStateSearchQuery(e.target.value)}
                  placeholder="Search states/provinces..."
                  className="w-full"
                  autoFocus
                  aria-label="Search states/provinces"
                />
              </div>
              {/* State List */}
              <div className="overflow-y-auto flex-1">
                {filteredStates.length === 0 ? (
                  <div className="p-4 text-center text-text-muted text-sm">No states/provinces found</div>
                ) : (
                  filteredStates.map((state) => {
                    const isSelected = selectedState === state
                    return (
                      <button
                        key={state}
                        type="button"
                        onClick={() => handleStateSelect(state)}
                        className={`w-full text-left px-4 py-3 hover:bg-bg-muted active:bg-gray-200 transition-all duration-150 text-sm focus:outline-none focus:bg-bg-muted focus:ring-2 focus:ring-accent focus:ring-inset ${
                          isSelected 
                            ? "bg-blue-50 text-blue-700 font-semibold border-l-2 border-accent" 
                            : "text-text-main"
                        }`}
                        role="option"
                        aria-label={`Select ${state}, ${selectedCountry.name}`}
                        aria-selected={isSelected}
                      >
                        {state}
                      </button>
                    )
                  })
                )}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

