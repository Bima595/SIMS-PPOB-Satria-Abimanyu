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
      if (!token || !isAuthenticated) {
        console.log("No token available or not authenticated");
        return;
      }

      try {
        setLoading(true);
        const data = await getBanners(token);
        console.log("Fetched banners:", data);
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError(err instanceof Error ? err.message : "Failed to load promotions");
      } finally {
        setLoading(false);
      }
    }

    fetchBanners();
  }, [token, isAuthenticated]);

  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Temukan promo menarik</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Temukan promo menarik</h2>
        <div className="text-red-500 text-center py-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Try again
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