import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Key, Loader2, ArrowRight } from 'lucide-react';

const ForgotPasswordPage = () => {
  const { recoverPassword, confirmResetPassword, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset
  const [infoMsg, setInfoMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg(null);
    setInfoMsg(null);

    const res = await recoverPassword(email);
    if (res.success) {
      setInfoMsg(res.message);
      setStep(2);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) return;
    setErrorMsg(null);
    setInfoMsg(null);

    const res = await confirmResetPassword(email, otp, newPassword);
    if (res.success) {
      setInfoMsg(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Password Recovery</h2>
        <p className="text-xs text-slate-400">
          {step === 1 
            ? "Enter email to dispatch a recovery security code" 
            : "Enter recovery code and your new credentials"
          }
        </p>
      </div>

      {infoMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-semibold">
          ✅ {infoMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Dispatch Recovery Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Verification OTP Code</label>
            <div className="relative">
              <Key className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                maxLength="6"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="glass-input text-sm w-full pl-12 tracking-widest font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">New Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                <span>Commit Password Reset</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      <hr className="border-slate-200/50 dark:border-dark-800/30" />

      <p className="text-xs text-center text-slate-400">
        Remember your password?{' '}
        <Link to="/login" className="text-primary-500 font-bold hover:underline">Sign In</Link>
      </p>

    </div>
  );
};

export default ForgotPasswordPage;
