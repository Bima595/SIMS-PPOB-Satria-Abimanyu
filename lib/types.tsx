/**
 * API response structure from the backend
 */
export interface ApiResponse {
    status: number
    message: string
    data?: any
  }
  
  /**
   * User profile data structure
   */
  export interface User {
    email: string
    first_name: string
    last_name: string
    profile_image: string | null;
  }
  
  /**
   * Authentication state structure for the application
   */
  export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
  }
  
  /**
   * Login response data structure
   */
  export interface LoginResponseData {
    token: string
    profile: User
  }
  
  /**
   * Registration response data structure
   */
  export interface RegistrationResponseData {
    email: string
    first_name: string
    last_name: string
  }
  
  /**
   * Profile response data structure
   */
  export interface ProfileResponseData extends User {
    balance: number
  }

    /**
   * Transaction History data structure
   */
  export interface TransactionHistory {
    transaction_id: string;
    transaction_type: string;
    amount: number;
    timestamp: string;
  }
  
  