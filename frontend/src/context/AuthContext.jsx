import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('[Token check failed, clearing session]');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }

      // Automatically sign in as a guest to bypass any login wall
      try {
        const res = await API.post('/auth/guest');
        if (res.data.success) {
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          setUser(res.data.user);
        }
      } catch (guestErr) {
        console.error('[Automatic guest session setup failed]', guestErr);
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Check inputs.';
      setAuthError(message);
      setLoading(false);
      if (err.response?.data?.notVerified) {
        return { success: false, notVerified: true, email: err.response.data.email };
      }
      return { success: false, message };
    }
  };

  const registerUser = async (username, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await API.post('/auth/register', { username, email, password });
      setLoading(false);
      return { success: true, email: res.data.email };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      setAuthError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  const verifyUserOTP = async (email, otp) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await API.post('/auth/verify-otp', { email, otp });
      setLoading(false);
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'OTP verification failed.';
      setAuthError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  const recoverPassword = async (email) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setLoading(false);
      return { success: true, message: res.data.message };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to dispatch recovery code.' };
    }
  };

  const confirmResetPassword = async (email, otp, newPassword) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/reset-password', { email, otp, newPassword });
      setLoading(false);
      return { success: true, message: res.data.message };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to reset password.' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const updateProfileSettings = async (settingsUpdates) => {
    try {
      const res = await API.put('/productivity/settings', settingsUpdates);
      if (res.data.success) {
        setUser((prev) => ({
          ...prev,
          settings: res.data.settings
        }));
        return true;
      }
    } catch (err) {
      console.error('[Settings update error]', err.message);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      loginUser,
      registerUser,
      verifyUserOTP,
      recoverPassword,
      confirmResetPassword,
      logoutUser,
      updateProfileSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};
