import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ChevronLeft, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0d0d0d] text-white overflow-hidden px-6 selection:bg-red-500/30 selection:text-white">
      
      {/* Dynamic cyberpunk flares */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none animate-pulse-slow"></div>

      <div className="relative z-10 text-center max-w-md space-y-8">
        
        {/* Animated Cyber Shield Warning Indicator */}
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 0.98, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="p-6 bg-red-950/20 text-red-500 rounded-full w-fit mx-auto border border-red-500/20 shadow-2xl shadow-red-500/5 flex items-center justify-center"
        >
          <ShieldAlert className="w-14 h-14" />
        </motion.div>

        {/* Big Glitch-styled Header */}
        <div className="space-y-3">
          <h1 className="text-9xl font-extrabold tracking-widest bg-gradient-to-r from-red-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-md select-none font-mono">
            404
          </h1>
          <h2 className="text-xl font-black uppercase tracking-widest text-gray-200">
            System Deflection Detected
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto font-medium">
            The database parser attempted to resolve this virtual path but encountered vacuum bounds. The endpoint is offline or does not exist.
          </p>
        </div>

        {/* Premium Actions Wrapper */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold shadow-lg shadow-red-600/15 hover:shadow-red-600/35 transition-all flex items-center justify-center space-x-2 border border-red-500/30"
          >
            <Cpu className="w-4 h-4" />
            <span>Launch Terminal</span>
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-full text-xs font-bold border border-white/10 transition-all flex items-center justify-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

      </div>

      {/* Cyber grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

    </div>
  );
};

export default NotFoundPage;
