"use client"

import { useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/lib/hooks/use-media-query"

interface MonthSelectorProps {
  selectedMonth: number
  selectedYear: number
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
}

export default function MonthSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: MonthSelectorProps) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const selectedElement = container.children[selectedMonth] as HTMLElement

      if (selectedElement) {
        const containerWidth = container.offsetWidth
        const elementOffset = selectedElement.offsetLeft
        const elementWidth = selectedElement.offsetWidth

        const scrollPosition = elementOffset - containerWidth / 2 + elementWidth / 2
        container.scrollTo({ left: scrollPosition, behavior: "smooth" })
      }
    }
  }, [selectedMonth])

  const scrollContainer = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = isMobile ? 100 : 200
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
        <button
          onClick={() => scrollContainer("left")}
          className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div ref={scrollContainerRef} className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide flex-grow">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => onMonthChange(index)}
              className={cn(
                "whitespace-nowrap py-1 text-xs sm:text-sm transition-colors flex-shrink-0",
                selectedMonth === index ? "text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900",
              )}
            >
              {month}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollContainer("right")}
          className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <select
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="px-3 py-1 border rounded-md text-sm bg-white w-full sm:w-auto"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}

