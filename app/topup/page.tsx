import Header from "@/components/dashboard/header"
import ProfileSection from "@/components/dashboard/profile-section"
import BalanceCard from "@/components/dashboard/balance-card"
import TopUpForm from "@/components/topup/top-up-form"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TopUp() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
  
    if (!token) {
      redirect('/auth/login');
    }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="w-full max-w-[300px]">
              <ProfileSection />
            </div>
            <div className="w-full max-w-[400px]">
              <BalanceCard />
            </div>
          </div>
          <div className="w-full">
            <TopUpForm />
          </div>
        </div>
      </main>
    </div>
  )
}

