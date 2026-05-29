import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Key, Loader2, ArrowRight } from 'lucide-react';

const OTPPage = () => {
  const { verifyUserOTP, loading, authError } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt loading email from routing state
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // Fallback
      const input = prompt('Please verify your email address to submit the active OTP code:');
      if (input) {
        setEmail(input);
      } else {
        navigate('/login');
      }
    }
  }, [location, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) return;
    setSuccessMsg(null);

    const res = await verifyUserOTP(email, otp);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Email Activation</h2>
        <p className="text-xs text-slate-400">
          Enter the 6-digit security code dispatched to <span className="font-semibold text-primary-500">{email}</span>
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-semibold">
          ✅ {successMsg}
        </div>
      )}

      {authError && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
          ⚠️ {authError}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        
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
              className="glass-input text-sm w-full pl-12 tracking-widest font-extrabold text-center"
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
              <span>Activate Credentials</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      <hr className="border-slate-200/50 dark:border-dark-800/30" />

      <p className="text-xs text-center text-slate-400">
        Incorrect email state?{' '}
        <Link to="/login" className="text-primary-500 font-bold hover:underline">Return to Login</Link>
      </p>

    </div>
  );
};

export default OTPPage;
