'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, User } from '../types';
import React from 'react';
import { getCookie } from 'cookies-next';
import { getProfile } from '../api/profile';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  fetchUserProfile: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the setCookie function (replace with your actual setCookie implementation)
function setCookie(name: string, value: string, options: any = {}) {
  options = {
    path: "/",
    ...options,
  }

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString()
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)

  for (const optionKey in options) {
    updatedCookie += "; " + optionKey
    const optionValue = options[optionKey]
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue
    }
  }

  document.cookie = updatedCookie
}


type SetAuthState = (newState: AuthState) => void

let _setAuthState: SetAuthState | null = null

export const initializeSetAuthState = (setAuthState: SetAuthState) => {
  _setAuthState = setAuthState
}

const setAuthState = (newState: AuthState) => {
  if (_setAuthState) {
    _setAuthState(newState)
  } else {
    console.warn("setAuthState not initialized. Call initializeSetAuthState first.")
  }
}


/**
 * Auth Provider Component
 */
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = getCookie('token') || localStorage.getItem('token');
        
        if (typeof storedToken === 'string' && storedToken) {
          // Set token in state immediately to prevent race conditions
          setAuthState(prev => ({
            ...prev,
            token: storedToken,
            isAuthenticated: true
          }));
          
          const storedUser = localStorage.getItem('user');
          if (storedUser && storedUser !== 'undefined') { 
            try {
              const user = JSON.parse(storedUser);
              setAuthState(prev => ({
                ...prev,
                user,
                token: storedToken,
                isAuthenticated: true,
              }));
            } catch (error) {
              localStorage.removeItem('user');
              // Fetch user profile if stored user data is invalid
              await fetchUserProfileInternal(storedToken);
            }
          } else {
            // No stored user, fetch from API
            await fetchUserProfileInternal(storedToken);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Internal fetch user profile function
   */
  const fetchUserProfileInternal = async (token: string): Promise<void> => {
    if (!token) return;

    try {
      const profile = await getProfile();
      const transformedProfile = {
        ...profile,
        profile_image: profile.profile_image ?? undefined,
      };

      setAuthState({
        user: profile as User,
        token: token,
        isAuthenticated: true,
      });
      localStorage.setItem('user', JSON.stringify(transformedProfile));
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Don't logout here, just leave the user as null
      setAuthState({
        user: null,
        token: token,
        isAuthenticated: true,
      });
    }
  };

  /**
   * Logout function
   */
  const logout = useCallback((): void => {
    setCookie('token', '');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    router.push('/auth/login');
  }, [router]);

  /**
   * Fetch user profile from the API
   */
  const fetchUserProfile = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const token = authState.token || getCookie('token') || localStorage.getItem('token');
    
    try {
      await fetchUserProfileInternal(token as string);
    } finally {
      setIsLoading(false);
    }
  }, [authState.token]);

  // Fetch user profile when token changes but user is null
  useEffect(() => {
    if (authState.token && !authState.user && !isLoading) {
      fetchUserProfile();
    }
  }, [authState.token, authState.user, fetchUserProfile, isLoading]);

  /**
   * Login function
   */
  const login = useCallback((token: string, user: User): void => {
    // Set token in both cookie and localStorage for redundancy
    setCookie("token", token)
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
  
    setAuthState({
      user,
      token,
      isAuthenticated: true,
    })
  }, [])

  /**
   * Update user function
   */
  const updateUser = useCallback((user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));

    setAuthState((prev) => ({
      ...prev,
      user,
    }));
  }, []);

  const value = {
    ...authState,
    login,
    logout,
    updateUser,
    fetchUserProfile,
    isLoading,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

/**
 * Custom hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}