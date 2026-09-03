import React, { useState, useEffect, ReactNode } from 'react';
import { type User, UserRole } from '@/features/auth/types/auth';
import { getMe } from '@/features/auth/services/authService';
import apiClient from '@/services/api/client';
import { AuthContext, useAuth } from './AuthContext';

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    try { return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(!!token && !user);

  useEffect(() => {
    const verifySession = async () => {
      if (token && !user) {
        try {
          const currentUser = await getMe();
          
          let safeRole = currentUser.role;
          if (typeof safeRole === 'string') {
            const lower = String(safeRole).toLowerCase();
            if (lower === 'student') safeRole = 0;
            else if (lower === 'teacher' || lower === 'instructor') safeRole = 1;
            else if (lower === 'admin') safeRole = 2;
            else safeRole = Number(safeRole);
          }
          currentUser.role = safeRole as UserRole;

          setUser(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, [token, user]);

  // UPDATE: Now accepts refreshToken and saves it
  const login = (newUser: User, newToken: string, newRefreshToken: string) => {
    let safeRole = newUser.role;
    if (typeof safeRole === 'string') {
      const lower = String(safeRole).toLowerCase();
      if (lower === 'student') safeRole = 0;
      else if (lower === 'teacher' || lower === 'instructor') safeRole = 1;
      else if (lower === 'admin') safeRole = 2;
      else safeRole = Number(safeRole);
    }
    newUser.role = safeRole as UserRole;

    setToken(newToken);
    setUser(newUser);
    
    // SAVE TO LOCAL STORAGE
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (storedToken) {
        // explicitly notify the backend to invalidate the refresh token
        await apiClient.post('/auth/logout', { 
          token: storedToken, 
          refreshToken: storedRefreshToken 
        }).catch(() => {
          // ignore errors on logout
        });
      }
    } catch {
      // ignore
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const currentUser = await getMe();
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
