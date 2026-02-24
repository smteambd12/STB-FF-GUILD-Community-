import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Users, Trophy, Gamepad2, Activity } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const stats = [
    { label: t('members'), value: '128', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: t('teams'), value: '12', icon: Gamepad2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: t('tournaments'), value: '3', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Active Now', value: '42', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('dashboard')}</h1>
          <p className="text-slate-400 mt-1">{t('welcome')}, {user?.displayName}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-lg transition-colors">
            {t('create_team')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <h3 className="text-slate-400 font-medium">{stat.label}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity / Tournaments */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t('tournaments')}</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Weekly Scrims #{i}</h3>
                    <p className="text-sm text-slate-500">48/48 Slots • Prize 500 BDT</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 rounded-full">
                  Open
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Chat Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t('chat')}</h2>
          <div className="h-[300px] flex items-center justify-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800 border-dashed">
            <p>Select a team to view chat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
