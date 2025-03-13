"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header";
import ProfileContainer from "@/components/profile/profile-container";

export default function ProfilePage() {
  const { token, fetchUserProfile } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.log("No token available, trying to fetch user profile...");
      fetchUserProfile()
        .then(() => setIsLoading(false))
        .catch(() => {
          console.log("Failed to fetch profile, redirecting to login...");
          router.push("/auth/login");
        });
    } else {
      setIsLoading(false);
    }
  }, [token, router, fetchUserProfile]);

  if (isLoading) {
    return null;
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-6">
        <ProfileContainer />
      </div>
    </div>
  );
}
