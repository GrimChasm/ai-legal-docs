"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "./ui/input"

interface Country {
  code: string
  name: string
  states?: string[]
}

// Comprehensive country/state data
const countries: Country[] = [
  { code: "US", name: "United States", states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "District of Columbia"] },
  { code: "CA", name: "Canada", states: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"] },
  { code: "GB", name: "United Kingdom", states: ["England", "Scotland", "Wales", "Northern Ireland"] },
  { code: "AU", name: "Australia", states: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Northern Territory", "Australian Capital Territory"] },
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
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "EE", name: "Estonia" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Cyprus" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico", states: ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"] },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "VE", name: "Venezuela" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "MA", name: "Morocco" },
  { code: "TN", name: "Tunisia" },
  { code: "DZ", name: "Algeria" },
  { code: "GH", name: "Ghana" },
  { code: "ET", name: "Ethiopia" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
  { code: "AO", name: "Angola" },
  { code: "SD", name: "Sudan" },
  { code: "MZ", name: "Mozambique" },
  { code: "MG", name: "Madagascar" },
  { code: "CM", name: "Cameroon" },
  { code: "CI", name: "Ivory Coast" },
  { code: "NE", name: "Niger" },
  { code: "BF", name: "Burkina Faso" },
  { code: "ML", name: "Mali" },
  { code: "MW", name: "Malawi" },
  { code: "ZM", name: "Zambia" },
  { code: "SN", name: "Senegal" },
  { code: "TD", name: "Chad" },
  { code: "SO", name: "Somalia" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "GN", name: "Guinea" },
  { code: "RW", name: "Rwanda" },
  { code: "BJ", name: "Benin" },
  { code: "BI", name: "Burundi" },
  { code: "SS", name: "South Sudan" },
  { code: "TG", name: "Togo" },
  { code: "SL", name: "Sierra Leone" },
  { code: "LY", name: "Libya" },
  { code: "LR", name: "Liberia" },
  { code: "MR", name: "Mauritania" },
  { code: "ER", name: "Eritrea" },
  { code: "CF", name: "Central African Republic" },
  { code: "GM", name: "Gambia" },
  { code: "BW", name: "Botswana" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GA", name: "Gabon" },
  { code: "LS", name: "Lesotho" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "MU", name: "Mauritius" },
  { code: "EH", name: "Western Sahara" },
  { code: "DJ", name: "Djibouti" },
  { code: "RE", name: "Réunion" },
  { code: "KM", name: "Comoros" },
  { code: "CV", name: "Cape Verde" },
  { code: "SC", name: "Seychelles" },
  { code: "ST", name: "São Tomé and Príncipe" },
  { code: "SH", name: "Saint Helena" },
]

interface JurisdictionSelectorProps {
  value: string
  onChange: (value: string) => void
  id?: string
  required?: boolean
  placeholder?: string
  includeState?: boolean
}

export default function JurisdictionSelector({
  value,
  onChange,
  id,
  required,
  placeholder = "Select country/state",
  includeState = false,
}: JurisdictionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedState, setSelectedState] = useState<string>("")
  const [stateSearchQuery, setStateSearchQuery] = useState("")
  const pickerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Parse existing value
    if (value) {
      const parts = value.split(", ")
      if (parts.length === 2 && includeState) {
        const countryName = parts[1]
        const stateName = parts[0]
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
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

  useEffect(() => {
    // Reposition on scroll
    const handleScroll = () => {
      if (isOpen && pickerRef.current) {
        const position = getInputPosition()
        pickerRef.current.style.top = `${position.top}px`
        pickerRef.current.style.left = `${position.left}px`
      }
    }

    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true)
      return () => window.removeEventListener("scroll", handleScroll, true)
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
    if (!includeState || !country.states || country.states.length === 0) {
      onChange(country.name)
      setIsOpen(false)
    } else {
      setStateSearchQuery("")
    }
  }

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
    if (selectedCountry) {
      onChange(`${state}, ${selectedCountry.name}`)
      setIsOpen(false)
      setStateSearchQuery("")
    }
  }

  const getInputPosition = () => {
    if (!inputRef.current) return { top: 0, left: 0 }
    const rect = inputRef.current.getBoundingClientRect()
    const scrollY = window.scrollY || window.pageYOffset
    const scrollX = window.scrollX || window.pageXOffset
    
    // Position below the input with some spacing
    let top = rect.bottom + scrollY + 8
    let left = rect.left + scrollX
    
    // Check if dropdown would go off bottom of viewport
    const viewportHeight = window.innerHeight
    const dropdownHeight = 400 // Approximate dropdown height
    if (rect.bottom + dropdownHeight > viewportHeight) {
      // Position above input instead
      top = rect.top + scrollY - dropdownHeight - 8
    }
    
    // Check if dropdown would go off right edge
    const viewportWidth = window.innerWidth
    const dropdownWidth = 300
    if (left + dropdownWidth > viewportWidth) {
      left = viewportWidth - dropdownWidth - 16
    }
    
    return { top, left }
  }

  const position = isOpen ? getInputPosition() : { top: 0, left: 0 }

  const displayValue = includeState && selectedState && selectedCountry
    ? `${selectedState}, ${selectedCountry.name}`
    : selectedCountry?.name || value || ""

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={displayValue}
          onChange={() => {}} // Controlled by dropdown
          onClick={() => setIsOpen(!isOpen)}
          onFocus={() => setIsOpen(true)}
          required={required}
          placeholder={placeholder}
          readOnly
          className="pr-10 cursor-pointer"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          ref={pickerRef}
          className="fixed z-50 bg-bg border border-border rounded-lg shadow-lg min-w-[300px] max-h-[400px] overflow-hidden flex flex-col"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {!selectedCountry || (includeState && selectedCountry.states && selectedCountry.states.length > 0 && !selectedState) ? (
            <>
              {!selectedCountry ? (
                <>
                  {/* Country Search */}
                  <div className="p-3 border-b border-border">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full"
                      autoFocus
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
                          className="w-full text-left px-4 py-2.5 hover:bg-bg-muted transition-colors text-sm text-text-main"
                        >
                          {country.name}
                        </button>
                      ))
                    )}
                  </div>
                </>
              ) : selectedCountry.states && selectedCountry.states.length > 0 ? (
                <>
                  {/* State Selection Header */}
                  <div className="p-3 border-b border-border bg-bg-muted">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCountry(null)
                        setSelectedState("")
                        setSearchQuery("")
                        setStateSearchQuery("")
                      }}
                      className="text-sm text-accent hover:text-accent-hover font-medium mb-2 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to countries
                    </button>
                    <p className="text-sm font-medium text-text-main">
                      Select state/province in {selectedCountry.name}
                    </p>
                  </div>
                  {/* State Search */}
                  <div className="p-3 border-b border-border">
                    <Input
                      type="text"
                      value={stateSearchQuery}
                      onChange={(e) => setStateSearchQuery(e.target.value)}
                      placeholder="Search states/provinces..."
                      className="w-full"
                      autoFocus
                    />
                  </div>
                  {/* State List */}
                  <div className="overflow-y-auto flex-1">
                    {filteredStates.length === 0 ? (
                      <div className="p-4 text-center text-text-muted text-sm">No states/provinces found</div>
                    ) : (
                      filteredStates.map((state) => (
                        <button
                          key={state}
                          type="button"
                          onClick={() => handleStateSelect(state)}
                          className="w-full text-left px-4 py-2.5 hover:bg-bg-muted transition-colors text-sm text-text-main"
                        >
                          {state}
                        </button>
                      ))
                    )}
                  </div>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
