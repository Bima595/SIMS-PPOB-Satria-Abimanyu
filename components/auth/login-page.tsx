'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { loginUser } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type LoginDto, LoginDtoSchema } from '@/lib/dto/auth.dto';
import { validateDto, getFirstError } from '@/lib/validation/validate';
import { setCookie } from 'cookies-next';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>(
    undefined
  );
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(undefined);
    setApiError('');

    const validationResult = await validateDto(LoginDtoSchema, formData);

    if (!validationResult.success) {
      setErrors(validationResult.errors);
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(validationResult.data!);
    
      if (response.status === 0) {
        // Set token dan user data
        setCookie('token', response.data.token, { path: '/' });
        localStorage.setItem('user', JSON.stringify(response.data.profile));
        
        // Langsung arahkan ke dashboard tanpa reload
        router.push('/dashboard');
      } else {
        if (
          response.message &&
          (response.message.toLowerCase().includes('email') ||
            response.message.toLowerCase().includes('tidak terdaftar') ||
            response.message.toLowerCase().includes('not found') ||
            response.message.toLowerCase().includes('not registered') ||
            response.status === 1001)
        ) {
          setApiError('email tidak terdaftar');
        } else {
          setApiError('password salah');
        }
      }
    } catch (err: any) {
      if (
        err.message &&
        (err.message.toLowerCase().includes('email') ||
          err.message.toLowerCase().includes('tidak terdaftar') ||
          err.message.toLowerCase().includes('not found') ||
          err.message.toLowerCase().includes('not registered') ||
          (err.status && err.status === 1001))
      ) {
        setApiError('email tidak terdaftar');
      } else {
        setApiError('password salah');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-10">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-red-500">
                <Image
                  src="/dashboard/Logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain sm:w-10 sm:h-10"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold">SIMS PPOB</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold">
              Masuk atau buat akun
            </h1>
            <p className="text-xl sm:text-2xl font-bold">untuk memulai</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="masukkan email anda"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 h-10 sm:h-11 text-sm sm:text-base text-gray-700 ${
                      getFirstError(errors, 'email') ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {getFirstError(errors, 'email') && (
                  <p className="text-xs sm:text-sm text-red-500">
                    {getFirstError(errors, 'email')}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400 sm:w-5 sm:h-5"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="masukan password anda"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base text-gray-700 ${
                      getFirstError(errors, 'password') ? 'border-red-500' : ''
                    }`}
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                    )}
                  </div>
                </div>
                {getFirstError(errors, 'password') && (
                  <p className="text-xs sm:text-sm text-red-500">
                    {getFirstError(errors, 'password')}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 sm:h-11 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Masuk'}
            </Button>

            <div className="text-center text-xs sm:text-sm text-gray-600">
              belum punya akun?{' '}
              <Link
                href="/auth/register"
                className="text-red-500 hover:underline"
              >
                registrasi di sini
              </Link>
            </div>
          </form>
          {apiError && (
            <div className="flex items-center justify-between mt-6 px-3 py-2 bg-red-50 rounded-md">
              <p className="text-xs sm:text-sm text-red-500">{apiError}</p>
              <button
                type="button"
                onClick={() => setApiError('')}
                className="text-red-500"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex md:flex-1 bg-pink-50 items-center justify-center">
        <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl p-4 sm:p-6 md:p-8">
          <Image
            src="/auth/Illustrasi Login.png"
            alt="SIMS PPOB Illustration"
            width={500}
            height={300}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}