import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider as AuthCtxProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Guard & Boundary
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// System Pages
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Secondary sub-pages
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthCtxProvider>
          <ThemeProvider>
            <ChatProvider>
              <Routes>
                
                {/* Shielded Application Sandbox */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<ChatPage />} />
                  <Route path="chat" element={<ChatPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="admin" element={<AdminPage />} />
                  
                  {/* Informative pages */}
                  <Route path="about" element={<AboutPage />} />
                  <Route path="pricing" element={<PricingPage />} />
                  <Route path="contact" element={<ContactPage />} />
                </Route>

                {/* Cyberpunk 404 handler */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />

              </Routes>
            </ChatProvider>
          </ThemeProvider>
        </AuthCtxProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
