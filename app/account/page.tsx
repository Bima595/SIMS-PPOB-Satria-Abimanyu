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
      console.log("No token available, redirecting to login...");
      router.push("/auth/login");
      return;
    }

    // If there's a token, fetch the user profile
    console.log("Token available, trying to fetch user profile...");
    fetchUserProfile()
      .then(() => setIsLoading(false))
      .catch(() => {
        console.log("Failed to fetch profile, redirecting to login...");
        router.push("/auth/login");
      });
  }, [token, router, fetchUserProfile]);

  if (isLoading) {
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
