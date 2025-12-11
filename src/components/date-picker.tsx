"use client"

/**
 * DatePicker Component
 * 
 * A reusable static calendar date picker component for selecting dates in forms.
 * 
 * Features:
 * - Static calendar always visible (not a popover)
 * - Month/year dropdowns for navigation
 * - Keyboard accessible
 * - Outputs dates in YYYY-MM-DD format
 * 
 * Usage:
 * ```tsx
 * <DatePicker
 *   value={dateValue}
 *   onChange={(date) => setDateValue(date)}
 *   id="effective-date"
 *   required
 *   placeholder="Select effective date"
 * />
 * ```
 * 
 * To use in contract forms:
 * - Set field type to "date" in the formSchema
 * - The component will automatically be used for that field
 */

import { useState, useEffect } from "react"
import { Input } from "./ui/input"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  id?: string
  required?: boolean
  placeholder?: string
  label?: string
}

export default function DatePicker({
  value,
  onChange,
  id,
  required,
  placeholder = "Select date",
  label,
}: DatePickerProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Parse existing value and set month/year - handle YYYY-MM-DD format
  useEffect(() => {
    if (value) {
      // Try parsing YYYY-MM-DD format first
      const parts = value.split("-")
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
        if (!isNaN(year) && !isNaN(month) && month >= 0 && month <= 11) {
          setSelectedYear(year)
          setSelectedMonth(month)
          return
        }
      }
      // Fallback to Date parsing for other formats
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setSelectedMonth(date.getMonth())
        setSelectedYear(date.getFullYear())
      }
    }
  }, [value])

  // Format date for display (MM/DD/YYYY)
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    // Parse YYYY-MM-DD format directly to avoid timezone issues
    const parts = dateString.split("-")
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
      const day = parseInt(parts[2], 10)
      const date = new Date(year, month, day)
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      }
    }
    // Fallback for other formats
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  // Handle date selection - format as YYYY-MM-DD without timezone conversion
  const handleDateSelect = (day: number) => {
    // Format directly as YYYY-MM-DD to avoid timezone issues
    const year = selectedYear
    const month = String(selectedMonth + 1).padStart(2, "0") // Month is 0-indexed, so add 1
    const dayStr = String(day).padStart(2, "0")
    const formatted = `${year}-${month}-${dayStr}`
    onChange(formatted)
  }

  // Calendar utilities
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Generate years (current year ± 50 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i)

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, day: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleDateSelect(day)
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Display selected date in input */}
      <Input
        id={id}
        type="text"
        value={formatDate(value)}
        onChange={() => {}} // Controlled by calendar
        required={required}
        placeholder={placeholder}
        readOnly
        className="cursor-default"
        aria-label={label || placeholder}
      />

      {/* Static Calendar */}
      <div className="bg-white border border-border rounded-lg shadow-sm p-3 md:p-4 max-w-[280px]">
        {/* Month and Year Dropdowns */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(Number(e.target.value))
            }}
            className="flex-1 px-3 py-1.5 border border-border rounded-lg bg-bg text-text-main focus:ring-2 focus:ring-accent focus:border-accent hover:border-accent/50 transition-all duration-200 outline-none text-xs font-medium cursor-pointer"
            aria-label="Select month"
          >
            {months.map((month, idx) => (
              <option key={idx} value={idx}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(Number(e.target.value))
            }}
            className="flex-1 px-3 py-1.5 border border-border rounded-lg bg-bg text-text-main focus:ring-2 focus:ring-accent focus:border-accent hover:border-accent/50 transition-all duration-200 outline-none text-xs font-medium cursor-pointer"
            aria-label="Select year"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-[10px] font-semibold text-text-muted py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square" />
          ))}
            {days.map((day) => {
              // Format date string directly to match what handleDateSelect produces
              const year = selectedYear
              const month = String(selectedMonth + 1).padStart(2, "0")
              const dayStr = String(day).padStart(2, "0")
              const dateString = `${year}-${month}-${dayStr}`
              const isSelected = value === dateString
            const isToday =
              day === new Date().getDate() &&
              selectedMonth === new Date().getMonth() &&
              selectedYear === new Date().getFullYear()

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDateSelect(day)}
                onKeyDown={(e) => handleKeyDown(e, day)}
                className={`aspect-square rounded transition-all duration-150 text-xs focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 active:scale-90 ${
                  isSelected
                    ? "bg-accent/10 border-2 border-accent text-text-main font-bold hover:bg-accent/20 active:bg-accent/30"
                    : isToday
                    ? "bg-bg-muted font-semibold text-text-main hover:bg-border active:bg-gray-300"
                    : "text-text-main hover:bg-bg-muted font-medium active:bg-gray-200"
                }`}
                aria-label={`Select ${months[selectedMonth]} ${day}, ${selectedYear}`}
                aria-pressed={isSelected}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
