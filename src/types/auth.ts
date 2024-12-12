import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  telephone?: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginAttempt {
  id: string;
  email: string;
  timestamp: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
}