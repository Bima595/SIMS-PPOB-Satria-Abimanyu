import Cookies from "js-cookie"
export function getToken(): string | undefined {
  return Cookies.get("token")
}

const BASE_URL = "https://take-home-test-api.nutech-integrasi.com";

export interface Profile {
    first_name: string
    last_name: string
    email: string
    profile_image?: string | null
    balance: number
  }

  export interface LoginResponse {
    token: string
    profile: Profile
  }

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
}

export interface UpdateProfileResponse {
    status: number
    message: string
    data: Profile
  }

export interface UploadImageResponse {
  status: number;
  message: string;
  data: {
    profile_image: string;
  };
}

export async function getProfile(): Promise<Profile> {
  const token = getToken()
  if (!token) {
    throw new Error("No token found")
  }


  const response = await fetch(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch profile")
  }

  return data.data
}

export async function updateProfile(request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  const token = getToken()
  if (!token) {
    throw new Error("No token found")
  }


  const response = await fetch(`${BASE_URL}/profile/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile")
  }

  return data
}

export async function uploadProfileImage(file: File): Promise<UploadImageResponse> {
    const token = getToken()
    if (!token) {
      throw new Error("No token found")
    }
  
    // Check file size (max 100KB)
    if (file.size > 100 * 1024) {
      throw new Error("Image size exceeds maximum limit of 100KB")
    }
  
    const formData = new FormData()
    formData.append("file", file)
  
    const response = await fetch(`${BASE_URL}/profile/image`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
  
    const data = await response.json()
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to upload profile image")
    }
    return data
  }