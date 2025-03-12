'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, User } from '../types';
import React from 'react';
import { getCookie } from 'cookies-next';
import { getProfile } from '../api/data';

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

  useEffect(() => {
    const token = getCookie('token');

    if (typeof token === 'string') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      } else {
        fetchUserProfile();
      }
    }
  }, []);

  /**
   * Fetch user profile from the API
   */
  const fetchUserProfile = async (): Promise<void> => {
    const token = getCookie('token');
    if (!token) return;

    try {
      const profile = await getProfile();
      setAuthState((prev) => ({
        ...prev,
        user: profile,
        isAuthenticated: true,
      }));
      localStorage.setItem('user', JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    }
  };

  /**
   * Login function
   */
  const login = (token: string, user: User): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setAuthState({
      user,
      token,
      isAuthenticated: true,
    });
  };

  /**
   * Logout function
   */
  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    router.push('/auth/login');
  };

  /**
   * Update user function
   */
  const updateUser = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));

    setAuthState((prev) => ({
      ...prev,
      user,
    }));
  };

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