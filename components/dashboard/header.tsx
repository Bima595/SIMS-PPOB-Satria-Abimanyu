"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <Image src="/dashboard/Logo.png" alt="SIMS PPOB" width={30} height={30} className="h-8 w-auto" />
              <span className="ml-2 text-lg font-semibold text-gray-900">SIMS PPOB</span>
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-red-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div
              className={`${
                isMenuOpen ? 'block' : 'hidden'
              } absolute top-16 right-0 bg-white shadow-md w-full md:relative md:top-0 md:shadow-none md:flex md:items-center md:space-x-4 md:w-auto`}
            >
              <Link href="/dashboard/topup" className="block py-2 px-4 text-gray-700 hover:text-red-600">
                Top Up
              </Link>
              <Link href="/transaction" className="block py-2 px-4 text-gray-700 hover:text-red-600">
                Transaction
              </Link>
              <Link href="/dashboard/account" className="block py-2 px-4 text-gray-700 hover:text-red-600">
                Akun
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}