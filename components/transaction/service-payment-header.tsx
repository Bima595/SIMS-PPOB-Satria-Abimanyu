import React from 'react';
import Image from 'next/image';
import { Service } from '@/lib/api/data';

interface ServicePaymentHeaderProps {
  service: Service;
}

export const ServicePaymentHeader: React.FC<ServicePaymentHeaderProps> = ({
  service,
}) => {
  return (
    <>
      <h2 className="text-lg sm:text text-gray-900 mb-4">PemBayaran</h2>

      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        {service.service_icon && (
          <Image
            src={service.service_icon}
            alt={service.service_name}
            width={40}
            height={40}
            className="w-10 h-10 "
          />
        )}
        <h1 className="text-2xl sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
          {service.service_name}
        </h1>
      </div>
    </>
  );
};
