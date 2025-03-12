import Cookies from 'js-cookie';
export function getToken(): string | undefined {
  return Cookies.get('token');
}

const BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

export interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

export interface Banner {
  banner_name: string;
  banner_image: string;
  description: string;
}

export interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  balance: number;
}

export interface LoginResponse {
  token: string;
  profile: Profile;
}

export interface TransactionRequest {
  service_code: string;
}

export interface TransactionResponse {
  status: number;
  message: string;
  data: {
    invoice_number: string;
    service_code: string;
    service_name: string;
    transaction_type: string;
    total_amount: number;
    created_on: string;
  };
}

export interface TransactionHistory {
  transaction_id: string;
  transaction_type: string;
  amount: number;
  timestamp: string;
}

export async function getServices(token: string): Promise<Service[]> {
  if (!token) {
    throw new Error('No token found');
  }

  console.log('Fetching services with token:', token);

  const response = await fetch(`${BASE_URL}/services`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Services error:', data);
    throw new Error(data.message || 'Failed to fetch services');
  }

  console.log('Services response:', data);
  return data.data;
}

export async function getBanners(token: string): Promise<Banner[]> {
  if (!token) {
    throw new Error('No token found');
  }

  console.log('Fetching banners with token:', token);

  const response = await fetch(`${BASE_URL}/banner`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Banners error:', data);
    throw new Error(data.message || 'Failed to fetch banners');
  }

  console.log('Banners response:', data);
  return data.data;
}

export async function getProfile(): Promise<Profile> {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }

  console.log('Fetching profile with token:', token);

  const response = await fetch(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Profile error:', data);
    throw new Error(data.message || 'Failed to fetch profile');
  }

  console.log('Profile response:', data);
  return data.data;
}

export async function getBalance(token: string): Promise<number> {
  if (!token) {
    throw new Error('No token found');
  }

  console.log('Fetching balance with token:', token);

  const response = await fetch(`${BASE_URL}/balance`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Balance error:', data);
    throw new Error(data.message || 'Failed to fetch balance');
  }

  console.log('Balance response:', data);
  return data.data.balance;
}

export async function createTransaction(request: TransactionRequest): Promise<TransactionResponse> {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }

  console.log('Creating transaction with token:', token);

  const response = await fetch(`${BASE_URL}/transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Transaction error:', data);
    throw new Error(data.message || 'Failed to create transaction');
  }

  console.log('Transaction response:', data);
  return data;
}

export async function getTransactionHistory(token: string, offset: number, limit: number): Promise<TransactionHistory[]> {
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${BASE_URL}/history?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Transaction history error:', data);
    throw new Error(data.message || 'Failed to fetch transaction history');
  }

  return data.data;
}