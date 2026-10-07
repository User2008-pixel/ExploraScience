import React from 'react';
import { Trophy, Users } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  credits: number;
  streak: number;
}

const DUMMY_DATA: LeaderboardEntry[] = [
  { id: '1', name: 'Marie Curie', avatar: '👩‍🔬', credits: 15420, streak: 42 },
  { id: '2', name: 'Isaac Newton', avatar: '👨‍🔬', credits: 14890, streak: 35 },
  { id: '3', name: 'Albert Einstein', avatar: '⚛️', credits: 13200, streak: 28 },
  { id: '4', name: 'You (Explorer)', avatar: '🔬', credits: 11500, streak: 12 },
  { id: '5', name: 'Ada Lovelace', avatar: '💻', credits: 9800, streak: 15 },
];

export const Leaderboard: React.FC = () => {
  return (
    <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-amber-400" />
        <h3 className="text-base font-bold text-white">Global Science Leaderboard</h3>
      </div>
      
      <div className="space-y-2">
        {DUMMY_DATA.map((entry, index) => (
          <div 
            key={entry.id}
            className={`flex items-center justify-between p-3 rounded-xl border ${
              index < 3 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{entry.avatar}</span>
              <span className={`text-sm font-semibold ${index < 3 ? 'text-amber-100' : 'text-slate-300'}`}>
                {entry.name}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-400">{entry.credits.toLocaleString()} ⚛️</span>
              <span className="text-cyan-400">{entry.streak} 🔥</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
