import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface SuccessModalProps {
  serviceName: string;
  amount: string;
  onClose: () => void;
}

export function SuccessModal({ serviceName, amount, onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">

        <div className="flex justify-center mb-4">
          <FaCheckCircle className="text-green-500 text-5xl" /> 
        </div>

        <h2 className="text-lg font-semibold mb-4">Pembayaran Berhasil</h2>
        <p className="mb-6 text-gray-700">
          Pembayaran {serviceName} sebesar <span className="font-bold">Rp{amount}</span> berhasil.
        </p>

        <button
          onClick={onClose}
          className="px-4 py-2 text-red-600 hover:text-red-700 font-semibold rounded hover:bg-red-50"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}