"use client"

import { useState, useEffect } from "react"
import { getTransactionHistory } from "@/lib/api/data"
import type { TransactionRecord } from "@/lib/api/data"
import TransactionItem from "./transaction-item"
import MonthSelector from "./month-selector"

interface TransactionHistoryListProps {
  token: string
}

export default function TransactionHistoryList({ token }: TransactionHistoryListProps) {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [offset, setOffset] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const limit = 5

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) return

      setIsLoading(true)
      try {
        const records = await getTransactionHistory(token, offset, limit)

        const filteredRecords = records.filter((transaction) => {
          const date = new Date(transaction.created_on)
          return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
        })

        if (offset === 0) {
          setTransactions(filteredRecords)
        } else {
          setTransactions((prev) => [...prev, ...filteredRecords])
        }

        setHasMore(records.length >= limit)
      } catch (error) {
        console.error("Failed to fetch transaction history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [token, offset, selectedMonth, selectedYear])

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month)
    setOffset(0)
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    setOffset(0) 
  }

  const handleShowMore = () => {
    setOffset((prev) => prev + limit)
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Semua Transaksi</h2>

      <MonthSelector
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />

      <div className="space-y-3 sm:space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionItem key={transaction.invoice_number} transaction={transaction} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-4 text-sm sm:text-base">
            {isLoading ? "Memuat transaksi..." : "Tidak ada transaksi"}
          </p>
        )}
      </div>

      {hasMore && (
        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={handleShowMore}
            disabled={isLoading}
            className="text-red-500 text-sm sm:text-base font-medium hover:text-red-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Memuat..." : "Show more"}
          </button>
        </div>
      )}
    </div>
  )
}

