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
import { getCookie, setCookie } from 'cookies-next';
import { getProfile } from '../api/profile';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  /**
   * Logout function (dideklarasikan dulu sebelum `fetchUserProfile`)
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
    const token = getCookie('token') || localStorage.getItem('token');
    if (!token) return;

    try {
      const profile = await getProfile();
      const transformedProfile = {
        ...profile,
        profile_image: profile.profile_image ?? undefined,
      };

      setAuthState((prev) => ({
        ...prev,
        user: profile as User,
        isAuthenticated: true,
      }));
      localStorage.setItem('user', JSON.stringify(transformedProfile));
    } catch (error) {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const token = getCookie('token') || localStorage.getItem('token');

    if (typeof token === 'string') {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') { 
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          localStorage.removeItem('user');
        }
      } else {
        fetchUserProfile();
      }
    }
  }, [fetchUserProfile]);

  /**
   * Login function
   */
  const login = useCallback((token: string, user: User): void => {
    setCookie('token', token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setAuthState({
      user,
      token,
      isAuthenticated: true,
    });
  }, []);

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
