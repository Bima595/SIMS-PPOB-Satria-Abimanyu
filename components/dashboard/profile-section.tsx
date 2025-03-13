"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfileSection() {
  const { user, isAuthenticated, fetchUserProfile, token } = useAuth();
  const defaultProfileImage = "/dashboard/Profile Photo.png";

  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [isLoading, setIsLoading] = useState(true);

  // Cek token dulu sebelum mengambil profil
  useEffect(() => {
    if (token) {
      const loadProfile = async () => {
        try {
          await fetchUserProfile();
        } finally {
          setIsLoading(false);
        }
      };
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [token, fetchUserProfile]);

  useEffect(() => {
    if (user?.profile_image) {
      setProfileImage(user.profile_image);
    } else {
      setProfileImage(defaultProfileImage);
    }
  }, [user, fetchUserProfile]);

  // **Jangan ubah token**, hanya simpan token baru jika berubah
  useEffect(() => {
    const prevToken = localStorage.getItem("auth_token");
    if (token && token !== prevToken) {
      localStorage.setItem("auth_token", token);
      fetchUserProfile();
    }
  }, [token, fetchUserProfile]);

  const handleImageError = () => {
    setProfileImage(defaultProfileImage);
  };

  if (!isAuthenticated || !token) {
    return null;
  }

  return (
    <div className="flex flex-col items-left mb-8">
      <div className="w-20 h-20 mb-4 overflow-hidden rounded-full border border-gray-300">
        {!isLoading ? (
          <Image
            src={profileImage}
            alt="Profile"
            width={80}
            height={80}
            className="object-cover w-full h-full rounded-full"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
        )}
      </div>
      <div className="text-left">
        {!isLoading ? (
          <>
            <p className="text-gray-600">Selamat datang,</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.first_name} {user?.last_name}
            </h2>
          </>
        ) : (
          <>
            <div className="h-4 bg-gray-200 animate-pulse w-24 mb-2" />
            <div className="h-6 bg-gray-200 animate-pulse w-48" />
          </>
        )}
      </div>
    </div>
  );
}
