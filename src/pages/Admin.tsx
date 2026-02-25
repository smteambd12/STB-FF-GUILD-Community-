import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { UserProfile, Role } from '../types';
import { Shield, ShieldAlert, ShieldCheck, User, Key, Save } from 'lucide-react';
import PlayerStatsAI from '../components/PlayerStatsAI';
import { getAccessCodes, updateAccessCodes, AccessCodes } from '../services/adminService';

export default function Admin() {
  const { user, isAdmin, isSuperAdmin, accessLevel } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Access Codes State
  const [codes, setCodes] = useState<AccessCodes>({ super_admin: '', sub_admin: '', editor: '' });
  const [codeLoading, setCodeLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        // Mock data
        setUsers([
          { uid: '1', displayName: 'Admin User', email: 'admin@stb.com', role: 'super_admin', createdAt: Date.now() },
          { uid: '2', displayName: 'Sub Admin User', email: 'sub@stb.com', role: 'sub_admin', createdAt: Date.now() },
          { uid: '3', displayName: 'Editor User', email: 'editor@stb.com', role: 'editor', createdAt: Date.now() },
          { uid: '4', displayName: 'Member User', email: 'member@stb.com', role: 'member', createdAt: Date.now() },
        ]);
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => doc.data() as UserProfile);
        setUsers(usersData);
        
        if (isSuperAdmin) {
          const fetchedCodes = await getAccessCodes();
          setCodes(fetchedCodes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data if fetch fails (e.g. permission denied)
        setUsers([
          { uid: '1', displayName: 'Admin User', email: 'admin@stb.com', role: 'super_admin', createdAt: Date.now() },
          { uid: '2', displayName: 'Sub Admin User', email: 'sub@stb.com', role: 'sub_admin', createdAt: Date.now() },
          { uid: '3', displayName: 'Editor User', email: 'editor@stb.com', role: 'editor', createdAt: Date.now() },
          { uid: '4', displayName: 'Member User', email: 'member@stb.com', role: 'member', createdAt: Date.now() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, isSuperAdmin]);

  const handleRoleChange = async (targetUid: string, newRole: Role) => {
    if (!isSuperAdmin) {
      alert("Only Super Admin can change roles.");
      return;
    }

    // Optimistic update
    setUsers(users.map(u => u.uid === targetUid ? { ...u, role: newRole } : u));

    if (db) {
      try {
        await updateDoc(doc(db, 'users', targetUid), { role: newRole });
      } catch (error) {
        console.error("Error updating role:", error);
        alert("Failed to update role in database.");
      }
    }
  };

  const handleSaveCodes = async () => {
    if (!isSuperAdmin) return;
    setCodeLoading(true);
    try {
      await updateAccessCodes(codes);
      alert("Access codes updated successfully!");
    } catch (error) {
      console.error("Failed to update codes", error);
      alert("Failed to update codes.");
    } finally {
      setCodeLoading(false);
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShieldCheck className="text-emerald-500" />
          {t('admin_panel')}
        </h1>
        <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-emerald-400 border border-emerald-500/30">
          Access Level: {accessLevel?.toUpperCase()}
        </span>
      </div>

      {/* Access Code Management - Super Admin Only */}
      {isSuperAdmin && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Key className="text-amber-500" />
            <h2 className="text-xl font-bold text-white">Access Code Management</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">Super Admin Code</label>
              <input 
                type="text" 
                value={codes.super_admin}
                onChange={(e) => setCodes({...codes, super_admin: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">Sub Admin Code</label>
              <input 
                type="text" 
                value={codes.sub_admin}
                onChange={(e) => setCodes({...codes, sub_admin: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">Editor Code</label>
              <input 
                type="text" 
                value={codes.editor}
                onChange={(e) => setCodes({...codes, editor: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white font-mono"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSaveCodes}
              disabled={codeLoading}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              Save Codes
            </button>
          </div>
        </div>
      )}

      <PlayerStatsAI />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">User Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
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
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
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
