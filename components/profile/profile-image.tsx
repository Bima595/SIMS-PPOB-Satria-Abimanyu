"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Pencil } from "lucide-react"
import { toast, Toaster } from "sonner"

interface ProfileImageProps {
  imageUrl: string | null
  onImageUpload: (file: File) => Promise<any> // Changed from Promise<void> to Promise<any>
}

// Add this function before the component definition
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " bytes"
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export default function ProfileImage({ imageUrl, onImageUpload }: ProfileImageProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [uploadError, setUploadError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>("/dashboard/Profile Photo.png")
  const [imageKey, setImageKey] = useState<number>(Date.now()) // Add a key to force re-render
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (imageUrl && !imageError) {
      // Add a cache-busting parameter to the URL
      const cacheBuster = `?t=${Date.now()}`
      setImageSrc(`${imageUrl}${cacheBuster}`)
      setImageKey(Date.now())
    } else {
      setImageSrc("/dashboard/Profile Photo.png")
    }
  }, [imageUrl, imageError])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 100 * 1024) {
      toast.error(`File terlalu besar! Ukuran file Anda ${formatFileSize(file.size)}, maksimum 100KB`, {
        duration: 8000,
        position: "top-center",
        style: {
          background: "#FEE2E2",
          color: "#B91C1C",
          border: "2px solid #EF4444",
          fontWeight: "bold",
          fontSize: "1.05rem",
          padding: "12px 16px",
        },
      })

      setUploadError(true)
      setTimeout(() => setUploadError(false), 3000)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    try {
      setIsUploading(true)
      await onImageUpload(file)
      toast.success("Gambar profil berhasil diperbarui")
      setImageError(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Gagal mengunggah gambar")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <Toaster richColors closeButton position="top-center" />

      <div
        className={`w-24 h-24 rounded-full overflow-hidden bg-gray-100 border ${uploadError ? "border-red-500 ring-2 ring-red-300" : "border-gray-200"}`}
      >
        <Image
          key={imageKey}
          src={imageSrc || "/placeholder.svg"}
          alt="Profile"
          width={96}
          height={96}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          unoptimized={true}
          priority={true}
        />
      </div>

      {uploadError && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-red-600">
          Maksimum 100KB
        </div>
      )}

      <button
        onClick={handleImageClick}
        className={`absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border ${uploadError ? "border-red-500" : "border-gray-200"}`}
        disabled={isUploading}
      >
        <Pencil size={16} className={uploadError ? "text-red-500" : ""} />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  )
}

