import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { organizationsApi, userApi } from '../hooks/useApi';

interface Organization {
  id: number;
  name: string;
  slug: string;
  role?: string;
  products_count?: number;
}

interface User {
  id: number;
  email: string;
  onboarding_completed?: boolean;
  current_organization?: Organization | null;
  organizations?: Organization[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  organizations: Organization[];
  currentOrganization: Organization | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchOrganization: (orgId: number) => Promise<void>;
  refreshUserData: () => Promise<User | null>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('auth_token');

    if (storedToken) {
      setToken(storedToken);
      loadUserData(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserData = async (authToken?: string): Promise<User | null> => {
    try {
      // Fetch current user info including organizations
      const userData = await userApi.me();
      setUser(userData);
      setCurrentOrganization(userData.current_organization || null);
      setOrganizations(userData.organizations || []);

      // Store updated user data
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Token might be invalid, clear it
      logout();
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async (): Promise<User | null> => {
    if (token) {
      return await loadUserData(token);
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password } }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const authToken = response.headers.get('Authorization')?.split(' ')[1];
    const data = await response.json();

    if (authToken && data.user) {
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setUser(data.user);

      // Load full user data including organizations
      await loadUserData(authToken);
    }
  };

  const register = async (email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password, password_confirmation: password } }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || 'Registration failed');
    }

    const authToken = response.headers.get('Authorization')?.split(' ')[1];
    const data = await response.json();

    if (authToken && data.user) {
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setUser(data.user);

      // Load full user data including organizations
      await loadUserData(authToken);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    setOrganizations([]);
    setCurrentOrganization(null);
  };

  const switchOrganization = async (orgId: number) => {
    try {
      const result = await organizationsApi.switch(orgId);
      setCurrentOrganization(result.organization);

      // Update user's current org in local state
      if (user) {
        setUser({ ...user, current_organization: result.organization });
      }
    } catch (error) {
      console.error('Failed to switch organization:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        organizations,
        currentOrganization,
        login,
        register,
        logout,
        switchOrganization,
        refreshUserData,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
