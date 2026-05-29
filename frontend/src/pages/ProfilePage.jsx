import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { User, Mail, ShieldAlert, Cpu, Trash2, Plus, Brain } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [memoryList, setMemoryList] = useState([]);
  const [newMemory, setNewMemory] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setMemoryList(user.memory || []);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      // In a real database we could update user records
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.warn('Profile update failed');
    }
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!newMemory.trim()) return;

    const updated = [...memoryList, newMemory.trim()];
    try {
      const res = await API.put('/productivity/memory', { memory: updated });
      if (res.data.success) {
        setMemoryList(res.data.memory);
        setNewMemory('');
      }
    } catch (err) {
      console.error('Failed to sync memory');
    }
  };

  const handleDeleteMemory = async (indexToDelete) => {
    const updated = memoryList.filter((_, idx) => idx !== indexToDelete);
    try {
      const res = await API.put('/productivity/memory', { memory: updated });
      if (res.data.success) {
        setMemoryList(res.data.memory);
      }
    } catch (err) {
      console.error('Failed to delete memory');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 pb-24">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">User Identity Control</h1>
        <p className="text-xs text-slate-400 mt-1">Manage system credentials, dynamic roles, and AI cognitive memories</p>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-semibold animate-fade-in">
          ✅ Profile metrics updated successfully!
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Details Edit Card */}
        <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200/50 dark:border-dark-800/30">
            <User className="w-5 h-5 text-primary-500" />
            <h3 className="font-bold text-sm">Identity Profile</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Account Username</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
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
                  disabled
                  value={user?.email || ''}
                  className="glass-input text-sm w-full pl-12 bg-slate-100/50 dark:bg-dark-900/40 cursor-not-allowed opacity-70"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Dynamic System Role</label>
              <div className="relative">
                <ShieldAlert className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  disabled
                  value={user?.role?.toUpperCase() || ''}
                  className="glass-input text-sm w-full pl-12 bg-slate-100/50 dark:bg-dark-900/40 cursor-not-allowed opacity-70 font-bold tracking-widest text-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-md shadow-primary-500/10"
            >
              Commit Updates
            </button>
          </form>
        </div>

        {/* AI Memory Tracker Visual Card */}
        <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl flex flex-col justify-between h-[450px]">
          <div>
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200/50 dark:border-dark-800/30 mb-4">
              <Brain className="w-5 h-5 text-purple-500 animate-float" />
              <h3 className="font-bold text-sm">AI Memory Tracker</h3>
            </div>

            {/* Manual Insert Memory */}
            <form onSubmit={handleAddMemory} className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="Instruct AI memory manually..."
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                className="flex-grow text-xs bg-slate-100 dark:bg-dark-900 border border-transparent dark:border-dark-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {memoryList.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">AI memory database is empty. It learns as you chat!</p>
              ) : (
                memoryList.map((mem, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-100/60 dark:bg-dark-900/40 border border-slate-200/5"
                  >
                    <span className="text-xs font-semibold leading-relaxed break-all pr-4">{mem}</span>
                    <button
                      onClick={() => handleDeleteMemory(idx)}
                      className="text-red-400 hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-normal mt-4">
            🤖 AetherTalk memorizes details from your discussions automatically so its responses stay contextually consistent over months.
          </p>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
