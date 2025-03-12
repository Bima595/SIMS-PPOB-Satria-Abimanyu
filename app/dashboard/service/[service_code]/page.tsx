'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getServices, type Service, createTransaction } from '@/lib/api/data';
import { useAuth } from '@/lib/hooks/use-auth';
import Header from '@/components/dashboard/header';
import BalanceCard from '@/components/dashboard/balance-card';
import ProfileSection from '@/components/dashboard/profile-section';
import ServicePaymentForm from '@/components/transaction/service-payment-form';
import LoadingSpinner from '@/components/transaction/loading-spinner';
import ServiceNotFound from '@/components/transaction/service-not-found';
import { ServicePaymentHeader } from '@/components/transaction/service-payment-header';
import { ConfirmationModal } from '@/components/transaction/confirm';
import { SuccessModal } from '@/components/transaction/success';
import { FailedModal } from '@/components/transaction/failed';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);

  useEffect(() => {
    async function fetchService() {
      if (!token) {
        console.log('No token available');
        return;
      }

      try {
        setLoading(true);
        const services = await getServices(token);
        const selectedService = services.find(
          (s) => s.service_code === params.service_code
        );
        if (selectedService) {
          setService(selectedService);
          setAmount(
            selectedService.service_tariff
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          );
        } else {
          setService(null);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params?.service_code && token) {
      fetchService();
    }
  }, [params?.service_code, token]);

  const handlePayment = async () => {
    if (!service) return;

    setIsPaying(true);

    try {
      const transactionRequest = {
        service_code: service.service_code,
      };

      await createTransaction(transactionRequest);
      setShowSuccess(true);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Payment error:', error);
      setShowFailed(true);
      setShowConfirmation(false);
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!service) {
    return <ServiceNotFound />;
  }

  return (
    <div className="min-h-screen0">
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
              router.push('/dashboard');
            }}
          />
        )}

        {showFailed && (
          <FailedModal
            serviceName={service.service_name}
            amount={amount}
            onClose={() => {
              setShowFailed(false);
              router.push('/dashboard');
            }}
          />
        )}
      </div>
    </div>
  );
}
