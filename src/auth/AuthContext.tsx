import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginApi, registerApi, resendConfirmationApi, confirmEmailApi, LoginCredentials, RegisterCredentials, LoginResponse } from '../api/authApi';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: { email: string } | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  resendConfirmation: (email: string) => Promise<void>;
  confirmEmail: (userId: string, token: string) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedToken && storedEmail) {
      try {
        // Basic token validation (you may want to verify with backend)
        setToken(storedToken);
        setUser({ email: storedEmail });
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Invalid stored token:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response: LoginResponse = await loginApi(credentials);
      const { token } = response;

      // Decode token to get email (assuming email is in ClaimTypes.Email)
      const decoded = parseJwt(token);
      const email = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email);
      setToken(token);
      setUser({ email });
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setError(null);
      await registerApi(credentials);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const resendConfirmation = async (email: string) => {
    try {
      setError(null);
      await resendConfirmationApi(email);
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email');
      throw err;
    }
  };

  const confirmEmail = async (userId: string, token: string) => {
    try {
      setError(null);
      await confirmEmailApi(userId, token);
    } catch (err: any) {
      setError(err.message || 'Email confirmation failed');
      throw err;
    }
  };

  // Helper function to decode JWT
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      throw new Error('Invalid JWT token');
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    token,
    user,
    login,
    register,
    logout,
    resendConfirmation,
    confirmEmail,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};