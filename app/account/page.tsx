"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"
import Header from "@/components/dashboard/header"
import ProfileContainer from "@/components/profile/profile-container"
import { getToken } from "@/lib/api/profile"

export default function ProfilePage() {
  const { fetchUserProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      console.log("No token found, redirecting to login")
      router.push("/auth/login")
      return
    }

    fetchUserProfile()
      .then(() => setIsLoading(false))
      .catch((error) => {
        console.error("Error fetching user profile:", error)
        router.push("/auth/login")
      })
  }, [router, fetchUserProfile])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-6">
        <ProfileContainer />
      </div>
    </div>
  )
}

