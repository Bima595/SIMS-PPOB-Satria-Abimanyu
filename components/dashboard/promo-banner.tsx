"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { getBanners, type Banner } from "@/lib/api/data";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function PromoBanner() {
  const { token, isAuthenticated } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBanners() {
      if (!token) return;

      try {
        setLoading(true);
        const data = await getBanners(token);
        setBanners(data);
        setError("");
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError(err instanceof Error ? err.message : "Failed to load promotions");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchBanners();
    }
  }, [token]);

  if (!isAuthenticated && !token) {
    return null;
  }

  // Enhanced skeleton loader with proper structure
  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Temukan promo menarik</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-40 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Temukan promo menarik</h2>
        <div className="text-red-500 text-center py-4 border border-red-100 rounded-lg bg-red-50">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Temukan promo menarik</h2>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.banner_name}>
            <Link
              href={`/dashboard/promo/${banner.banner_name}`}
              className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={banner.banner_image || "/placeholder.svg"}
                  alt={banner.banner_name}
                  fill
                  className="object-cover"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}