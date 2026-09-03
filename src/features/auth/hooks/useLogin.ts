import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { loginUser } from '../services/authService';
import type { LoginPayload, User } from '../types/auth';

interface UseLoginOptions {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const executeLogin = useCallback(
    async (data: LoginPayload) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await loginUser(data);
        
        // Updated to pass the refreshToken into the AuthProvider for persistent login
        login(res.user, res.token, res.refreshToken);
        
        // Trigger success side-effects (e.g., navigation, toast)
        options?.onSuccess?.(res.user);
        
        return res.user;
      } catch (err: unknown) {
        let errorMessage = 'An unexpected error occurred during login.';

        // Safely extract Axios errors
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        // TRIGGER REDIRECT: Check if the backend is asking for verification
        if (errorMessage.toLowerCase().includes('verify your email')) {
          navigate('/verify-email', { state: { email: data.email } });
          return; // Stop execution so the form doesn't show an error
        }

        setError(errorMessage);
        options?.onError?.(errorMessage);
        
        // Rethrow if the consuming component still wants to catch it
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate, options]
  );

  return { executeLogin, isLoading, error };
};