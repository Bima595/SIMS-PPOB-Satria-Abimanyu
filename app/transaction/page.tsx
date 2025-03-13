"use client"

import { useEffect, useState } from "react"
import Header from "@/components/dashboard/header"
import ProfileSection from "@/components/dashboard/profile-section"
import BalanceCard from "@/components/dashboard/balance-card"
import TransactionHistoryList from "@/components/history/transaction-history-list"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function TransactionPage() {
  const { token, isAuthenticated, fetchUserProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Jika token tidak ada, coba fetch profile untuk memeriksa autentikasi
    if (!token) {
      console.log("No token available, trying to fetch user profile...")
      fetchUserProfile()
        .then(() => setIsLoading(false))
        .catch(() => {
          console.log("Failed to fetch profile, redirecting to login...")
          router.push("/auth/login")
        })
    } else {
      setIsLoading(false)
    }
  }, [token, router, fetchUserProfile])

  if (isLoading) {
    return <div>Loading...</div> // Tampilkan loading indicator
  }

  if (!isAuthenticated) {
    return null // Redirect sudah ditangani di useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col md:flex-row md:space-x-8 mb-6 sm:mb-8">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <ProfileSection />
          </div>
          <div className="w-full md:w-2/3">
            <BalanceCard />
          </div>
        </div>

        <TransactionHistoryList token={token!} />
      </main>
    </div>
  )
}