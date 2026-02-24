import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Gamepad2, 
  Trophy, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  Languages
} from 'lucide-react';
import { cn } from '../lib/utils';
import SecretAdminGate from './SecretAdminGate';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, language, setLanguage } = useLanguage();
  const { user, login, logout, isAdmin, error, clearError } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { href: '/', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/members', label: t('members'), icon: Users },
    { href: '/teams', label: t('teams'), icon: Gamepad2 },
    { href: '/tournaments', label: t('tournaments'), icon: Trophy },
    ...(isAdmin ? [{ href: '/admin', label: t('admin_panel'), icon: ShieldCheck }] : []),
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      {error && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-500/90 text-white p-4 backdrop-blur-md border-b border-red-400 flex items-center justify-between shadow-xl">
          <div className="container mx-auto flex items-center gap-3">
            <ShieldCheck className="shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Authentication Error</p>
              <p className="text-sm opacity-90">{error}</p>
              {error.includes("Domain not authorized") && (
                <p className="text-xs mt-1 bg-black/20 p-2 rounded font-mono select-all">
                  Add this domain to Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains
                </p>
              )}
            </div>
          </div>
          <button onClick={clearError} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="font-bold text-xl text-emerald-500 text-glow">STB FF</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) lg:relative lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-white/5">
              <h1 className="text-2xl font-bold text-emerald-500 tracking-wider text-glow font-mono">STB GUILD</h1>
              <p className="text-xs text-slate-500 mt-1 font-mono tracking-widest uppercase">Elite Community</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                      isActive 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]" />}
                    <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "text-emerald-400")} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between px-4 py-2 bg-black/20 rounded-lg border border-white/5">
                <span className="text-sm text-slate-400">{t('language')}</span>
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 text-xs font-bold bg-slate-800 px-2 py-1 rounded hover:bg-slate-700 transition-colors border border-white/5"
                >
                  <Languages size={14} />
                  {language === 'bn' ? 'বাংলা' : 'English'}
                </button>
              </div>

              {user ? (
                <div className="flex items-center gap-3 px-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-emerald-500/20">
                    {user.displayName?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-slate-200">{user.displayName}</p>
                    <p className="text-xs text-emerald-500/70 truncate capitalize font-mono">{user.role.replace('_', ' ')}</p>
                  </div>
                  <button onClick={() => logout()} className="text-slate-400 hover:text-red-400 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => login()}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <LogOut size={18} className="rotate-180" />
                  {t('login')}
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-8 relative">
          {children}
          <SecretAdminGate />
        </main>
      </div>
    </div>
  );
}
