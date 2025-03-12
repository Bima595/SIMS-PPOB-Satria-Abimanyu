import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ServicePaymentFormProps {
  amount: string;
  isPaying: boolean;
  onPay: () => void;
}

export default function ServicePaymentForm({ amount, isPaying, onPay }: ServicePaymentFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm sm:text-base font-medium text-gray-700">
          Jumlah Pembayaran
        </label>
        <input
          type="text"
          id="amount"
          value={amount}
          readOnly
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
      </div>
      <Button
        onClick={onPay}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        disabled={isPaying}
      >
        {isPaying ? <Loader2 className="animate-spin w-5 h-5" /> : "Bayar"}
      </Button>
    </div>
  );
}