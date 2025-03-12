"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfileSection() {
  const { user, isAuthenticated, fetchUserProfile } = useAuth();
  const [profileImage, setProfileImage] = useState<string>("/dashboard/Profile Photo.png");

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user, fetchUserProfile]);

  useEffect(() => {
    const imageUrl = user?.profile_image || "/dashboard/Profile Photo.png";
    const img = document.createElement("img");
    img.src = imageUrl;

    img.onload = () => {
      setProfileImage(imageUrl);
    };

    img.onerror = () => {
      setProfileImage("/dashboard/Profile Photo.png");
    };
  }, [user]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex flex-col items-left mb-8">
      <div className="w-20 h-20 mb-4">
        <Image
          src={profileImage}
          alt="Profile"
          width={80}
          height={80}
          className="rounded-full"
          onError={(e) => {
            e.currentTarget.src = "/dashboard/Profile Photo.png";
          }}
        />
      </div>
      <div className="text-left">
        <p className="text-gray-600">Selamat datang,</p>
        <h2 className="text-2xl font-bold text-gray-900">
          {user.first_name} {user.last_name}
        </h2>
      </div>
    </div>
  );
}