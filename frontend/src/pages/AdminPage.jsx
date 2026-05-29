import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  Users, MessageSquare, FileUp, Terminal, ShieldAlert, 
  UserX, UserCheck, Trash2, Loader2, Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // States
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Role guard: redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAdminMetrics();
  }, [user]);

  const fetchAdminMetrics = async () => {
    setLoading(true);
    try {
      const resAnalytic = await API.get('/admin/analytics');
      const resUsers = await API.get('/admin/users');
      const resLogs = await API.get('/admin/logs');

      if (resAnalytic.data.success) setAnalytics(resAnalytic.data.analytics);
      if (resUsers.data.success) setUsersList(resUsers.data.users);
      if (resLogs.data.success) setSystemLogs(resLogs.data.logs);

    } catch (err) {
      console.warn('Failed to load admin controls', err.message);
    }
    setLoading(false);
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await API.put(`/admin/users/${id}/block`);
      if (res.data.success) {
        setUsersList((prev) =>
          prev.map((usr) => (usr._id === id ? { ...usr, isBlocked: res.data.user.isBlocked } : usr))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to modify block state.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('WARNING: Are you absolutely sure you want to delete this user profile and ALL their chat rooms permanently? This cannot be undone.')) return;
    
    try {
      const res = await API.delete(`/admin/users/${id}`);
      if (res.data.success) {
        setUsersList((prev) => prev.filter((usr) => usr._id !== id));
        fetchAdminMetrics(); // Refresh analytical counts
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accessing Admin Hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 pb-24">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Administrative Terminal</h1>
        <p className="text-xs text-slate-400 mt-1">Platform analytics, user registry blocks, and diagnostic terminal outputs</p>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 flex items-center space-x-4">
          <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
            <Users className="w-6 h-6 animate-float" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold">{analytics?.totalUsers}</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Registered Users</p>
          </div>
        </div>

        <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold">{analytics?.activeUsers}</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Status</p>
          </div>
        </div>

        <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold">{analytics?.totalMessages}</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Dialogues</p>
          </div>
        </div>

        <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <FileUp className="w-6 h-6 animate-float" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold">{analytics?.totalFiles}</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Analyzed Files</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* User control Panel registry Table (Left 2 Columns) */}
        <div className="lg:col-span-2 glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200/50 dark:border-dark-800/30">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span className="font-bold text-sm">User Registry Directory</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-dark-800/30 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Account</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30 dark:divide-dark-850">
                {usersList.map((usr) => (
                  <tr key={usr._id} className="hover:bg-slate-200/20 dark:hover:bg-dark-900/15">
                    <td className="py-3 px-2">
                      <div className="font-bold">{usr.username}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{usr.email}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        usr.role === 'admin' ? 'bg-primary-500/10 text-primary-500' : 'bg-slate-100 text-slate-500 dark:bg-dark-900'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-semibold ${usr.isBlocked ? 'text-red-500' : 'text-emerald-500'}`}>
                        {usr.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <button
                        onClick={() => handleToggleBlock(usr._id)}
                        disabled={usr.role === 'admin'}
                        className={`p-1.5 rounded-lg border transition-all ${
                          usr.role === 'admin'
                            ? 'opacity-40 cursor-not-allowed'
                            : usr.isBlocked
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                        }`}
                        title={usr.isBlocked ? "Unblock account" : "Block account"}
                      >
                        {usr.isBlocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteUser(usr._id)}
                        disabled={usr.role === 'admin'}
                        className={`p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all ${
                          usr.role === 'admin' ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        title="Delete User permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Server Diagnostic Logs (Right Column) */}
        <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl space-y-4 flex flex-col justify-between h-[450px]">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-200/50 dark:border-dark-800/30 mb-3">
              <Terminal className="w-5 h-5 text-amber-500 animate-float" />
              <span className="font-bold text-sm">Diagnostic System Outputs</span>
            </div>

            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl font-mono text-[9px] leading-relaxed text-slate-300 space-y-3 h-[280px] overflow-y-auto custom-scrollbar">
              {systemLogs.map((log, idx) => (
                <div key={idx} className="break-all whitespace-pre-wrap">{log}</div>
              ))}
            </div>
          </div>

          <p className="text-[9px] text-slate-400 leading-normal mt-3">Diagnostics log cycles refresh dynamically on client access requests.</p>
        </div>

      </div>

    </div>
  );
};

export default AdminPage;
