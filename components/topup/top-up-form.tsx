"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { topUp } from "@/lib/api/topup"
import { ConfirmationModal } from "@/components/topup/confirm"
import { SuccessModal } from "@/components/topup/success"
import { FailedModal } from "@/components/topup/failed"
import { FaMoneyBillWave } from "react-icons/fa"

const PRESET_AMOUNTS = [10000, 20000, 50000, 100000, 250000, 500000]
const MIN_AMOUNT = 10000
const MAX_AMOUNT = 1000000

export default function TopUpForm() {
  const [amount, setAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [showFailedModal, setShowFailedModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isValidAmount, setIsValidAmount] = useState<boolean>(false)
  const [successAmount, setSuccessAmount] = useState<string>("")

  useEffect(() => {
    const numAmount = amount ? Number.parseInt(amount) : 0
    setIsValidAmount(numAmount >= MIN_AMOUNT && numAmount <= MAX_AMOUNT)
  }, [amount])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const numValue = value ? Number.parseInt(value) : 0
    if (numValue <= MAX_AMOUNT) {
      setAmount(value)
    }
  }

  const handlePresetAmount = (value: number) => {
    setAmount(value.toString())
  }

  const handleTopUpClick = async () => {
    const numAmount = Number.parseInt(amount)

    if (numAmount < MIN_AMOUNT) {
      setErrorMessage(`Minimum top up amount is Rp${MIN_AMOUNT.toLocaleString("id-ID")}`)
      setShowFailedModal(true)
      return
    }

    if (numAmount > MAX_AMOUNT) {
      setErrorMessage(`Maximum top up amount is Rp${MAX_AMOUNT.toLocaleString("id-ID")}`)
      setShowFailedModal(true)
      return
    }
    setShowConfirmModal(true)
  }

  const handleConfirmTopUp = async () => {
    setShowConfirmModal(false)
    setIsLoading(true)

    try {
      const currentFormattedAmount = Number.parseInt(amount).toLocaleString("id-ID")
      setSuccessAmount(currentFormattedAmount)

      const request = {
        top_up_amount: Number.parseInt(amount),
      }

      const response = await topUp(request as any)

      setShowSuccessModal(true)
      setAmount("")
    } catch (error) {
      console.error("Top up error:", error)
      setErrorMessage(error instanceof Error ? error.message : "An error occurred during top up")

      setShowFailedModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelTopUp = () => {
    setShowConfirmModal(false)
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }

  const handleCloseFailedModal = () => {
    setShowFailedModal(false)
  }

  const formatRupiah = (value: number) => {
    return `Rp${value.toLocaleString("id-ID")}`
  }

  const formattedAmount = amount ? Number.parseInt(amount).toLocaleString("id-ID") : ""

  return (
    <div className="w-full max-w-[1000px]">
      <div className="mb-6">
        <h2 className="text-gray-500 text-sm">Silahkan masukan</h2>
        <h1 className="text-2xl font-bold">Nominal Top Up</h1>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="w-full md:w-[500px]">
            <div className="relative mb-4">
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="pl-8 h-[46px] text-lg bg-white w-full"
                placeholder="masukan nominal Top Up"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <FaMoneyBillWave className="h-4 w-4" />
              </span>
            </div>

            <Button
              onClick={handleTopUpClick}
              className="w-full bg-gray-200 hover:bg-red-600 text-gray-700 hover:text-gray-50 h-[46px] text-sm border border-gray-200"
              disabled={!isValidAmount || isLoading}
            >
              {isLoading ? "Processing..." : "Top Up"}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-[380px]">
            {PRESET_AMOUNTS.map((presetAmount) => (
              <Button
                key={presetAmount}
                variant="outline"
                onClick={() => handlePresetAmount(presetAmount)}
                className="h-[46px] bg-white hover:bg-gray-50 border-gray-200 text-sm"
              >
                {formatRupiah(presetAmount)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showConfirmModal && (
        <ConfirmationModal
          serviceName="Top Up"
          amount={formattedAmount}
          onConfirm={handleConfirmTopUp}
          onCancel={handleCancelTopUp}
        />
      )}

      {showSuccessModal && (
        <SuccessModal serviceName="Top Up" amount={successAmount} onClose={handleCloseSuccessModal} />
      )}

      {showFailedModal && (
        <FailedModal serviceName="Top Up" amount={formattedAmount || "0"} onClose={handleCloseFailedModal} />
      )}
    </div>
  )
}

