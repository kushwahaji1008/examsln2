import { useState, useCallback } from 'react';
import axios from 'axios';
import { registerUser } from '../services/authService';
import type { RegisterPayload, User } from '../types/auth';

export type RegisterResult =
  | { success: true; status?: number; data?: User }
  | { success: false; status?: number; error: string };

interface UseRegisterOptions {
  onSuccess?: (result: { status?: number; data?: User }) => void;
  onError?: (error: string, status?: number) => void;
}

export function useRegister(options?: UseRegisterOptions) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeRegister = useCallback(
    async (data: RegisterPayload): Promise<RegisterResult> => {
      setIsLoading(true);
      setError(null);

      try {
        if (import.meta.env.VITE_API_DEBUG === 'true') {
          console.debug('[debug] register payload:', data);
        }

        const res = await registerUser(data);
        const result: RegisterResult = {
          success: true,
          status: res.status,
          data: res.data,
        };

        options?.onSuccess?.({ status: res.status, data: res.data });
        return result;
      } catch (err: unknown) {
        let errorMessage = 'Registration failed. Please try again.';
        let status: number | undefined;

        if (axios.isAxiosError(err)) {
          status = err.response?.status;
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        options?.onError?.(errorMessage, status);

        return {
          success: false,
          status,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return { isLoading, error, executeRegister };
}