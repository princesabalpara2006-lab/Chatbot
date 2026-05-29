import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
          <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Initializing session...</span>
        </div>
      </div>
    );
  }

  // If no guest/user is authenticated, redirect to root index (where they auto-authenticate)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
