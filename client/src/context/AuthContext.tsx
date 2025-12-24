/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../api';
import type { ReactNode } from 'react';

interface User {
  displayName: string;
  email: string;
  roleName: string;
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setAuthToken(token);
        const res = await api.get('/api/Account');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user info', err);
        setToken(null);
        setAuthToken(null);
      }
    })();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/Account/login', { email, password });
    const tokenRes = res.data?.token || res.data;
    setToken(tokenRes);
    setAuthToken(tokenRes);
  };

  const register = async (displayName: string, email: string, password: string) => {
    await api.post('/api/Account/register', { displayName, email, password });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
