import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  companyName: string;
}

export interface ConfirmEmailCredentials {
  userId: string;
  token: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface ApiResponse {
  message: string;
}

/**
 * Авторизация пользователя по email и паролю.
 * @param credentials Объект с email и паролем.
 * @returns Объект с JWT-токеном.
 */
export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    console.error('Login API error:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

/**
 * Регистрация нового пользователя.
 * @param credentials Объект с email, паролем и названием компании.
 * @returns Объект с сообщением от сервера.
 */
export const registerApi = async (credentials: RegisterCredentials): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/api/auth/register', credentials);
    return response.data;
  } catch (error: any) {
    console.error('Register API error:', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

/**
 * Повторная отправка письма подтверждения.
 * @param email Email пользователя.
 * @returns Объект с сообщением от сервера.
 */
export const resendConfirmationApi = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/api/auth/resend-confirmation', { email });
    return response.data;
  } catch (error: any) {
    console.error('Resend Confirmation API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to resend confirmation email');
  }
};

/**
 * Подтверждение email пользователя.
 * @param userId ID пользователя.
 * @param token Токен подтверждения.
 * @returns Объект с сообщением от сервера.
 */
export const confirmEmailApi = async (userId: string, token: string): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/api/auth/confirm-email', { userId, token });
    return response.data;
  } catch (error: any) {
    console.error('Confirm Email API error:', error);
    throw new Error(error.response?.data?.message || 'Email confirmation failed');
  }
};

/**
 * Обновление access-токена с использованием refresh-токена.
 * @param refreshToken Refresh-токен.
 * @returns Объект с новым JWT-токеном и refresh-токеном.
 */
export const refreshTokenApi = async (refreshToken: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/api/auth/refresh-token', { refreshToken });
    return response.data;
  } catch (error: any) {
    console.error('Refresh Token API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to refresh token');
  }
};