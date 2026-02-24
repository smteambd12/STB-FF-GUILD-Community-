import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Terminal, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SecretAdminGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Secret trigger: 5 clicks on the footer text
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount >= 5) {
      setIsOpen(true);
      setClickCount(0);
    }
  }, [clickCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcoded "Secret Codes" for demonstration
    // In production, you'd verify this against a secure backend function or just rely on Auth
    if (code === 'STB_SUPER' || code === 'STB_SUB') {
      if (!user) {
        await login();
      }
      navigate('/admin');
      setIsOpen(false);
    } else {
      setError('ACCESS DENIED: Invalid Protocol Code');
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
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

              <div className="flex items-center gap-3 mb-6 text-emerald-500">
                <Terminal size={24} />
                <h2 className="text-xl font-mono font-bold tracking-wider">ADMIN_TERMINAL</h2>
              </div>

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
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500/50">
                      {code.length > 0 ? <Unlock size={16} /> : <Lock size={16} />}
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
                  >
                    ABORT
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 font-mono text-sm rounded hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                  >
                    AUTHENTICATE
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
