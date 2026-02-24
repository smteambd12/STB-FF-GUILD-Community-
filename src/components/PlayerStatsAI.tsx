import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, Loader2 } from 'lucide-react';

export default function PlayerStatsAI() {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        setAnalysis("Error: GEMINI_API_KEY not found.");
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Analyze these Free Fire player stats and provide a summary of their playstyle, strengths, and weaknesses.
        The response MUST be in ${language === 'bn' ? 'Bengali (Bangla)' : 'English'}.
        Stats: ${input}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setAnalysis(response.text || "No analysis generated.");
    } catch (error) {
      console.error("AI Error:", error);
      setAnalysis("Failed to analyze stats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-purple-400" />
        <h2 className="text-xl font-bold text-white">{t('player_stats')}</h2>
      </div>

      <textarea
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors h-32"
        placeholder="Paste player stats here (e.g., K/D: 4.5, Headshot: 60%, Matches: 500)..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !input.trim()}
        className="mt-4 flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
        {t('analyze')}
      </button>

      {analysis && (
        <div className="mt-6 p-4 bg-slate-950 rounded-xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Analysis Result</h3>
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {analysis}
          </p>
        </div>
      )}
    </div>
  );
}
