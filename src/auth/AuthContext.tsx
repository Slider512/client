import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../features/auth/authSlice';
import { RootState } from '../store';
import { loginApi, registerApi } from '../api/authApi';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, companyName: string, email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const token = useSelector((state: RootState) => state.auth.token);

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(login(storedToken));
    }
  }, [dispatch]);

  const handleLogin = async (username: string, password: string) => {
    try {
      const { token: newToken } = await loginApi({ username, password });
      localStorage.setItem('token', newToken);
      dispatch(login(newToken));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (username: string, password: string, companyName: string, email: string) => {
    try {
      await registerApi({ username, password, companyName, email });
      // Token is not saved as login requires email confirmation
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login: handleLogin, register: handleRegister, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};