import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Gamepad2, Plus, Users, LogOut, Loader2 } from 'lucide-react';
import { getTeams, createTeam, joinTeam, leaveTeam } from '../services/teamService';
import { Team } from '../types';
import { motion } from 'motion/react';

export default function Teams() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setActionLoading(true);
    try {
      await createTeam(newTeamName, user.uid);
      await fetchTeams();
      setIsCreating(false);
      setNewTeamName('');
    } catch (error) {
      console.error("Failed to create team", error);
      alert("Failed to create team. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!user) {
      alert("Please login first.");
      return;
    }
    if (user.teamId) {
      alert("You are already in a team. Leave your current team first.");
      return;
    }

    setActionLoading(true);
    try {
      await joinTeam(teamId, user.uid);
      await fetchTeams();
      // Ideally refresh user context here too, but page reload works for now
      window.location.reload(); 
    } catch (error: any) {
      console.error("Failed to join team", error);
      alert(error.message || "Failed to join team.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    if (!user) return;
    
    if (!confirm("Are you sure you want to leave this team?")) return;

    setActionLoading(true);
    try {
      await leaveTeam(teamId, user.uid);
      await fetchTeams();
      window.location.reload();
    } catch (error) {
      console.error("Failed to leave team", error);
      alert("Failed to leave team.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Gamepad2 className="text-emerald-500" />
            {t('teams')}
          </h1>
          <p className="text-slate-400 mt-1">Join a squad or create your own to compete.</p>
        </div>
        
        {user && !user.teamId && (
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Create Team
          </button>
        )}
      </div>

      {isCreating && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-emerald-500/30 p-6 rounded-xl max-w-md"
        >
          <h3 className="text-lg font-bold text-white mb-4">Create New Squad</h3>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Team Name</label>
              <input 
                type="text" 
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none"
                placeholder="e.g. STB Alpha"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={actionLoading}
                className="px-4 py-2 bg-emerald-500 text-slate-900 font-bold rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                Create
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={40} className="text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-500">
              No teams found. Be the first to create one!
            </div>
          ) : (
            teams.map((team) => (
              <motion.div 
                key={team.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Gamepad2 size={100} />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                    <Users size={14} />
                    <span>{team.members.length} / 5 Members</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 border-t border-slate-800 pt-4">
                    <div className="flex -space-x-2">
                      {team.members.map((m, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-500">
                          U
                        </div>
                      ))}
                    </div>
                    
                    {user?.teamId === team.id ? (
                      <button 
                        onClick={() => handleLeaveTeam(team.id)}
                        disabled={actionLoading}
                        className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1"
                      >
                        <LogOut size={14} /> Leave
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleJoinTeam(team.id)}
                        disabled={actionLoading || team.members.length >= 5}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-900 text-emerald-400 text-sm font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {team.members.length >= 5 ? 'Full' : 'Join'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
