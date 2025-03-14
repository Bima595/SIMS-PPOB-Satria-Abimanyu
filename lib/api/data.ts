import Cookies from "js-cookie"
export function getToken(): string | undefined {
  return Cookies.get("token")
}

const BASE_URL = "https://take-home-test-api.nutech-integrasi.com"

export interface Service {
  service_code: string
  service_name: string
  service_icon: string
  service_tariff: number
}

export interface Banner {
  banner_name: string
  banner_image: string
  description: string
}


export interface TransactionRequest {
  service_code: string
}

export interface TransactionResponse {
  status: number
  message: string
  data: {
    invoice_number: string
    service_code: string
    service_name: string
    transaction_type: string
    total_amount: number
    created_on: string
  }
}

export interface TransactionRecord {
  invoice_number: string
  transaction_type: string
  description: string
  total_amount: number
  created_on: string
}

export interface TransactionHistoryResponse {
  status: number
  message: string
  data: {
    offset: number
    limit: number
    records: TransactionRecord[]
  }
}


export async function getServices(token?: string) {
  const effectiveToken = token || 
                        localStorage.getItem("token") || 
                        document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

  if (!effectiveToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(`${BASE_URL}/services`, {
    headers: {
      Authorization: `Bearer ${effectiveToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status}`);
  }

  return await response.json();
}

export async function getBanners(token: string): Promise<Banner[]> {
  if (!token) {
    throw new Error("No token found")
  }


  const response = await fetch(`${BASE_URL}/banner`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch banners")
  }

  return data.data
}



export async function getBalance(token: string): Promise<number> {
  if (!token) {
    throw new Error("No token found")
  }


  const response = await fetch(`${BASE_URL}/balance`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch balance")
  }

  return data.data.balance
}

export async function createTransaction(data: any, token?: string) {
  // Gunakan token yang diberikan atau coba ambil dari localStorage/cookie
  const effectiveToken = token || 
                        localStorage.getItem("token") || 
                        document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

  if (!effectiveToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(`${BASE_URL}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${effectiveToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Transaction failed: ${response.status}`);
  }

  return await response.json();
}

export async function getTransactionHistory(
  token: string,
  offset: number,
  limit: number,
): Promise<TransactionRecord[]> {
  if (!token) {
    throw new Error("No token found")
  }


  const response = await fetch(`${BASE_URL}/transaction/history?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data: TransactionHistoryResponse = await response.json()

  if (!response.ok || data.status !== 0) {
    throw new Error(data.message || "Failed to fetch transaction history")
  }

  return data.data.records
}