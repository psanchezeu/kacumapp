import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';

// Definiendo el tipo aquí para resolver el conflicto
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<boolean>;
  logout: () => void;
  loginWithToken: (token: string) => Promise<void>;
}
import api from '../services/api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('kacum_token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/api/profile'); 
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      setUser(null);
      localStorage.removeItem('kacum_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const loginWithToken = useCallback(async (token: string) => {
    setIsLoading(true);
    localStorage.setItem('kacum_token', token);
    await fetchUserProfile();
  }, [fetchUserProfile]);

  const login = async (): Promise<boolean> => {
    // Esta función ahora debería llamar a un endpoint de login local
    // Por ahora, la dejamos como no funcional para centrarnos en Google Auth
    console.error('Login local no implementado. Use Google Auth.');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kacum_token');
    delete api.defaults.headers.common['Authorization'];
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    loginWithToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};