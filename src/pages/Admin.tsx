import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { UserProfile, Role, Tournament } from '../types';
import { Shield, ShieldAlert, ShieldCheck, User, Key, Save, Plus, Trash2, Trophy, Users, Edit2 } from 'lucide-react';
import PlayerStatsAI from '../components/PlayerStatsAI';
import { getAccessCodes, updateAccessCodes, AccessCodes } from '../services/adminService';
import { getPlayers, addPlayer, updatePlayer, deletePlayer, PlayerStats } from '../services/playerService';
import { getTournaments, createTournament, deleteTournament } from '../services/tournamentService';

export default function Admin() {
  const { user, isAdmin, isSuperAdmin, accessLevel } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Access Codes State
  const [codes, setCodes] = useState<AccessCodes>({ super_admin: '', sub_admin: '', editor: '' });
  const [codeLoading, setCodeLoading] = useState(false);

  // New Player Form
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState<Omit<PlayerStats, 'id'>>({
    name: '', role: 'Member', level: 60, rank: 'Heroic', kd: '3.0', hs: '40%', winRate: '30%', matches: '1K'
  });

  // New Tournament Form
  const [showTourneyForm, setShowTourneyForm] = useState(false);
  const [newTourney, setNewTourney] = useState<Omit<Tournament, 'id' | 'registeredTeams'>>({
    title: '', description: '', totalSlots: 48, entryFee: 0, prizePool: '10K BDT', startDate: Date.now(), status: 'open'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (db) {
        const [usersSnap, playersData, tourneyData] = await Promise.all([
          getDocs(collection(db, 'users')),
          getPlayers(),
          getTournaments()
        ]);
        
        setUsers(usersSnap.docs.map(doc => doc.data() as UserProfile));
        setPlayers(playersData);
        setTournaments(tourneyData);
        
        if (isSuperAdmin) {
          const fetchedCodes = await getAccessCodes();
          setCodes(fetchedCodes);
        }
      } else {
        // Mock data logic... (omitted for brevity, assume DB exists)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, isSuperAdmin]);

  const handleRoleChange = async (targetUid: string, newRole: Role) => {
    if (!isSuperAdmin) return;
    if (db) {
      try {
        await updateDoc(doc(db, 'users', targetUid), { role: newRole });
        setUsers(users.map(u => u.uid === targetUid ? { ...u, role: newRole } : u));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSaveCodes = async () => {
    if (!isSuperAdmin) return;
    setCodeLoading(true);
    try {
      await updateAccessCodes(codes);
      alert("Access codes updated!");
    } catch (error) {
      console.error(error);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPlayer(newPlayer);
      setShowPlayerForm(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePlayer = async (id: string) => {
    if (confirm("Delete player?")) {
      try {
        await deletePlayer(id);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAddTourney = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTournament(newTourney);
      setShowTourneyForm(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTourney = async (id: string) => {
    if (confirm("Delete tournament?")) {
      try {
        await deleteTournament(id);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <ShieldAlert size={48} className="mr-4" />
        <h1 className="text-2xl font-bold">{t('no_access')}</h1>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShieldCheck className="text-emerald-500" />
          {t('admin_panel')}
        </h1>
        <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-emerald-400 border border-emerald-500/30">
          Access Level: {accessLevel?.toUpperCase()}
        </span>
      </div>

      {/* Access Code Management */}
      {isSuperAdmin && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Key className="text-amber-500" />
            <h2 className="text-xl font-bold text-white">Access Code Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(codes).map((role) => (
              <div key={role}>
                <label className="block text-xs text-slate-500 uppercase mb-2">{role.replace('_', ' ')} Code</label>
                <input 
                  type="text" 
                  value={(codes as any)[role]}
                  onChange={(e) => setCodes({...codes, [role]: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white font-mono"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleSaveCodes} disabled={codeLoading} className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-lg transition-colors disabled:opacity-50">
              <Save size={18} /> Save Codes
            </button>
          </div>
        </div>
      )}

      {/* Player Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-500">
            <Users size={24} />
            <h2 className="text-xl font-bold text-white">Guild Roster Management</h2>
          </div>
          <button onClick={() => setShowPlayerForm(!showPlayerForm)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm font-bold">
            <Plus size={18} /> Add Player
          </button>
        </div>

        {showPlayerForm && (
          <form onSubmit={handleAddPlayer} className="p-6 bg-slate-950 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
            <input placeholder="IGN" value={newPlayer.name} onChange={e => setNewPlayer({...newPlayer, name: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" required />
            <input placeholder="Role" value={newPlayer.role} onChange={e => setNewPlayer({...newPlayer, role: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
            <input placeholder="Level" type="number" value={newPlayer.level} onChange={e => setNewPlayer({...newPlayer, level: parseInt(e.target.value)})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
            <input placeholder="Rank" value={newPlayer.rank} onChange={e => setNewPlayer({...newPlayer, rank: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
            <input placeholder="K/D" value={newPlayer.kd} onChange={e => setNewPlayer({...newPlayer, kd: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
            <input placeholder="HS%" value={newPlayer.hs} onChange={e => setNewPlayer({...newPlayer, hs: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
            <input placeholder="Win Rate" value={newPlayer.winRate} onChange={e => setNewPlayer({...newPlayer, winRate: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
            <button type="submit" className="bg-emerald-500 text-slate-900 font-bold rounded">Save Player</button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
              <tr>
                <th className="p-4">Player</th>
                <th className="p-4">Rank</th>
                <th className="p-4">Stats</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {players.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.role} • Lvl {p.level}</div>
                  </td>
                  <td className="p-4 text-emerald-400 font-bold">{p.rank}</td>
                  <td className="p-4 text-xs text-slate-400">
                    K/D: {p.kd} | HS: {p.hs} | Win: {p.winRate}
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDeletePlayer(p.id!)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tournament Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-amber-500">
            <Trophy size={24} />
            <h2 className="text-xl font-bold text-white">Tournament Management</h2>
          </div>
          <button onClick={() => setShowTourneyForm(!showTourneyForm)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg flex items-center gap-2 text-sm font-bold">
            <Plus size={18} /> New Tournament
          </button>
        </div>

        {showTourneyForm && (
          <form onSubmit={handleAddTourney} className="p-6 bg-slate-950 border-b border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" value={newTourney.title} onChange={e => setNewTourney({...newTourney, title: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" required />
            <input placeholder="Prize Pool" value={newTourney.prizePool} onChange={e => setNewTourney({...newTourney, prizePool: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
            <textarea placeholder="Description" value={newTourney.description} onChange={e => setNewTourney({...newTourney, description: e.target.value})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white col-span-full" />
            <input placeholder="Total Slots" type="number" value={newTourney.totalSlots} onChange={e => setNewTourney({...newTourney, totalSlots: parseInt(e.target.value)})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
            <select value={newTourney.status} onChange={e => setNewTourney({...newTourney, status: e.target.value as any})} className="bg-slate-900 border border-slate-800 rounded p-2 text-white">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit" className="bg-amber-500 text-slate-900 font-bold rounded col-span-full py-2">Create Tournament</button>
          </form>
        )}

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.map(t => (
            <div key={t.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
              <div>
                <div className="font-bold text-white">{t.title}</div>
                <div className="text-xs text-slate-500">{t.status.toUpperCase()} • {t.registeredTeams.length}/{t.totalSlots} Teams</div>
              </div>
              <button onClick={() => handleDeleteTourney(t.id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>

      <PlayerStatsAI />

      {/* User Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">User Role Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <User size={16} className="text-slate-400" />
                    </div>
                    <span className="font-medium text-white">{u.displayName}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      u.role === 'super_admin' ? 'bg-red-500/10 text-red-400' :
                      u.role === 'sub_admin' ? 'bg-orange-500/10 text-orange-400' :
                      u.role === 'editor' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    {isSuperAdmin && u.role !== 'super_admin' && (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.uid, e.target.value as Role)}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="member">Member</option>
                        <option value="team_admin">Team Admin</option>
                        <option value="editor">Editor</option>
                        <option value="sub_admin">Sub Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
