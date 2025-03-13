
'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import ProfileSection from '@/components/dashboard/profile-section';
import BalanceCard from '@/components/dashboard/balance-card';
import ServiceGrid from '@/components/dashboard/service-grid';
import PromoBanner from '@/components/dashboard/promo-banner';
import { useEffect } from 'react';

export function DashboardContent() {
  const { isAuthenticated, user, fetchUserProfile } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user, fetchUserProfile]);

  if (!user) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <>
      <div className="md:flex md:space-x-8">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <ProfileSection />
        </div>
        <div className="md:w-2/3">
          <BalanceCard />
        </div>
      </div>
      <ServiceGrid />
      <PromoBanner />
    </>
  );
}