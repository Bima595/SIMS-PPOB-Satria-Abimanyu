"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { getServices, type Service } from "../../lib/api/data";
import Image from "next/image";
import Link from "next/link";

export default function ServiceGrid() {
  const { token, isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      if (!token || !isAuthenticated) return;

      try {
        setLoading(true);
        const data = await getServices(token);
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load services");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [token, isAuthenticated]);

  if (loading) {
    return (
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4 mb-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col items-center">
            <div className="bg-gray-200 w-12 h-12 rounded-md mb-2"></div>
            <div className="bg-gray-200 h-4 w-16 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4 mb-8">
      {services.map((service) => (
        <Link href={`/dashboard/service/${service.service_code}`} key={service.service_code} passHref>
          <div className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="w-12 h-12 mb-2 relative">
              <Image src={service.service_icon || "/placeholder.svg"} alt={service.service_name} width={48} height={48} className="object-contain" />
            </div>
            <span className="text-xs text-center">{service.service_name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
