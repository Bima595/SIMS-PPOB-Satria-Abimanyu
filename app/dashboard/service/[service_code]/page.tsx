"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getServices, type Service, createTransaction } from "@/lib/api/data";
import { useAuth } from "@/lib/hooks/use-auth";
import Header from "@/components/dashboard/header";
import BalanceCard from "@/components/dashboard/balance-card";
import ProfileSection from "@/components/dashboard/profile-section";
import ServicePaymentForm from "@/components/transaction/service-payment-form";
import LoadingSpinner from "@/components/transaction/loading-spinner";
import ServiceNotFound from "@/components/transaction/service-not-found";
import { ServicePaymentHeader } from "@/components/transaction/service-payment-header";
import { ConfirmationModal } from "@/components/transaction/confirm";
import { SuccessModal } from "@/components/transaction/success";
import { FailedModal } from "@/components/transaction/failed";

// Interface untuk tipe error yang diharapkan dari API
interface ApiError {
  response?: {
    status?: number;
    data?: any;
  };
  message?: string;
}

// Fungsi helper untuk memeriksa apakah error memiliki status code tertentu
const isAuthError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    return apiError.response?.status === 401 || apiError.response?.status === 403;
  }
  return false;
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token: authToken, isAuthenticated } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // pengecheckan auth dan ambil token yang tepat
  useEffect(() => {
    const checkAuth = async () => {

      await new Promise(resolve => setTimeout(resolve, 100));
      
      const storedToken = authToken || 
                          localStorage.getItem("token") || 
                          document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      if (!storedToken) {
        console.log("No token found, redirecting to login");
        router.replace("/auth/login");
        return;
      }
      
      setAuthChecked(true);
    };
    
    checkAuth();
  }, [authToken, router]);

  // Fetch layanan setelah auth terverifikasi
  useEffect(() => {
    if (!authChecked) return;
    
    const effectiveToken = authToken || 
                           localStorage.getItem("token") || 
                           document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!effectiveToken) return;

    async function fetchService() {
      try {
        setLoading(true);
        const response = await getServices(effectiveToken);
        
        // Periksa apakah response adalah array. Jika tidak, periksa properti yang mungkin mengandung array
        let serviceList: Service[] = [];
        
        if (Array.isArray(response)) {
          serviceList = response;
        } else if (response && typeof response === 'object') {
          const possibleArrayProps = ['data', 'services', 'items', 'results'];
          for (const prop of possibleArrayProps) {
            if (Array.isArray(response[prop])) {
              serviceList = response[prop];
              break;
            }
          }
        }
        
        // Jika masih kosong, log struktur response untuk debugging
        if (serviceList.length === 0) {
          console.error("Unexpected API response structure:", response);
        }
        
        const serviceCode = typeof params.service_code === 'string' 
          ? params.service_code 
          : Array.isArray(params.service_code) 
            ? params.service_code[0] 
            : '';
            
        const selectedService = serviceList.find(
          (s) => s.service_code === serviceCode
        );
        
        if (selectedService) {
          setService(selectedService);
          setAmount(
            selectedService.service_tariff
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          );
        } else {
          console.log("Service not found with code:", serviceCode);
          console.log("Available services:", serviceList);
          setService(null);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        
        // Periksa apakah error berhubungan dengan autentikasi
        if (isAuthError(error)) {
          router.replace("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    }

    if (params?.service_code) {
      fetchService();
    }
  }, [params?.service_code, authToken, authChecked, router]);

  const handlePayment = async () => {
    if (!service) return;
    
    const effectiveToken = authToken || 
                           localStorage.getItem("token") || 
                           document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!effectiveToken) {
      router.replace("/auth/login");
      return;
    }

    setIsPaying(true);

    try {
      const transactionRequest = {
        service_code: service.service_code,
      };

      await createTransaction(transactionRequest, effectiveToken);
      setShowSuccess(true);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Payment error:", error);
      setShowFailed(true);
      setShowConfirmation(false);
      
      // memeriksa apakah error berhubungan dengan auth
      if (isAuthError(error)) {
        setTimeout(() => router.replace("/auth/login"), 2000);
      }
    } finally {
      setIsPaying(false);
    }
  };

  // akan menampilkan loading saat memeriksa autentikasi
  if (!authChecked || loading) {
    return <LoadingSpinner />;
  }

  if (!service) {
    return <ServiceNotFound />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ProfileSection />
          <BalanceCard />
        </div>

        <ServicePaymentHeader service={service} />

        <ServicePaymentForm
          amount={amount}
          isPaying={isPaying}
          onPay={() => setShowConfirmation(true)}
        />

        {showConfirmation && (
          <ConfirmationModal
            serviceName={service.service_name}
            amount={amount}
            onConfirm={handlePayment}
            onCancel={() => setShowConfirmation(false)}
          />
        )}

        {showSuccess && (
          <SuccessModal
            serviceName={service.service_name}
            amount={amount}
            onClose={() => {
              setShowSuccess(false);
              router.push("/dashboard");
            }}
          />
        )}

        {showFailed && (
          <FailedModal
            serviceName={service.service_name}
            amount={amount}
            onClose={() => {
              setShowFailed(false);
              router.push("/dashboard");
            }}
          />
        )}
      </div>
    </div>
  );
}