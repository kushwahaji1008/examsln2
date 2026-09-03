import { useState, useEffect } from 'react';
import { getInstructorDashboardAnalytics } from '@/services/api/analyticsApi';

export function useTeacherDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getInstructorDashboardAnalytics()
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
