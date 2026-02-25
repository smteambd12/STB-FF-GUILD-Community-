import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  Users, 
  Trophy, 
  Gamepad2, 
  Activity, 
  Swords, 
  Target, 
  Crown, 
  Flame,
  ChevronRight,
  Star,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { getPlayers, PlayerStats } from '../services/playerService';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [players, setPlayers] = useState<PlayerStats[]>([]);

  useEffect(() => {
    getPlayers().then(data => {
      if (data.length > 0) {
        setPlayers(data);
      } else {
        // Fallback to initial mock data if none in DB
        setPlayers([
          { name: 'STB_King', role: 'Leader', level: 75, rank: 'Grandmaster', kd: '5.24', hs: '68%', matches: '12.5K', winRate: '42%' },
          { name: 'STB_Sniper', role: 'Co-Leader', level: 72, rank: 'Master', kd: '4.89', hs: '72%', matches: '10.2K', winRate: '38%' },
          { name: 'STB_Rusher', role: 'Elite', level: 68, rank: 'Heroic', kd: '4.15', hs: '55%', matches: '8.4K', winRate: '35%' },
          { name: 'STB_Ghost', role: 'Member', level: 65, rank: 'Heroic', kd: '3.85', hs: '48%', matches: '6.1K', winRate: '32%' },
          { name: 'STB_Viper', role: 'Member', level: 64, rank: 'Diamond IV', kd: '3.20', hs: '45%', matches: '5.5K', winRate: '30%' },
          { name: 'STB_Shadow', role: 'Member', level: 62, rank: 'Diamond III', kd: '2.95', hs: '42%', matches: '4.8K', winRate: '28%' },
        ]);
      }
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative -mt-4 -mx-4 lg:-mt-8 lg:-mx-8 h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-950/80 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-mono tracking-widest uppercase mb-4 block w-fit mx-auto backdrop-blur-md">
              Est. 2024 • Bangladesh
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase"
          >
            STB <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 text-glow">Esports</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto font-light"
          >
            {language === 'bn' 
              ? "বাংলাদেশের সবচেয়ে শক্তিশালী ফ্রি ফায়ার কমিউনিটি। আমাদের সাথে যোগ দিন এবং জয়ের পথে এগিয়ে যান।" 
              : "The most powerful Free Fire community in Bangladesh. Join us and dominate the battlegrounds."}
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2">
              <Zap size={20} fill="currentColor" />
              {t('join_team')}
            </button>
            <button className="px-8 py-3 bg-slate-800/50 hover:bg-slate-800 text-white border border-white/10 font-bold rounded-xl transition-all hover:scale-105 backdrop-blur-md flex items-center gap-2">
              <Trophy size={20} />
              {t('tournaments')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-24 relative z-20 px-4 max-w-7xl mx-auto"
      >
        {[
          { label: 'Active Members', value: '2.5K+', icon: Users, color: 'text-blue-400' },
          { label: 'Tournaments Won', value: '150+', icon: Trophy, color: 'text-amber-400' },
          { label: 'Elite Squads', value: '12', icon: Swords, color: 'text-red-400' },
          { label: 'Daily Matches', value: '50+', icon: Target, color: 'text-emerald-400' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glass-panel p-6 rounded-2xl text-center hover:bg-slate-800/80 transition-colors group"
          >
            <div className={`mx-auto w-12 h-12 rounded-full bg-slate-900/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Featured Teams */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <Crown className="text-amber-500" />
              Elite Squads
            </h2>
            <p className="text-slate-400 mt-1">Top performing teams of the month</p>
          </div>
          <button className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors">
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-white/5"
            >
              <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="absolute -bottom-8 left-6">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border-4 border-slate-900 flex items-center justify-center shadow-xl">
                    <Gamepad2 className="text-emerald-500" size={32} />
                  </div>
                </div>
              </div>
              <div className="pt-10 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">STB Alpha</h3>
                    <p className="text-sm text-slate-500">Leader: STB_King</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded text-xs font-bold">
                    <Trophy size={12} />
                    <span>#1</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4].map((m) => (
                    <div key={m} className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" title={`Member ${m}`} />
                  ))}
                </div>
                <button className="w-full py-2 bg-slate-800 hover:bg-emerald-500 hover:text-slate-900 text-slate-300 font-bold rounded-lg transition-all text-sm">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guild Players Roster */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <Users className="text-blue-500" />
              Guild Roster
            </h2>
            <p className="text-slate-400 mt-1">Meet our elite warriors and their battle stats</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors">All</button>
            <button className="px-3 py-1 bg-slate-800/50 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-700 transition-colors">Leaders</button>
            <button className="px-3 py-1 bg-slate-800/50 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-700 transition-colors">Elites</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player, i) => (
            <motion.div 
              key={player.id || i}
              whileHover={{ y: -5 }}
              className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all group"
            >
              {/* Card Header */}
              <div className="p-6 flex items-start justify-between relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500 group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-colors shadow-lg">
                      {player.name[4]}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-slate-950 rounded-lg border border-slate-800 p-1">
                      {player.rank === 'Grandmaster' && <Crown size={14} className="text-red-500" />}
                      {player.rank === 'Master' && <Star size={14} className="text-purple-500" />}
                      {player.rank === 'Heroic' && <ShieldCheck size={14} className="text-amber-500" />}
                      {player.rank.includes('Diamond') && <Target size={14} className="text-blue-400" />}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{player.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        player.role === 'Leader' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        player.role === 'Co-Leader' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        player.role === 'Elite' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-slate-700/50 text-slate-400 border-slate-600/30'
                      }`}>
                        {player.role}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Lvl.{player.level}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Rank</div>
                  <div className={`text-sm font-bold ${
                    player.rank === 'Grandmaster' ? 'text-red-500' :
                    player.rank === 'Master' ? 'text-purple-500' :
                    player.rank === 'Heroic' ? 'text-amber-500' :
                    'text-blue-400'
                  }`}>
                    {player.rank}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 border-t border-slate-800 bg-slate-950/30 divide-x divide-slate-800">
                <div className="p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">K/D</div>
                  <div className="text-sm font-bold text-white">{player.kd}</div>
                </div>
                <div className="p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Headshot</div>
                  <div className="text-sm font-bold text-emerald-400">{player.hs}</div>
                </div>
                <div className="p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Win Rate</div>
                  <div className="text-sm font-bold text-blue-400">{player.winRate}</div>
                </div>
                <div className="p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Matches</div>
                  <div className="text-sm font-bold text-slate-300">{player.matches}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-3xl p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                Registration Open
              </div>
              <h2 className="text-4xl font-black text-white uppercase italic">
                Grand Championship <span className="text-emerald-500">S5</span>
              </h2>
              <p className="text-slate-300 text-lg">
                The biggest tournament of the season is here. Compete for a prize pool of 50,000 BDT.
                Limited slots available.
              </p>
              
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={18} className="text-emerald-500" />
                  <span>48 Teams</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Trophy size={18} className="text-amber-500" />
                  <span>50K BDT Prize</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Activity size={18} className="text-blue-500" />
                  <span>Squad Mode</span>
                </div>
              </div>

              <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-emerald-400 transition-colors">
                Register Now
              </button>
            </div>
            
            <div className="flex-1 w-full max-w-md">
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative group cursor-pointer">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop" 
                  alt="Tournament Teaser" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery / Media Grid */}
      <section className="px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
          <Flame className="text-orange-500" />
          Best Moments
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[400px]">
          <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Highlight 1" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <p className="text-white font-bold">Grand Final Clutch</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Highlight 2" />
          </div>
          <div className="rounded-2xl overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Highlight 3" />
          </div>
          <div className="col-span-2 rounded-2xl overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1947&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Highlight 4" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <p className="text-white font-bold">Community Meetup 2024</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
