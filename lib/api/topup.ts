import Cookies from "js-cookie"
export function getToken(): string | undefined {
  return Cookies.get("token")
}

const BASE_URL = "https://take-home-test-api.nutech-integrasi.com";

export interface TopUpRequest {
  amount: number;
}

export interface TopUpResponse {
  status: number;
  message: string;
  data: {
    top_up_amount: number;
    balance: number;
  };
}

export async function topUp(request: TopUpRequest): Promise<TopUpResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("No token found");
  }

  console.log("Processing top up with token:", token);

  const response = await fetch(`${BASE_URL}/topup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Top up error:", data);
    throw new Error(data.message || "Failed to process top up");
  }

  console.log("Top up response:", data);
  return data;
}