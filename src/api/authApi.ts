import api from './axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  companyName: string;
  email: string;
}

export interface ConfirmEmailCredentials {
  userId: string;
  token: string;
}

export interface LoginResponse {
  token: string;
}

export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    console.error('Login API error:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerApi = async (credentials: RegisterCredentials): Promise<void> => {
  try {
    await api.post('/api/auth/register', credentials);
  } catch (error: any) {
    console.error('Register API error:', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const confirmEmailApi = async (userId: string, token: string): Promise<void> => {
  try {
    await api.post('/api/auth/confirm-email', { userId, token });
  } catch (error: any) {
    console.error('Confirm Email API error:', error);
    throw new Error(error.response?.data?.message || 'Email confirmation failed');
  }
};

export const resendConfirmationApi = async (email: string): Promise<void> => {
  try {
    await api.post('/api/auth/resend-confirmation', { email });
  } catch (error: any) {
    console.error('Resend Confirmation API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to resend confirmation email');
  }
};