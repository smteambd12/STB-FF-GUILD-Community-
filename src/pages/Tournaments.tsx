import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Trophy } from 'lucide-react';

export default function Tournaments() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <Trophy className="text-amber-500" />
        {t('tournaments')}
      </h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
        <p>Tournament slots and registration will appear here.</p>
      </div>
    </div>
  );
}
