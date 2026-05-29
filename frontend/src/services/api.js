import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject JWT access token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle token refreshing automatically
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Attempt refresh request
          const res = await axios.post('http://localhost:5000/api/auth/refresh', { token: refreshToken });
          if (res.data.success) {
            localStorage.setItem('accessToken', res.data.accessToken);
            API.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
            return API(originalRequest);
          }
        } catch (refreshErr) {
          // Refresh token failed/expired, silently request a fresh guest session
          try {
            const guestRes = await axios.post('http://localhost:5000/api/auth/guest');
            if (guestRes.data.success) {
              localStorage.setItem('accessToken', guestRes.data.accessToken);
              localStorage.setItem('refreshToken', guestRes.data.refreshToken);
              API.defaults.headers.common['Authorization'] = `Bearer ${guestRes.data.accessToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${guestRes.data.accessToken}`;
              return API(originalRequest);
            }
          } catch (guestErr) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
