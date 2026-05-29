import React, { useContext, useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  Sun, Moon, LayoutDashboard, MessageSquare, User,
  Settings, ShieldAlert, LogOut, ChevronLeft, ChevronRight,
  Plus, MessageCircle, Menu, X, Pin, Trash2, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { chats, currentChat, setCurrentChat, createNewChat, togglePinChat, deleteChatRoom } = useContext(ChatContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [floatingOpen, setFloatingOpen] = useState(false);
  const [floatingChatId, setFloatingChatId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not authenticated, kick to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCreateNewChat = async () => {
    const chat = await createNewChat('Quick Chat Room', 'friendly');
    if (chat) {
      navigate('/chat');
      setMobileOpen(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Chat Terminal', path: '/chat', icon: MessageSquare },
    { name: 'User Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ name: 'Admin Hub', path: '/admin', icon: ShieldAlert });
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* Background neon flares */}
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-primary-600/10 dark:bg-primary-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* MOBILE HEADER FOR SIDEBAR DRAWER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/85 dark:bg-dark-950/85 backdrop-blur-md border-b border-slate-200/60 dark:border-dark-800/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-200/50 dark:bg-dark-900/50 hover:bg-slate-200 dark:hover:bg-dark-800 transition-all text-slate-700 dark:text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold tracking-tight text-slate-900 dark:text-white">AetherTalk</span>
        </div>
        <button
          onClick={handleCreateNewChat}
          className="p-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* MOBILE SIDEBAR (Drawer overlay) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed top-0 bottom-0 left-0 z-50 w-72 glass dark:glass-dark border-r border-slate-200/60 dark:border-dark-800/40 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 text-white">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="font-bold tracking-tight">AetherTalk</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-dark-900/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-2 mb-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                        : 'hover:bg-slate-200/50 dark:hover:bg-dark-900/30 text-slate-600 dark:text-slate-400'
                        }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <hr className="border-slate-200/50 dark:border-dark-800/30 mb-6" />

              {/* Chats listings in Mobile */}
              <div className="flex-grow overflow-y-auto mb-6 pr-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider mb-3">
                  <span>Conversations</span>
                </div>
                <div className="space-y-1">
                  {chats.map((c) => {
                    const isActive = currentChat?._id === c._id;
                    return (
                      <div
                        key={c._id}
                        onClick={() => {
                          setCurrentChat(c);
                          navigate('/chat');
                          setMobileOpen(false);
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${isActive
                          ? 'bg-slate-200/60 dark:bg-dark-900/60 text-primary-500 border-l-2 border-primary-500 font-medium'
                          : 'hover:bg-slate-200/30 dark:hover:bg-dark-900/20 text-slate-600 dark:text-slate-400'
                          }`}
                      >
                        <span className="truncate text-sm flex-grow pr-2">{c.title}</span>
                        {c.isPinned && <Pin className="w-3.5 h-3.5 text-primary-400 rotate-45" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile User Info */}
              <div className="p-3.5 rounded-2xl glass-dark dark:glass border border-slate-200/10 flex items-center space-x-3 truncate mt-auto">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 text-white font-bold text-sm flex items-center justify-center shrink-0 uppercase shadow-md shadow-primary-500/10">
                  {user?.username ? user.username.substring(0, 2) : 'AG'}
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-semibold truncate leading-4">{user?.username || 'AetherGuest'}</h4>
                  <span className="text-xs text-slate-400 truncate leading-3 uppercase tracking-wider">{user?.role || 'user'}</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR (Collapsible) */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-white/30 dark:bg-dark-950/20 backdrop-blur-xl border-r border-slate-200/60 dark:border-dark-800/40 p-5 z-20 shrink-0 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-8 px-2.5">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 text-white shadow-md shadow-primary-500/15 animate-float">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-bold tracking-tight text-lg">AetherTalk</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 text-white mx-auto shadow-md">
              <Cpu className="w-4 h-4" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-dark-900/60 border border-slate-200/20 text-slate-500"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCreateNewChat}
          className={`flex items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm py-3 px-4 shadow-lg shadow-primary-500/15 hover:shadow-primary-500/25 transition-all mb-6 ${sidebarOpen ? 'w-full space-x-2' : 'w-11 h-11 p-0 mx-auto'
            }`}
        >
          <Plus className="w-4 h-4" />
          {sidebarOpen && <span>New Chat</span>}
        </button>

        {/* Navigation items */}
        <nav className="flex flex-col space-y-1.5 mb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center rounded-xl text-sm font-semibold py-3 transition-all ${sidebarOpen ? 'px-4 space-x-3.5' : 'px-0 justify-center w-11 h-11 mx-auto'
                  } ${isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/15'
                    : 'hover:bg-slate-200/60 dark:hover:bg-dark-900/35 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                  }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <hr className="border-slate-200/50 dark:border-dark-800/30 mb-5" />

        {/* Dynamic active chats lists inside sidebar */}
        <div className="flex-grow overflow-y-auto mb-6 pr-1 custom-scrollbar">
          {sidebarOpen && (
            <>
              <div className="text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider mb-3 px-4">
                Recent Chats
              </div>
              <div className="space-y-1 px-1">
                {chats.map((c) => {
                  const isActive = currentChat?._id === c._id;
                  return (
                    <div
                      key={c._id}
                      onClick={() => {
                        setCurrentChat(c);
                        if (location.pathname !== '/chat') navigate('/chat');
                      }}
                      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${isActive
                        ? 'bg-slate-200/60 dark:bg-dark-900/60 text-primary-500 font-semibold shadow-inner'
                        : 'hover:bg-slate-200/40 dark:hover:bg-dark-900/25 text-slate-600 dark:text-slate-400'
                        }`}
                    >
                      <span className="truncate text-sm flex-grow pr-2">{c.title}</span>
                      <div className="flex items-center space-x-1.5">
                        {c.isPinned && <Pin className="w-3.5 h-3.5 text-primary-400 rotate-45" />}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChatRoom(c._id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500 rounded transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* User details */}
        <div className="mt-auto">
          {sidebarOpen ? (
            <div className="p-3.5 rounded-2xl glass-dark dark:glass border border-slate-200/10 flex items-center space-x-3 truncate">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 text-white font-bold text-sm flex items-center justify-center shrink-0 uppercase shadow-md shadow-primary-500/10">
                {user?.username ? user.username.substring(0, 2) : 'AG'}
              </div>
              <div className="truncate">
                <h4 className="text-sm font-semibold truncate leading-4">{user?.username || 'AetherGuest'}</h4>
                <span className="text-xs text-slate-400 truncate leading-3 uppercase tracking-wider">{user?.role || 'user'}</span>
              </div>
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 text-white font-bold text-sm flex items-center justify-center mx-auto uppercase shadow-md" title={user?.username || 'AetherGuest'}>
              {user?.username ? user.username.substring(0, 2) : 'AG'}
            </div>
          )}
        </div>
      </motion.aside>

      {/* MAIN VIEW AREA */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden pt-20 lg:pt-0">
        <main className="flex-grow relative">
          <Outlet />
        </main>
      </div>

      {/* FLOATING CHAT LAUNCHER BUTTON AND MODAL FOR QUICK DIALOG */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {floatingOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="glass-card shadow-2xl w-[360px] h-[480px] border border-white/20 dark:border-dark-800/30 mb-4 overflow-hidden flex flex-col p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-dark-800/40">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-bold text-sm">Quick AI Assistant</span>
                </div>
                <button
                  onClick={() => setFloatingOpen(false)}
                  className="p-1 hover:bg-slate-200/60 dark:hover:bg-dark-900/50 rounded-lg text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Viewport Fallback */}
              <div className="flex-grow py-4 flex flex-col items-center justify-center text-center space-y-4">
                <Cpu className="w-10 h-10 text-primary-500 animate-float" />
                <h4 className="text-sm font-semibold">Need instant helper?</h4>
                <p className="text-xs text-slate-400 max-w-[240px]">Start an dynamic conversational room to summarize texts, compose logs, or solve code problems!</p>
                <button
                  onClick={() => {
                    setFloatingOpen(false);
                    handleCreateNewChat();
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/10 transition-colors"
                >
                  Open Chat Terminal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFloatingOpen(!floatingOpen)}
          className="p-4 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white shadow-xl shadow-primary-500/35 cursor-pointer border border-primary-500/40 focus:outline-none flex items-center justify-center"
        >
          {floatingOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 animate-pulse-slow" />}
        </motion.button>
      </div>

    </div>
  );
};

export default DashboardLayout;
