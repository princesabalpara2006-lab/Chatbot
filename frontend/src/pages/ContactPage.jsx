import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'general', body: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.body) {
      alert('Please fill out all required fields');
      return;
    }
    
    // Simulate submission
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFormData({ name: '', email: '', subject: 'general', body: '' });
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      
      {/* Contact Cards */}
      <div className="space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Initiate Communication</h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Have questions regarding AetherTalk integrations, custom LLM fine-tuning pipelines, or billing issues? Drop our operations staff a support request!
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Dispatched Mailbox</h4>
              <p className="text-xs text-slate-400 mt-0.5">operations@aethertalk.ai</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Direct Phone Line</h4>
              <p className="text-xs text-slate-400 mt-0.5">+1 (555) 404-0199</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Global Headquarters</h4>
              <p className="text-xs text-slate-400 mt-0.5">Silicon Valley Suite 400, California</p>
            </div>
          </div>
        </div>
      </div>

      {/* Support Request Form */}
      <div className="glass-card p-8 border border-white/20 dark:border-dark-800/20 shadow-2xl relative">
        <h2 className="text-xl font-bold mb-6">Create Support Ticket</h2>

        {success ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3 animate-fade-in">
            <h4 className="font-bold text-emerald-500">Ticket Dispatched!</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Our operations team has received your support details. A strategist will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-input text-sm"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass-input text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Subject Classification</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="glass-input text-sm dark:bg-dark-950"
              >
                <option value="general">General Inquiry</option>
                <option value="billing">Billing and Tiers</option>
                <option value="technical">Technical Integration</option>
                <option value="custom">Custom AI Prompts</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Detailed Description</label>
              <textarea
                rows="4"
                required
                placeholder="Explain the requirements or concerns you have..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="glass-input text-sm resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20"
            >
              <span>Submit Request</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default ContactPage;
