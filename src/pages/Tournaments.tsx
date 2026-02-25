import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Calendar, Users, DollarSign, Loader2, CheckCircle } from 'lucide-react';
import { getTournaments, registerTeamForTournament } from '../services/tournamentService';
import { Tournament } from '../types';
import { motion } from 'motion/react';

export default function Tournaments() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);

  const fetchTournaments = async () => {
    try {
      const data = await getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error("Failed to fetch tournaments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleRegister = async (tournamentId: string) => {
    if (!user) {
      alert("Please login first.");
      return;
    }
    if (!user.teamId) {
      alert("You need to be in a team to register for a tournament.");
      return;
    }
    
    // Check if user is team leader (optional, but good practice)
    // For simplicity, any team member can register for now, or check role
    if (user.role !== 'team_admin' && user.role !== 'super_admin') {
      alert("Only the Team Leader can register for tournaments.");
      return;
    }

    setRegistering(tournamentId);
    try {
      await registerTeamForTournament(tournamentId, user.teamId);
      await fetchTournaments();
      alert("Successfully registered!");
    } catch (error) {
      console.error("Failed to register", error);
      alert("Failed to register. Please try again.");
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <Trophy className="text-amber-500" />
        {t('tournaments')}
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={40} className="text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tournaments.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
              No active tournaments at the moment. Check back later!
            </div>
          ) : (
            tournaments.map((tournament) => {
              const isRegistered = user?.teamId && tournament.registeredTeams.includes(user.teamId);
              const isFull = tournament.registeredTeams.length >= tournament.totalSlots;

              return (
                <motion.div 
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-colors group"
                >
                  <div className="h-48 bg-slate-800 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block ${
                        tournament.status === 'open' ? 'bg-emerald-500 text-slate-900' : 'bg-red-500 text-white'
                      }`}>
                        {tournament.status}
                      </span>
                      <h2 className="text-2xl font-bold text-white">{tournament.title}</h2>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <p className="text-slate-400 text-sm line-clamp-2">{tournament.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <DollarSign size={16} className="text-emerald-400" />
                        <span>Prize: {tournament.prizePool}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Users size={16} className="text-blue-400" />
                        <span>{tournament.registeredTeams.length}/{tournament.totalSlots} Teams</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar size={16} className="text-amber-400" />
                        <span>Start: {new Date(tournament.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      {isRegistered ? (
                        <button disabled className="w-full py-3 bg-emerald-500/10 text-emerald-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-default border border-emerald-500/20">
                          <CheckCircle size={18} />
                          Registered
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleRegister(tournament.id)}
                          disabled={registering === tournament.id || isFull || tournament.status !== 'open'}
                          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {registering === tournament.id && <Loader2 size={18} className="animate-spin" />}
                          {isFull ? 'Slots Full' : 'Register Team'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
