'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { getBalance } from '@/lib/api/data';

export default function BalanceCard() {
  const { user, token, isAuthenticated } = useAuth();
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBalance() {
      if (!token || !isAuthenticated) {
        console.log('No token available or not authenticated');
        return;
      }

      try {
        setLoading(true);
        const balanceData = await getBalance(token);
        console.log('Fetched balance:', balanceData);
        setBalance(balanceData);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError(err instanceof Error ? err.message : 'Failed to load balance');
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [token, isAuthenticated]);

  if (!user) return null;

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-red-500 text-white rounded-lg p-6 mb-8 relative overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-10">
        <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100C0 100 20 50 50 50C80 50 70 0 120 0C170 0 180 50 200 50V100H0Z" fill="white" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Saldo anda</h3>
      {loading ? (
        <div className="animate-pulse h-8 w-32 bg-white bg-opacity-20 rounded mb-4"></div>
      ) : error ? (
        <div className="text-sm mb-4">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="text-sm underline hover:no-underline mt-1">
            Try again
          </button>
        </div>
      ) : (
        <p className="text-3xl font-bold mb-4">
          {showBalance && balance !== null ? formatCurrency(balance) : 'Rp •••••••'}
        </p>
      )}
      <button
        onClick={toggleBalance}
        className="flex items-center text-sm font-medium"
        disabled={loading || balance === null}
      >
        <span className="mr-1">Lihat Saldo</span>
        {showBalance ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
      </button>
    </div>
  );
}