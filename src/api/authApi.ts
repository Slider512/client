/*
export interface LoginCredentials {
  username: string;
  password: string;
}

const API_URL = 'http://localhost:5000/api/auth';


export interface LoginResponse {
  token: string;
}

export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};
*/
import { config } from '../config';

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
    const response = await fetch(`${config.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const registerApi = async (credentials: RegisterCredentials): Promise<void> => {
  try {
    const response = await fetch(`${config.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Register API error:', error);
    throw error;
  }
};

export const confirmEmailApi = async (userId: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${config.baseUrl}/api/auth/confirm-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, token }),
    });

    if (!response.ok) {
      throw new Error('Email confirmation failed');
    }
  } catch (error) {
    console.error('Confirm Email API error:', error);
    throw error;
  }
};

export const resendConfirmationApi = async (email: string): Promise<void> => {
  try {
    const response = await fetch(`${config.baseUrl}/api/auth/resend-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to resend confirmation email');
    }
  } catch (error) {
    console.error('Resend Confirmation API error:', error);
    throw error;
  }
};