import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Terminal, ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAccessCodes } from '../services/adminService';

export default function SecretAdminGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, setAccessLevel } = useAuth();
  const navigate = useNavigate();

  // Secret trigger: 5 clicks on the footer text
  const [clickCount, setClickCount] = useState(0);

  const [codes, setCodes] = useState<any>(null);

  useEffect(() => {
    if (clickCount >= 5) {
      setIsOpen(true);
      setClickCount(0);
      // Pre-fetch codes when opening to avoid async delay before login popup
      getAccessCodes().then(setCodes).catch(console.error);
    }
  }, [clickCount]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const accessCodes = codes || await getAccessCodes();
      if (!codes) setCodes(accessCodes);
      
      let level: Role | null = null;
      if (code === accessCodes.super_admin) level = 'super_admin';
      else if (code === accessCodes.sub_admin) level = 'sub_admin';
      else if (code === accessCodes.editor) level = 'editor';

      if (level) {
        setAccessLevel(level);
        if (user) {
          navigate('/admin');
          setIsOpen(false);
        } else {
          // If not logged in, we show a direct login button to ensure user gesture
          setIsAuthenticated(true);
        }
      } else {
        setError('ACCESS DENIED: Invalid Protocol Code');
      }
    } catch (err) {
      console.error(err);
      setError('System Error: Unable to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectLogin = async () => {
    setLoading(true);
    try {
      await login();
      navigate('/admin');
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <footer className="py-6 text-center text-slate-600 text-xs select-none">
        <span 
          onClick={() => setClickCount(prev => prev + 1)}
          className="cursor-default hover:text-slate-500 transition-colors"
        >
          © 2024 STB FF Guild. All rights reserved.
        </span>
      </footer>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-slate-950 border border-emerald-500/30 rounded-xl p-8 shadow-2xl shadow-emerald-500/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
              
              <div className="flex items-center gap-3 mb-6 text-emerald-500">
                <Terminal size={24} />
                <h2 className="text-xl font-mono font-bold tracking-wider">ADMIN_TERMINAL</h2>
              </div>

              {!isAuthenticated ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono text-emerald-500/70 mb-2 uppercase tracking-widest">
                      Enter Access Protocol
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-emerald-500/20"
                        placeholder="••••••••"
                        autoFocus
                        disabled={loading}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500/50">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : (code.length > 0 ? <Unlock size={16} /> : <Lock size={16} />)}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-500/10 p-3 rounded border border-red-500/20">
                      <ShieldAlert size={14} />
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-2 bg-slate-900 text-slate-400 font-mono text-sm rounded hover:bg-slate-800 transition-colors"
                      disabled={loading}
                    >
                      ABORT
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 font-mono text-sm rounded hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
                      disabled={loading}
                    >
                      AUTHENTICATE
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <p className="text-emerald-400 font-mono text-sm mb-2">PROTOCOL ACCEPTED</p>
                    <p className="text-slate-400 text-xs">Please sign in with Google to access the dashboard.</p>
                  </div>
                  
                  <button
                    onClick={handleDirectLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} className="rotate-180" />}
                    LOGIN WITH GOOGLE
                  </button>

                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-slate-500 hover:text-slate-300 text-xs font-mono uppercase tracking-widest transition-colors"
                  >
                    Back to Terminal
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
