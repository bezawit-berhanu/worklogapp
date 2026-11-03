import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthCredentials, SignupPayload, AuthResponse } from '../types/auth';
import { authService, DEMO_USER } from '../services/api/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthResponse>;
  signup: (payload: SignupPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  fillDemoCredentials: () => AuthCredentials;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate user session on mount
  useEffect(() => {
    let isMounted = true;
    authService.getCurrentUser().then((res) => {
      if (isMounted) {
        if (res.success && res.user && res.token) {
          setUser(res.user);
          setToken(res.token);
        }
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const res = await authService.login(credentials);
    if (res.success && res.user && res.token) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  };

  const signup = async (payload: SignupPayload): Promise<AuthResponse> => {
    const res = await authService.signup(payload);
    if (res.success && res.user && res.token) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const fillDemoCredentials = (): AuthCredentials => ({
    emailOrUsername: DEMO_USER.email,
    password: DEMO_USER.passwordHash,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        signup,
        logout,
        fillDemoCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
