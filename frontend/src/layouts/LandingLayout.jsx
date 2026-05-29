import React, { useContext, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, Cpu, Menu, X, ArrowRight } from 'lucide-react';

const LandingLayout = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-50 glass dark:glass-dark border-b border-slate-200/55 dark:border-dark-800/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 text-white shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-all">
              <Cpu className="w-5 h-5 animate-pulse-slow" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              AetherTalk
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/about" className="hover:text-primary-500 transition-colors">About</Link>
            <Link to="/pricing" className="hover:text-primary-500 transition-colors">Pricing</Link>
            <Link to="/contact" className="hover:text-primary-500 transition-colors">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-dark-900/60 text-slate-600 dark:text-slate-300 transition-all border border-transparent dark:border-slate-800/10"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/chat')}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 transition-all flex items-center space-x-1"
                >
                  <span>Launch Chat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200/60 dark:hover:bg-dark-900/60 text-slate-600 dark:text-slate-300 transition-all"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/chat"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 transition-all"
                >
                  Launch Chat
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-dark-900/60 text-slate-600 dark:text-slate-300 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-dark-900/60 text-slate-600 dark:text-slate-300 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden glass dark:glass-dark border-t border-slate-200/55 dark:border-dark-800/40 px-6 py-4 flex flex-col space-y-4 text-sm font-medium animate-fade-in">
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-500 py-1 transition-colors">About</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-500 py-1 transition-colors">Pricing</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-500 py-1 transition-colors">Contact</Link>
            <hr className="border-slate-200/50 dark:border-dark-800/30" />
            {user ? (
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/chat'); }}
                  className="w-full text-center py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm shadow-md"
                >
                  Launch Chat
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                  className="w-full text-center py-2.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-dark-900/60 font-semibold text-sm text-slate-600 dark:text-slate-300"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/chat'); }}
                  className="w-full text-center py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm shadow-md"
                >
                  Launch Chat
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Dynamic View */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Modern Marketing Footer */}
      <footer className="border-t border-slate-200/55 dark:border-dark-900/60 bg-white/30 dark:bg-dark-950/30 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 dark:text-slate-400 space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 dark:text-white">AetherTalk</span>
            <span>&copy; {new Date().getFullYear()} AetherCorp. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-primary-500 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary-500 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-primary-500 cursor-pointer transition-colors">Sitemap</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
