"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getProfile, updateProfile, uploadProfileImage, getToken } from "@/lib/api/profile"
import ProfileForm from "./profile-form"
import Cookies from "js-cookie"
import { toast } from "sonner"
import type { Profile } from "@/lib/api/profile"

export default function ProfileContainer() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if token exists before making the API call
        const token = getToken()
        if (!token) {
          console.error("No token found")
          router.push("/auth/login")
          return
        }

        const profileData = await getProfile()
        setProfile(profileData)
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        setError("Failed to load profile data")

        if (err instanceof Error && err.message?.includes("token")) {
          router.push("/auth/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleUpdateProfile = async (data: { first_name: string; last_name: string }) => {
    try {
      await updateProfile(data)

      setProfile((prev: any) => {
        if (!prev) return null

        return {
          ...prev,
          first_name: data.first_name,
          last_name: data.last_name,
        }
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  const handleUploadImage = async (file: File) => {
    try {
      if (file.size > 100 * 1024) {
        const error = new Error("File size exceeds 100KB limit")
        error.name = "FileSizeError"
        throw error
      }

      const response = await uploadProfileImage(file)

      // Create a new profile object instead of modifying the existing one
      setProfile((prev) => {
        if (!prev) return null

        const updatedImage = `${response.data.profile_image}${response.data.profile_image.includes("?") ? "&" : "?"}t=${Date.now()}`

        return {
          ...prev,
          profile_image: updatedImage,
        }
      })

      // Force a re-render after a short delay to ensure the image is updated
      setTimeout(() => {
        setProfile((currentProfile) => {
          if (!currentProfile) return null
          return { ...currentProfile }
        })
      }, 100)

      return response
    } catch (error) {
      console.error("Error uploading image:", error)

      if (error instanceof Error && error.name === "FileSizeError") {
        toast.error("Gambar terlalu besar! Maksimum 100KB", {
          duration: 5000,
        })
      } else {
        toast.error("Gagal mengunggah gambar. Silakan coba lagi.", {
          duration: 5000,
        })
      }

      throw error
    }
  }

  const handleLogout = () => {
    // Clear token from both cookie and localStorage
    Cookies.remove("token")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth/login")
    toast.success("Berhasil logout")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">{error || "Failed to load profile"}</p>
          <button onClick={() => router.push("/auth/login")} className="px-4 py-2 bg-red-500 text-white rounded-md">
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <ProfileForm
      profile={profile}
      onUpdateProfile={handleUpdateProfile}
      onUploadImage={handleUploadImage}
      onLogout={handleLogout}
    />
  )
}