import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface SuccessModalProps {
  serviceName: string;
  amount: string;
  onClose: () => void;
}

export function SuccessModal({ serviceName, amount, onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex justify-center items-center mb-6">
          <FaCheckCircle className="text-white text-3xl" />
        </div>

        <p className="text-gray-700">
          Top Up Sebesar
        </p>

        <p className="font-bold text-gray-700 my-2">
          Rp{amount}
        </p>

        <p className="text-gray-700 mb-6">
          berhasil!
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