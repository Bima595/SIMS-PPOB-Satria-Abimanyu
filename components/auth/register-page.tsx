"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, User } from "lucide-react"
import { registerUser } from "../../lib/api/auth"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { type RegisterDto, RegisterDtoSchema } from "../../lib/dto/auth.dto"
import { validateDto, getFirstError } from "../../lib/validation/validate"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterDto>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>(undefined)
  const [apiError, setApiError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors(undefined)
    setApiError("")

    const validationResult = await validateDto(RegisterDtoSchema, formData)

    if (!validationResult.success) {
      setErrors(validationResult.errors)
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...registrationData } = validationResult.data!
      const response = await registerUser(registrationData)

      if (response.status === 0) {
        router.push("/auth/login")
      } else {
        setApiError(response.message || "Registration failed")
      }
    } catch (err) {
      setApiError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white">
      {/* Form Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-10">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white sm:w-6 sm:h-6"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h.01" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold">SIMS PPOB</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold">Lengkapi data untuk</h1>
            <p className="text-sm sm:text-base text-gray-600">membuat akun</p>
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
                    placeholder="wallet@nutech.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 h-10 sm:h-11 text-sm sm:text-base text-gray-700${getFirstError(errors, "email") ? "border-red-500" : ""}`}
                  />
                </div>
                {getFirstError(errors, "email") && (
                  <p className="text-xs sm:text-sm text-red-500">{getFirstError(errors, "email")}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    name="first_name"
                    placeholder="Kristanto"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`pl-10 h-10 sm:h-11 text-sm sm:text-base text-gray-700${getFirstError(errors, "first_name") ? "border-red-500" : ""}`}
                  />
                </div>
                {getFirstError(errors, "first_name") && (
                  <p className="text-xs sm:text-sm text-red-500">{getFirstError(errors, "first_name")}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    name="last_name"
                    placeholder="Wibowo"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`pl-10 h-10 sm:h-11 text-sm sm:text-base text-gray-700${getFirstError(errors, "last_name") ? "border-red-500" : ""}`}
                  />
                </div>
                {getFirstError(errors, "last_name") && (
                  <p className="text-xs sm:text-sm text-red-500">{getFirstError(errors, "last_name")}</p>
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base text-gray-700 ${getFirstError(errors, "password") ? "border-red-500" : ""}`}
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {getFirstError(errors, "password") && (
                  <p className="text-xs sm:text-sm text-red-500">{getFirstError(errors, "password")}</p>
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
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="konfirmasi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base text-gray-700 ${getFirstError(errors, "confirmPassword") ? "border-red-500" : ""}`}
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {getFirstError(errors, "confirmPassword") && (
                  <p className="text-xs sm:text-sm text-red-500">{getFirstError(errors, "confirmPassword")}</p>
                )}
              </div>
            </div>

            {apiError && (
              <Alert variant="destructive" className="py-2 border-red-200 bg-red-50">
                <AlertDescription className="text-xs sm:text-sm text-red-500">{apiError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-10 sm:h-11 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? "Loading..." : "Registrasi"}
            </Button>

            <div className="text-center text-xs sm:text-sm text-gray-700">
              sudah punya akun?{" "}
              <Link href="/auth/login" className="text-red-500 hover:underline">
                login di sini
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:flex md:flex-1 bg-pink-50 items-center justify-center">
        <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl p-4 sm:p-6 md:p-8">
          <img src="/auth/Illustrasi Login.png" alt="SIMS PPOB Illustration" className="w-full h-auto object-contain" />
        </div>
      </div>
    </div>
  )
}

