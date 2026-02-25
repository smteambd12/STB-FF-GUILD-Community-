import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, Search, Shield, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';
import { motion } from 'motion/react';

export default function Members() {
  const { t } = useLanguage();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      if (!db) {
        // Mock data
        setMembers([
          { uid: '1', displayName: 'STB_King', email: '', role: 'super_admin', createdAt: Date.now() },
          { uid: '2', displayName: 'STB_Sniper', email: '', role: 'sub_admin', createdAt: Date.now() },
          { uid: '3', displayName: 'STB_Rusher', email: '', role: 'member', createdAt: Date.now() },
        ]);
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const data = querySnapshot.docs.map(doc => doc.data() as UserProfile);
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch members", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m => 
    m.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="text-blue-500" />
          {t('members')}
        </h1>
        
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:border-blue-500 outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={40} className="text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <motion.div 
              key={member.uid}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-blue-500/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700 overflow-hidden">
                {member.photoURL ? (
                  <img src={member.photoURL} alt={member.displayName} className="w-full h-full object-cover" />
                ) : (
                  member.displayName[0] || 'U'
                )}
              </div>
              <div>
                <h3 className="font-bold text-white">{member.displayName}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <Shield size={12} className={
                    member.role === 'super_admin' ? 'text-red-500' :
                    member.role === 'sub_admin' ? 'text-orange-500' :
                    member.role === 'team_admin' ? 'text-emerald-500' :
                    'text-slate-500'
                  } />
                  <span className="capitalize">{member.role.replace('_', ' ')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
