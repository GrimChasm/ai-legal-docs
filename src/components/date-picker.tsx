"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "./ui/input"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  id?: string
  required?: boolean
  placeholder?: string
}

export default function DatePicker({
  value,
  onChange,
  id,
  required,
  placeholder = "Select date",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const pickerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setSelectedMonth(date.getMonth())
        setSelectedYear(date.getFullYear())
      }
    }
  }, [value])

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

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const handleDateSelect = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day)
    const formatted = date.toISOString().split("T")[0]
    onChange(formatted)
    setIsOpen(false)
  }

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

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i)

  const getInputPosition = () => {
    if (!inputRef.current) return { top: 0, left: 0 }
    const rect = inputRef.current.getBoundingClientRect()
    const scrollY = window.scrollY || window.pageYOffset
    const scrollX = window.scrollX || window.pageXOffset
    
    // Position below the input with some spacing
    let top = rect.bottom + scrollY + 8
    let left = rect.left + scrollX
    
    // Check if calendar would go off bottom of viewport
    const viewportHeight = window.innerHeight
    const calendarHeight = 350 // Approximate calendar height
    if (rect.bottom + calendarHeight > viewportHeight) {
      // Position above input instead
      top = rect.top + scrollY - calendarHeight - 8
    }
    
    // Check if calendar would go off right edge
    const viewportWidth = window.innerWidth
    const calendarWidth = 300
    if (left + calendarWidth > viewportWidth) {
      left = viewportWidth - calendarWidth - 16
    }
    
    return { top, left }
  }

  const position = isOpen ? getInputPosition() : { top: 0, left: 0 }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={formatDate(value)}
          onChange={() => {}} // Controlled by calendar
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          ref={pickerRef}
          className="fixed z-50 bg-bg border border-border rounded-lg shadow-lg p-4 min-w-[300px]"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {/* Month and Year Dropdowns */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-bg text-text-main focus:ring-2 focus:ring-accent focus:border-accent outline-none text-sm"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-bg text-text-main focus:ring-2 focus:ring-accent focus:border-accent outline-none text-sm"
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
              <div key={day} className="text-center text-xs font-semibold text-text-muted py-1">
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
              const isSelected =
                value &&
                new Date(value).getDate() === day &&
                new Date(value).getMonth() === selectedMonth &&
                new Date(value).getFullYear() === selectedYear
              const isToday =
                day === new Date().getDate() &&
                selectedMonth === new Date().getMonth() &&
                selectedYear === new Date().getFullYear()

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`aspect-square rounded-lg hover:bg-bg-muted transition-colors text-sm font-medium ${
                    isSelected
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : isToday
                      ? "bg-bg-muted font-semibold text-text-main"
                      : "text-text-main"
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
