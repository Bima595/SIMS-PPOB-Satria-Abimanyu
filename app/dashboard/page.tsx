import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@/components/dashboard/header';
import ProfileSection from '@/components/dashboard/profile-section';
import BalanceCard from '@/components/dashboard/balance-card';
import ServiceGrid from '@/components/dashboard/service-grid';
import PromoBanner from '@/components/dashboard/promo.banner';

export default async function Dashboard() {
  const cookieStore = await cookies(); // Tambahkan await di sini
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>
    </div>
  );
}
