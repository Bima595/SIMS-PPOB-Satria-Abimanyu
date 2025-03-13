import type { TransactionRecord } from "@/lib/api/data"

interface TransactionItemProps {
  transaction: TransactionRecord
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const day = date.getDate()
    const month = date.toLocaleString("id-ID", { month: "long" })
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":") + " WIB"
  }

  const formatCurrency = (amount: number): string => {
    return `Rp${amount.toLocaleString("id-ID")}`
  }

  const getTransactionTypeLabel = (type: string, description: string) => {
    switch (type) {
      case "TOPUP":
        return "Top Up Saldo"
      case "PAYMENT":
        return description || "Pembayaran"
      default:
        return description || type
    }
  }

  const isTopUp = transaction.transaction_type === "TOPUP"
  const textColorClass = isTopUp ? "text-green-500" : "text-red-500"
  const amountPrefix = isTopUp ? "+ " : "- "

  return (
    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
        <div>
          <p className={`text-base sm:text-lg font-medium ${textColorClass}`}>
            {amountPrefix}
            {formatCurrency(transaction.total_amount)}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            {formatDate(transaction.created_on)} · {formatTime(transaction.created_on)}
          </p>
        </div>
        <div className="text-left sm:text-right mt-1 sm:mt-0">
          <p className="text-gray-600 text-sm">
            {getTransactionTypeLabel(transaction.transaction_type, transaction.description)}
          </p>
        </div>
      </div>
    </div>
  )
}

