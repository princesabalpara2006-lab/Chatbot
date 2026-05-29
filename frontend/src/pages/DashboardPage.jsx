import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import API from '../services/api';
import { 
  Cpu, Calendar, CheckSquare, CloudSun, FileText, 
  Quote, Calculator, Bell, Newspaper, Plus, Trash2, CheckCircle2, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { 
    chats, reminders, addNewReminder, toggleCompleteReminder, deleteReminderItem 
  } = useContext(ChatContext);

  // Widget States
  const [weather, setWeather] = useState({ city: 'New York', temp: '22°C', condition: 'Sunny', humidity: '45%' });
  const [weatherQuery, setWeatherQuery] = useState('');
  
  const [note, setNote] = useState('');
  const [quotes, setQuotes] = useState({ text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" });
  const [news, setNews] = useState([]);
  
  // Calculator States
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcInput, setCalcInput] = useState('');

  // Reminder Inputs
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemDate, setNewRemDate] = useState('');

  useEffect(() => {
    fetchWeatherInfo();
    fetchTechNews();
  }, []);

  const fetchWeatherInfo = async (query = 'New York') => {
    try {
      const res = await API.get(`/productivity/weather?city=${query}`);
      if (res.data.success) {
        setWeather(res.data);
      }
    } catch (err) {
      console.warn('Weather fetch failed');
    }
  };

  const fetchTechNews = async () => {
    try {
      const res = await API.get('/productivity/news');
      if (res.data.success) {
        setNews(res.data.news);
      }
    } catch (err) {
      console.warn('News fetch failed');
    }
  };

  const handleWeatherSearch = (e) => {
    e.preventDefault();
    if (weatherQuery) {
      fetchWeatherInfo(weatherQuery);
      setWeatherQuery('');
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!newRemTitle || !newRemDate) return;
    const success = await addNewReminder(newRemTitle, newRemDate);
    if (success) {
      setNewRemTitle('');
      setNewRemDate('');
    }
  };

  // Note actions
  const downloadNote = () => {
    if (!note) return;
    const element = document.createElement("a");
    const file = new Blob([note], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "AetherNotes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Calculator triggers
  const handleCalcClick = (val) => {
    if (val === 'C') {
      setCalcInput('');
    } else if (val === '=') {
      try {
        setCalcInput(eval(calcInput).toString());
      } catch (e) {
        setCalcInput('Error');
      }
    } else {
      setCalcInput(calcInput + val);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 pb-24">
      
      {/* Dynamic Greetings Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Terminal Core, <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">{user?.username}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-none">Standard Operations Status: Active and Healthy</p>
        </div>

        {/* Dynamic Calculator Trigger */}
        <button
          onClick={() => setCalcOpen(!calcOpen)}
          className="px-5 py-3 rounded-xl bg-slate-200/50 dark:bg-dark-900/60 hover:bg-slate-200 dark:hover:bg-dark-800 text-sm font-semibold border border-slate-200/20 flex items-center space-x-2 transition-all"
        >
          <Calculator className="w-4 h-4 text-primary-500 animate-pulse-slow" />
          <span>Launch Calculator</span>
        </button>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT TWO COLUMNS: Productivity Widgets */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Grid rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Weather Widget */}
            <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl flex flex-col justify-between h-[220px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-dark-800/30">
                <div className="flex items-center space-x-2">
                  <CloudSun className="w-5 h-5 text-indigo-500 animate-float" />
                  <span className="font-bold text-sm">Atmospheric Widget</span>
                </div>
                <form onSubmit={handleWeatherSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={weatherQuery}
                    onChange={(e) => setWeatherQuery(e.target.value)}
                    className="w-24 text-[10px] bg-slate-100 dark:bg-dark-950 px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </form>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-3xl font-extrabold">{weather.temp}</h3>
                  <p className="text-xs font-semibold text-slate-400">{weather.city}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-[10px] uppercase">
                    {weather.condition}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1.5">Humidity: {weather.humidity}</p>
                </div>
              </div>
            </div>

            {/* Quote Slider */}
            <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl flex flex-col justify-between h-[220px]">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-200/50 dark:border-dark-800/30">
                <Quote className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-sm">Philosophical Node</span>
              </div>
              <div className="py-2">
                <p className="text-xs italic text-slate-500 dark:text-slate-400 leading-relaxed">
                  "{quotes.text}"
                </p>
                <p className="text-[10px] text-purple-400 font-bold mt-2 text-right">— {quotes.author}</p>
              </div>
            </div>

          </div>

          {/* Schedule Reminders List */}
          <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-200/50 dark:border-dark-800/30 mb-4">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-sm">Dynamic Calendar Alerts</span>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
              {reminders.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No schedule events currently registered.</p>
              ) : (
                reminders.map((rem) => (
                  <div
                    key={rem._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-200/30 dark:bg-dark-900/25 border border-slate-200/10"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleCompleteReminder(rem._id)}
                        className="text-emerald-500"
                      >
                        {rem.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <span className={`text-xs ${rem.isCompleted ? 'line-through text-slate-400' : 'font-medium'}`}>
                        {rem.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] text-slate-400">
                        {new Date(rem.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <button
                        onClick={() => deleteReminderItem(rem._id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add form */}
            <form onSubmit={handleAddReminder} className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200/50 dark:border-dark-800/30">
              <input
                type="text"
                required
                placeholder="Remind me to..."
                value={newRemTitle}
                onChange={(e) => setNewRemTitle(e.target.value)}
                className="w-full text-xs bg-slate-100 dark:bg-dark-950 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <input
                type="date"
                required
                value={newRemDate}
                onChange={(e) => setNewRemDate(e.target.value)}
                className="w-full text-xs bg-slate-100 dark:bg-dark-950 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/10"
              >
                Create Alert
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: Notes Scratchpad & News */}
        <div className="space-y-8">
          
          {/* Notes Scratchpad */}
          <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl flex flex-col justify-between h-[360px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-dark-800/30 mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-sm">Notes Scratchpad</span>
                </div>
                <button
                  onClick={downloadNote}
                  className="text-[10px] text-primary-500 font-bold hover:underline"
                >
                  Download .txt
                </button>
              </div>

              <textarea
                rows="8"
                placeholder="Jot down dynamic lists, database schemas, or prompts..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full text-xs bg-transparent resize-none focus:outline-none leading-relaxed h-[200px]"
              ></textarea>
            </div>

            <p className="text-[9px] text-slate-400 mt-2 leading-tight">Sync status: Saved Locally. Click download to keep offline.</p>
          </div>

          {/* Tech News Summary */}
          <div className="glass-card p-6 border border-white/20 dark:border-dark-800/20 shadow-xl">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-200/50 dark:border-dark-800/30 mb-3">
              <Newspaper className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-sm">AetherTech Feed</span>
            </div>

            <div className="space-y-3.5">
              {news.map((item) => (
                <div key={item.id} className="space-y-1">
                  <h4 className="text-xs font-bold hover:text-primary-500 cursor-pointer transition-colors leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* CALCULATOR FLOATING CARD MODAL */}
      <AnimatePresence>
        {calcOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-72 border border-white/30 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-dark-800/30 mb-4">
                <span className="font-bold text-xs">Aether Calculator</span>
                <button
                  onClick={() => setCalcOpen(false)}
                  className="text-xs font-bold hover:text-slate-500"
                >
                  Close
                </button>
              </div>

              {/* Calculator Panel */}
              <div className="bg-slate-100 dark:bg-dark-950 p-4 rounded-xl text-right mb-4">
                <span className="text-lg font-bold truncate block">{calcInput || '0'}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalcClick(btn)}
                    className="p-3 bg-slate-200/50 dark:bg-dark-900/60 hover:bg-slate-200 dark:hover:bg-dark-800 rounded-xl transition-all"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DashboardPage;
