import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Gamepad2 } from 'lucide-react';

export default function Teams() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <Gamepad2 className="text-emerald-500" />
        {t('teams')}
      </h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
        <p>Team management panel will appear here.</p>
      </div>
    </div>
  );
}
