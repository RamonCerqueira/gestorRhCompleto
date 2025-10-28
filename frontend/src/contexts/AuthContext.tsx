'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// import { api } from '@/lib/api'; // Não será mais necessário para login

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (role: 'admin' | 'user') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar se há token/usuário salvo no localStorage
      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
        // Token simulado
        setToken('SIMULATED_TOKEN_' + parsedUser.role.toUpperCase());
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (role: 'admin' | 'user') => {
    // Login SIMPLIFICADO: Não há chamada de API.
    const user_info: User = role === 'admin' ? {
        id: 1,
        name: 'Administrador',
        email: 'admin@docgestor.com',
        role: 'admin'
    } : {
        id: 2,
        name: 'Usuário Comum',
        email: 'user@docgestor.com',
        role: 'user'
    };

    const simulated_token = 'SIMULATED_TOKEN_' + role.toUpperCase();
    
    setUser(user_info);
    setToken(simulated_token);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user_info));
      localStorage.setItem('token', simulated_token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

