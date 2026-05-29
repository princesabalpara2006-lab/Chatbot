import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const { registerUser, loading, authError } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    const res = await registerUser(username, email, password);
    if (res.success) {
      // Direct to verification page passing email state
      navigate('/verify-otp', { state: { email: res.email } });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Register Account</h2>
        <p className="text-xs text-slate-400">Initialize a new credential session inside AetherTalk</p>
      </div>

      {authError && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
          ⚠️ {authError}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Username</label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input text-sm w-full pl-12"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input text-sm w-full pl-12"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input text-sm w-full pl-12"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Initialize Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      <hr className="border-slate-200/50 dark:border-dark-800/30" />

      <p className="text-xs text-center text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-primary-500 font-bold hover:underline">Sign In</Link>
      </p>

    </div>
  );
};

export default RegisterPage;
