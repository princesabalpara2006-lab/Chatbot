import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, updateProfileSettings } = useContext(AuthContext);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    // Synchronize state with authenticated user's preferences
    if (user && user.settings && user.settings.theme) {
      setTheme(user.settings.theme);
    }
  }, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (user) {
      await updateProfileSettings({ theme: newTheme });
    }
  };

  const changeThemeMode = async (mode) => {
    setTheme(mode);
    if (user) {
      await updateProfileSettings({ theme: mode });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, changeThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
