import { useState, useEffect } from 'react';
import { getAdminDashboardAnalytics } from '@/services/api/analyticsApi';

export function useAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getAdminDashboardAnalytics()
      .then(res => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard');
          setIsLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  return { data, isLoading, error };
}
