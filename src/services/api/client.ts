import axios from 'axios';

// Create a global Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://exams.tryasp.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. REQUEST INTERCEPTOR: Attach the token to every outgoing request and normalize path
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Normalize URL path if baseURL already includes /api
    if (config.url) {
      const base = (config.baseURL || apiClient.defaults.baseURL || '').toString().replace(/\/+$/, '');
      if (base.endsWith('/api')) {
        if (config.url.startsWith('/api/')) {
          config.url = config.url.replace(/^\/api/, '');
        } else if (config.url.startsWith('api/')) {
          config.url = '/' + config.url.replace(/^api\//, '');
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Prevent infinite loops if multiple requests fail at the same time
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 2. RESPONSE INTERCEPTOR: Catch 401 errors and automatically refresh the token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't already retried this specific request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If the original request was to the refresh-token endpoint itself, the refresh token is dead. Log them out.
      if (originalRequest.url.includes('/auth/refresh-token')) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If another request is already refreshing the token, pause this one and wait
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      const token = localStorage.getItem('token');

      if (!refreshToken || !token) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Silently call the backend to get a fresh set of tokens
        const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh-token`, {
          token: token,
          refreshToken: refreshToken
        });

        // 1. Save the new tokens
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        // 2. Tell the queued requests to proceed with the new token
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
        originalRequest.headers.Authorization = 'Bearer ' + data.token;
        
        processQueue(null, data.token);

        // 3. Retry the original request that failed
        return apiClient(originalRequest);

      } catch (refreshError) {
        // If the refresh token is completely expired, nuke the session and force login
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;