import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginApi, registerApi, resendConfirmationApi, confirmEmailApi, refreshTokenApi, LoginCredentials, RegisterCredentials, LoginResponse, ApiResponse } from '../api/authApi';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: { email: string } | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<ApiResponse>;
  logout: () => void;
  resendConfirmation: (email: string) => Promise<ApiResponse>;
  confirmEmail: (userId: string, token: string) => Promise<ApiResponse>;
  callrefreshToken: () => Promise<void>;
  error: string | null;
  message: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Инициализация состояния аутентификации из localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedToken && storedRefreshToken && storedEmail) {
      try {
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser({ email: storedEmail });
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Invalid stored token:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setError(null);
      setMessage(null);
      const response: LoginResponse = await loginApi(credentials);
      const { token, refreshToken } = response;

      // Декодирование токена для получения email
      const decoded = parseJwt(token);
      const email = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', email);
      setToken(token);
      setRefreshToken(refreshToken);
      setUser({ email });
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<ApiResponse> => {
    try {
      setError(null);
      setMessage(null);
      const response = await registerApi(credentials);
      setMessage(response.message);
      return response;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    setMessage(null);
  };

  const resendConfirmation = async (email: string): Promise<ApiResponse> => {
    try {
      setError(null);
      setMessage(null);
      const response = await resendConfirmationApi(email);
      setMessage(response.message);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email');
      throw err;
    }
  };

  const confirmEmail = async (userId: string, token: string): Promise<ApiResponse> => {
    try {
      setError(null);
      setMessage(null);
      const response = await confirmEmailApi(userId, token);
      setMessage(response.message);
      return response;
    } catch (err: any) {
      setError(err.message || 'Email confirmation failed');
      throw err;
    }
  };

  const callrefreshToken = async (): Promise<void> => {
    try {
      setError(null);
      setMessage(null);
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await refreshTokenApi(storedRefreshToken);
      const { token, refreshToken: newRefreshToken } = response;

      const decoded = parseJwt(token);
      const email = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('userEmail', email);
      setToken(token);
      setRefreshToken(newRefreshToken);
      setUser({ email });
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh token');
      logout(); // Очищаем состояние при неуспешном обновлении
      throw err;
    }
  };

  // Вспомогательная функция для декодирования JWT
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
    refreshToken,
    user,
    login,
    register,
    logout,
    resendConfirmation,
    confirmEmail,
    callrefreshToken,
    error,
    message,
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