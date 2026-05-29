import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter Tier',
      price: 0,
      description: 'Ideal for conversational testing and small developer projects.',
      features: [
        'Access to Friendly AI personality',
        '2 active Chat Rooms',
        'Standard Socket.io speeds',
        'Basic memory capacity (3 logs)',
        'Local file uploads up to 2MB',
      ],
      cta: 'Begin Free Trial',
      popular: false
    },
    {
      name: 'Pro Premium',
      price: isAnnual ? 15 : 19,
      description: 'Engineered for power users, writing tasks, and document analyses.',
      features: [
        'All 5 AI Personality Tones',
        'Infinite active Chat Rooms',
        'Priority high-speed Socket gateways',
        'Full AI memory management bank',
        'Vision upload analyses up to 10MB',
        'Full Access to Admin diagnostic logs',
        'Interactive calendar widget sync'
      ],
      cta: 'Get Pro Access',
      popular: true
    },
    {
      name: 'Enterprise Hub',
      price: 49,
      description: 'Tailored for administrative controls and production pipelines.',
      features: [
        'Unlimited AI queries',
        'Dedicated custom system prompts',
        'Administrative dashboard control panels',
        'Bulk user blocking and deletion',
        'API endpoint rate limiting overrides',
        '24/7 dedicated support priority'
      ],
      cta: 'Contact Operations',
      popular: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight">Flexible SaaS Subscriptions</h1>
        <p className="text-slate-500 dark:text-slate-400">Deploy AetherTalk for yourself or your administrative corporation securely.</p>
        
        {/* Toggle */}
        <div className="inline-flex items-center space-x-3 p-1 rounded-xl bg-slate-200/50 dark:bg-dark-900/60 w-fit mx-auto mt-4">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isAnnual ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isAnnual ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Annual Billing (-20%)
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((p) => (
          <motion.div
            key={p.name}
            whileHover={{ y: -5 }}
            className={`glass-card p-8 border flex flex-col justify-between relative ${
              p.popular 
                ? 'border-primary-500/50 dark:border-primary-500/30 neon-glow-primary' 
                : 'border-white/20 dark:border-dark-800/20'
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 text-[10px] font-bold text-white tracking-widest uppercase flex items-center space-x-1 shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>Recommended Package</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{p.description}</p>
              </div>

              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold">${p.price}</span>
                <span className="text-xs text-slate-400">/ user / month</span>
              </div>

              <hr className="border-slate-200/55 dark:border-dark-800/30" />

              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/register')}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all mt-8 ${
                p.popular
                  ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-slate-200/60 dark:bg-dark-900/60 hover:bg-slate-200 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {p.cta}
            </button>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default PricingPage;
