'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/dashboard/header';
import ProfileSection from '@/components/dashboard/profile-section';
import BalanceCard from '@/components/dashboard/balance-card';
import { getTransactionHistory } from '@/lib/api/data';
import { TransactionHistory } from '@/lib/types';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [offset, setOffset] = useState(0);
  const { token } = useAuth();
  const limit = 5;
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      console.log('No token available, redirecting to login...');
      router.push('/login');
    }
  }, [token, router]);


  useEffect(() => {
    if (token) {

      fetchTransactionHistory();
    }
  }, [token, offset]);

  const fetchTransactionHistory = async () => {
    if (!token) {
      console.error('No token available');
      return;
    }

    try {
      const newTransactions = await getTransactionHistory(token, offset, limit);
      setTransactions((prev) => [...prev, ...newTransactions]);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    }
  };

  const handleShowMore = () => {
    setOffset((prev) => prev + limit);
  };

  if (!token) {
    return null;
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

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Riwayat Transaksi</h2>
          <ul>
            {transactions.map((transaction) => (
              <li
                key={transaction.transaction_id}
                className="mb-4 p-4 bg-white shadow rounded-lg"
              >
                <div className="flex justify-between">
                  <span>{transaction.transaction_type}</span>
                  <span>{transaction.amount}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleShowMore}
              className="px-4 py-2 bg-transparent text-red-500 hover:text-red-600 focus:outline-none"
            >
              Show More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
