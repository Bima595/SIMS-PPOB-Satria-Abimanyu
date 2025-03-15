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
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Profile & Balance Card Skeleton */}
          <div className="flex flex-col md:flex-row md:space-x-8 mb-6 sm:mb-8">
            {/* Profile Section Skeleton */}
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <div className="flex flex-col items-left mb-8">
                <div className="w-20 h-20 mb-4 overflow-hidden rounded-full bg-gray-200 animate-pulse" />
                <div className="text-left space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse w-24 rounded" />
                  <div className="h-6 bg-gray-200 animate-pulse w-48 rounded" />
                </div>
              </div>
            </div>
            
            {/* Balance Card Skeleton */}
            <div className="w-full md:w-2/3">
              <div 
                className="text-white rounded-lg p-6 mb-8 relative overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/dashboard/Background Saldo.png')" }}
              >
                <h3 className="text-lg font-medium mb-2">Saldo anda</h3>
                <div className="animate-pulse h-10 w-44 bg-white bg-opacity-20 rounded mb-4"></div>
                <div className="animate-pulse h-6 w-32 bg-white bg-opacity-20 rounded"></div>
              </div>
            </div>
          </div>

          {/* Transaction History Skeleton */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-7 bg-gray-200 animate-pulse w-64 rounded" />
              <div className="h-6 bg-gray-200 animate-pulse w-32 rounded" />
            </div>

            {/* Transaction Items Skeleton */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="border-b border-gray-100 py-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3" />
                    <div>
                      <div className="h-5 bg-gray-200 animate-pulse w-36 rounded mb-2" />
                      <div className="h-4 bg-gray-200 animate-pulse w-24 rounded" />
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 animate-pulse w-24 rounded" />
                </div>
                <div className="ml-13 pl-13">
                  <div className="h-4 bg-gray-200 animate-pulse w-48 rounded mt-2" />
                </div>
              </div>
            ))}
            
            {/* Pagination Skeleton */}
            <div className="flex justify-between items-center mt-6">
              <div className="h-8 bg-gray-200 animate-pulse w-24 rounded" />
              <div className="flex space-x-2">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-8 w-8 bg-gray-200 animate-pulse rounded" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
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