import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Settings, Eye, Volume2, Bell, Sparkles } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfileSettings } = useContext(AuthContext);
  const { theme, changeThemeMode } = useContext(ThemeContext);

  const [fontSize, setFontSize] = useState('medium');
  const [chatBg, setChatBg] = useState('default');
  const [sound, setSound] = useState(true);
  const [notify, setNotify] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user && user.settings) {
      setFontSize(user.settings.fontSize || 'medium');
      setChatBg(user.settings.chatBackground || 'default');
      setSound(user.settings.sound !== false);
      setNotify(user.settings.notifications !== false);
    }
  }, [user]);

  const handleSaveSettings = async () => {
    setSaved(false);
    const success = await updateProfileSettings({
      fontSize,
      chatBackground: chatBg,
      sound,
      notifications: notify
    });
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 pb-24">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">System Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">Configure layout, typography, visual tokens, and alert notifications</p>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-semibold animate-fade-in">
          ✅ Settings saved and synchronized successfully!
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Core Layout tokens */}
        <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200/50 dark:border-dark-800/30">
            <Eye className="w-5 h-5 text-primary-500" />
            <h3 className="font-bold text-sm">Visual Design Tokens</h3>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* Theme Toggle */}
            <div className="flex flex-col space-y-2">
              <label className="text-slate-400 uppercase tracking-wider text-[10px]">App Interface Theme</label>
              <div className="grid grid-cols-3 gap-2 text-center">
                {['light', 'dark'].map((t) => (
                  <button
                    key={t}
                    onClick={() => changeThemeMode(t)}
                    className={`py-2 px-3 rounded-lg border font-bold capitalize transition-all ${
                      theme === t
                        ? 'bg-primary-600 text-white border-primary-500 shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-dark-900 border-slate-200/30 text-slate-500'
                    }`}
                  >
                    {t} Theme
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Room Background Customizer */}
            <div className="flex flex-col space-y-2">
              <label className="text-slate-400 uppercase tracking-wider text-[10px]">Chatroom Background Style</label>
              <select
                value={chatBg}
                onChange={(e) => setChatBg(e.target.value)}
                className="glass-input dark:bg-dark-900 text-slate-700 dark:text-slate-200"
              >
                <option value="default">Default Obsidian Matte</option>
                <option value="neon">Neon Sapphire Gradient</option>
                <option value="galaxy">Interstellar Space Blur</option>
                <option value="sleek">Pure Minimalist Glass</option>
              </select>
            </div>

            {/* Font sliders */}
            <div className="flex flex-col space-y-2">
              <label className="text-slate-400 uppercase tracking-wider text-[10px]">Text Display Size</label>
              <div className="grid grid-cols-3 gap-2 text-center">
                {['small', 'medium', 'large'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`py-2 px-3 rounded-lg border font-bold capitalize transition-all ${
                      fontSize === sz
                        ? 'bg-primary-600 text-white border-primary-500 shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-dark-900 border-slate-200/30 text-slate-500'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Alerts and sounds */}
        <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200/50 dark:border-dark-800/30">
              <Volume2 className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-sm">Alert and System Toggles</h3>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              {/* Sound alerts */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-dark-900/40">
                <div className="flex flex-col space-y-0.5">
                  <span>Vocal Replies & Sounds</span>
                  <span className="text-[10px] text-slate-400 font-normal">Play synthesized text reads automatically</span>
                </div>
                <input
                  type="checkbox"
                  checked={sound}
                  onChange={(e) => setSound(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-slate-200/30 rounded focus:ring-primary-500"
                />
              </div>

              {/* Push notifications */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-dark-900/40">
                <div className="flex flex-col space-y-0.5">
                  <span>Push Notifications</span>
                  <span className="text-[10px] text-slate-400 font-normal">Receive reminders and calendar alarms</span>
                </div>
                <input
                  type="checkbox"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-slate-200/30 rounded focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-primary-500/10 transition-all mt-6"
          >
            Synchronize Preferences
          </button>
        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
