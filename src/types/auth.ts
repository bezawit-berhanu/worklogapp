/**
 * Authentication and User Types
 */

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'developer' | 'analyst' | 'student' | 'user';
  createdAt: string;
}

export interface AuthCredentials {
  emailOrUsername: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  name?: string;
  role?: 'developer' | 'analyst' | 'student' | 'user';
}

export interface AuthResponse {
  status: number; // HTTP Status Code (200, 201, 400, 401, 409, 500)
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  errors?: Record<string, string>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
