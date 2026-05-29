import React from 'react';
import { Cpu, Eye, ShieldAlert, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">
      
      {/* Dynamic Intro */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight">Our Mission at AetherTalk</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
          We believe artificial intelligence should feel extremely responsive, accessible, safe, and beautiful. We created AetherTalk to demonstrate how premium SaaS features seamlessly merge with full-stack WebSockets and robust security models.
        </p>
      </div>

      {/* Narrative grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Crafted for Modern Development</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The platform is built using pure JavaScript logic: Vite React on the client side, Node + Express on the backend server, and MongoDB as our storage core. Real-time updates occur via WebSockets through Socket.io, eliminating loading refreshes.
          </p>
          <div className="space-y-4.5">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500 shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Glassmorphic Elegance</h4>
                <p className="text-xs text-slate-400 mt-0.5">Designed with rich backdrop-blur visual systems that fit light and dark preferences.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Enterprise Security Guard</h4>
                <p className="text-xs text-slate-400 mt-0.5">Helmet protection, rate limiting, and hashed password credentials by default.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 border border-white/20 dark:border-dark-800/20 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="p-3 w-fit rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white shadow-lg">
            <Award className="w-6 h-6 animate-float" />
          </div>
          <h3 className="text-lg font-bold">Standard of Excellence</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AetherTalk ensures absolute responsiveness. Each layout dynamically adjusts for mobile viewports, tablet screens, and wide-panel desktop terminals to ensure premium user experience everywhere.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
