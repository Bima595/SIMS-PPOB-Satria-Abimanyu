import type { ApiResponse } from "../types"
import type { LoginDto } from '../dto/auth.dto'

const API_BASE_URL = "https://take-home-test-api.nutech-integrasi.com"

/**
 * Login user with email and password
 */
export async function loginUser(loginDto: LoginDto): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDto),
    })

    const data = await response.json()
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data
  } catch (error) {
    throw new Error("Failed to login")
  }
}

/**
 * Register a new user
 */
export async function registerUser({
  email,
  first_name,
  last_name,
  password,
}: {
  email: string
  first_name: string
  last_name: string
  password: string
}): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name,
        last_name,
        password,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error("Failed to register")
  }
}

/**
 * Get current user profile
 */
export async function getUserProfile(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error("Failed to get user profile")
  }
}