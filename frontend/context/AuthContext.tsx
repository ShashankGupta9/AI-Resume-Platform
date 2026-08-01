'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '../services/api';
import { Recruiter } from '../types';

interface AuthContextType {
  user: Recruiter | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { full_name: string; company_name: string; email: string; password: string; confirm_password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Recruiter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const recruiter = await apiService.getMe();
      setUser(recruiter);
    } catch {
      // Demo fallback for unauthenticated local preview
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        setUser({
          id: 'demo-recruiter',
          fullName: 'Sarah Vance',
          companyName: 'TechTalent Inc.',
          email: 'demo@recruiter.com',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await apiService.login({ email, password });
      setUser(res.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.token);
      }
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid email or password';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (data: { full_name: string; company_name: string; email: string; password: string; confirm_password: string }) => {
    try {
      const res = await apiService.register(data);
      setUser(res.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.token);
      }
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
