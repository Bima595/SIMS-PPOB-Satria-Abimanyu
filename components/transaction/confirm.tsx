import React from 'react';

interface ConfirmationModalProps {
  serviceName: string;
  amount: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  serviceName,
  amount,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-120 h-75 flex flex-col justify-center items-center text-center">
        <div className="flex justify-center mb-4">
          <img src="/dashboard/Logo.png" alt="Icon" className="w-12 h-12" />
        </div>

        <p className="text-gray-700">Beli {serviceName} Senilai</p>

        <p className="font-bold text-gray-700 my-2">Rp{amount} ?</p>

        {/* Tombol dalam tata letak kolom */}
        <div className="flex flex-col space-y-4 w-full">
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-bold text-red-600 rounded hover:bg-red-50"
          >
            Ya, lanjutkan Bayar
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 font-bold text-gray-700 rounded hover:bg-gray-400"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}