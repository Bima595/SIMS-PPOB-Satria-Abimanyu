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
      if (!token) return;

      try {
        setLoading(true);
        const data = await getServices(token);
        
        // Periksa apakah data adalah array
        if (Array.isArray(data)) {
          setServices(data);
        } else if (data && typeof data === 'object') {
          // Jika data adalah objek yang memiliki properti array (misalnya data.services)
          // Periksa properti umum seperti 'data', 'services', 'items', dll.
          const serviceArray = data.data || data.services || data.items || [];
          if (Array.isArray(serviceArray)) {
            setServices(serviceArray);
          } else {
            console.error("Unexpected API response structure:", data);
            setError("Invalid data format received from API");
            setServices([]);
          }
        } else {
          console.error("Unexpected API response:", data);
          setError("Invalid data format received from API");
          setServices([]);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err instanceof Error ? err.message : "Failed to load services");
        setServices([]);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchServices();
    }
  }, [token]);

  if (!isAuthenticated && !token) {
    return null;
  }

  // Enhanced skeleton loader with better structure
  if (loading) {
    return (
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4 mb-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center p-2">
            <div className="animate-pulse bg-gray-200 w-12 h-12 rounded-md mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4 border border-red-100 rounded-lg bg-red-50">
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

  // Jika services kosong, tampilkan pesan
  if (!services.length) {
    return (
      <div className="text-center py-4 border border-gray-100 rounded-lg bg-gray-50">
        <p className="text-gray-500">No services available</p>
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