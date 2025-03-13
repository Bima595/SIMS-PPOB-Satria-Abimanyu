import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@/components/dashboard/header';
import {DashboardContent} from '@/components/dashboard/dashboard-content';
import { AuthProvider } from '@/lib/hooks/use-auth';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardContent />
        </main>
      </div>
    </AuthProvider>
  );
}
