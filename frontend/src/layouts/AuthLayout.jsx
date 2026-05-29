import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Cpu } from 'lucide-react';

const AuthLayout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If logged in already, push to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-dark-950 text-slate-800 dark:text-slate-100 px-4 overflow-hidden py-12 transition-colors duration-300">
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse-slow"></div>

      {/* Floating Sparkles Canvas Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-400 text-white shadow-xl shadow-primary-500/25 mb-4 animate-float">
            <Cpu className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome to AetherTalk</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Where dialogue sparks dynamic ideas</p>
        </div>

        {/* Dynamic Auth Card Outlet */}
        <div className="glass-card neon-glow-primary p-8 border border-white/20 dark:border-dark-800/20 shadow-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
