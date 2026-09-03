import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { Loader2 } from 'lucide-react';
import { authApi } from '@/services/api';

export default function AuthSync() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const syncAuth = async () => {
      // Parse tokens from URL hash: #token=...&refreshToken=...
      const hash = location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get('token');
      const refreshToken = params.get('refreshToken');

      if (token && refreshToken) {
        try {
          // Fetch the user's profile to complete the login
          // We must temporarily store the token so the API client can use it
          localStorage.setItem('token', token);
          const user = await authApi.getMe();
          
          login(user, token, refreshToken);

          // Clear the hash for security
          window.history.replaceState(null, '', window.location.pathname);

          // Route to appropriate dashboard
          if (user.role === 'Teacher' || user.role === 1) {
            navigate('/teacher', { replace: true });
          } else {
            navigate('/student', { replace: true });
          }
        } catch (error) {
          console.error("Failed to sync auth", error);
          navigate('/login', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    syncAuth();
  }, [location, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold">Synchronizing Session...</h2>
        <p className="text-slate-400">Please wait while we log you into the correct portal.</p>
      </div>
    </div>
  );
}
