import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight, MessageSquare, Shield, Sparkles, Activity, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen py-16 overflow-hidden">
      
      {/* Visual flares */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 dark:bg-primary-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Hero Container */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center lg:text-left"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass border border-slate-200/50 dark:border-dark-800/40 text-xs font-semibold text-primary-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Conversational Engine</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            Unlock the Next Wave of{' '}
            <span className="bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-400 bg-clip-text text-transparent">
              AI Dialogue
            </span>
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
            Welcome to AetherTalk. Chat in real-time, customize AI personalities, analyze complex documents, manage schedules, and control workspace metrics—all inside a breathtaking glassmorphic terminal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to="/chat"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/40 dark:bg-dark-900/30 hover:bg-white/60 dark:hover:bg-dark-900/50 font-bold border border-slate-200/50 dark:border-dark-800/40 transition-all flex items-center justify-center space-x-2"
            >
              <span>Launch Terminal</span>
            </Link>
          </div>
        </motion.div>

        {/* Hero Banner Image / Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          {/* Breathtaking glass mock card representing AI Chat UI */}
          <div className="w-full max-w-[480px] glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-2xl relative">
            {/* Header decoration */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-dark-800/40 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">aether_assistant_v1.0</span>
            </div>

            {/* Simulated message logs */}
            <div className="space-y-4 mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-dark-800 flex items-center justify-center font-bold text-xs shrink-0">ME</div>
                <div className="p-3 bg-slate-200/50 dark:bg-dark-900/40 rounded-2xl text-xs max-w-[280px]">
                  Write a JavaScript hook that schedules calendar reminders using dynamic user intent!
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="p-3 bg-primary-600/10 rounded-2xl text-xs text-primary-500 font-semibold max-w-[280px] border border-primary-500/10">
                  ✨ Done! Automatically scheduled `Remind to clean up codebase` for 5 PM. Here is your modular code block...
                </div>
              </div>
            </div>

            {/* Visual sound bar indicator */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-dark-800/40">
              <div className="flex items-center space-x-1.5">
                <span className="wave-bar h-5"></span>
                <span className="wave-bar h-6" style={{ animationDelay: '0.2s' }}></span>
                <span className="wave-bar h-7" style={{ animationDelay: '0.4s' }}></span>
                <span className="wave-bar h-4" style={{ animationDelay: '0.6s' }}></span>
              </div>
              <span className="text-xs text-emerald-500 font-bold animate-pulse">Speech Input Active</span>
            </div>
          </div>

          {/* Glow circle overlay */}
          <div className="absolute -z-10 -bottom-8 -left-8 w-[240px] h-[240px] bg-indigo-500/20 blur-[60px] rounded-full"></div>
        </motion.div>

      </div>

      {/* Feature Grids */}
      <section className="max-w-7xl mx-auto px-6 py-24 mt-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight">Standard Platforms vs AetherTalk</h2>
          <p className="text-slate-500 dark:text-slate-400">We don't just deliver basic minimum viable chatbots. We supply absolute analytical powerhouses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card-interactive p-6 space-y-4">
            <div className="p-3 w-fit rounded-xl bg-primary-500/10 text-primary-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">5 Custom Personalities</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Toggle between Friendly, Professional, Funny, Teacher, or Motivational tones instantly to tailor replies to your work environment.
            </p>
          </div>

          <div className="glass-card-interactive p-6 space-y-4">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-500">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Absolute Security</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Equipped with JWT session keys, Mongo query sanitization, express rate limits, Helmet security layers, and encrypted cookies.
            </p>
          </div>

          <div className="glass-card-interactive p-6 space-y-4">
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-500">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Productivity Suite</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Includes inline calculators, dynamic weather indicators, scratch notes downloaders, real-time schedule alarms, and task managers.
            </p>
          </div>

        </div>
      </section>

      {/* Live platform statistics counters */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="glass-card p-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-center bg-slate-900/5 border border-white/5 dark:bg-dark-900/15">
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-primary-500">12k+</h4>
            <p className="text-xs uppercase tracking-wider text-slate-400">Total Users</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-indigo-500">2.5M</h4>
            <p className="text-xs uppercase tracking-wider text-slate-400">Messages Sent</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-purple-500">99.98%</h4>
            <p className="text-xs uppercase tracking-wider text-slate-400">Platform Uptime</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-emerald-500">10ms</h4>
            <p className="text-xs uppercase tracking-wider text-slate-400">Socket Latency</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
