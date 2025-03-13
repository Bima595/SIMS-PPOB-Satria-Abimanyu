"use client";

import type React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface ProfileImageProps {
  imageUrl: string | null;
  onImageUpload: (file: File) => Promise<void>;
}

export default function ProfileImage({ imageUrl, onImageUpload }: ProfileImageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024) {
      toast.error("Ukuran gambar maksimum 100KB");
      return;
    }

    try {
      setIsUploading(true);
      await onImageUpload(file);
      toast.success("Gambar profil berhasil diperbarui");
      setImageError(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const imageSource = imageUrl && !imageError ? imageUrl : "/dashboard/Profile Photo.png";

  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
        <Image
          src={imageSource}
          alt="Profile"
          width={96}
          height={96}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      <button
        onClick={handleImageClick}
        className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200"
        disabled={isUploading}
      >
        <Pencil size={16} />
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
  );
}