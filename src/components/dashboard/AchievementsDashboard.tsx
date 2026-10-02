import React, { useState } from 'react';
import { StudentProgress, BadgeCategory, AchievementBadge, BadgeTier } from '../../types/science';
import {
  ACHIEVEMENT_BADGES,
  calculateStudentXP,
  calculateStudentRank,
  STUDENT_RANKS,
} from '../../data/achievementsData';
import {
  Award,
  Trophy,
  Compass,
  Search,
  Brain,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  Flame,
  Target,
  Beaker,
  Dna,
  Globe,
  Activity,
  Shield,
  Lightbulb,
  X,
  Filter,
} from 'lucide-react';

interface AchievementsDashboardProps {
  progress: StudentProgress;
  onExploreMore?: () => void;
  onStartInvestigation?: () => void;
}

export const AchievementsDashboard: React.FC<AchievementsDashboardProps> = ({
  progress,
  onExploreMore,
  onStartInvestigation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  const totalXP = calculateStudentXP(progress);
  const { currentRank, nextRank, progressPercent } = calculateStudentRank(totalXP);

  // Unlocked counts
  const unlockedBadges = ACHIEVEMENT_BADGES.filter((b) => b.isUnlocked(progress));
  const unlockedCount = unlockedBadges.length;
  const totalBadges = ACHIEVEMENT_BADGES.length;

  const bronzeCount = unlockedBadges.filter((b) => b.tier === 'bronze').length;
  const silverCount = unlockedBadges.filter((b) => b.tier === 'silver').length;
  const goldCount = unlockedBadges.filter((b) => b.tier === 'gold').length;
  const platinumCount = unlockedBadges.filter((b) => b.tier === 'platinum').length;

  // Filtered badges
  const filteredBadges = ACHIEVEMENT_BADGES.filter((badge) => {
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory;
    const isUnlocked = badge.isUnlocked(progress);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unlocked' && isUnlocked) ||
      (statusFilter === 'locked' && !isUnlocked);

    return matchesCategory && matchesStatus;
  });

  const getBadgeIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Compass':
        return <Compass className={className} />;
      case 'Search':
        return <Search className={className} />;
      case 'Brain':
        return <Brain className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Beaker':
        return <Beaker className={className} />;
      case 'Dna':
        return <Dna className={className} />;
      case 'Globe':
        return <Globe className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Lightbulb':
        return <Lightbulb className={className} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={className} />;
      case 'Sparkles':
      default:
        return <Sparkles className={className} />;
    }
  };

  const getTierStyles = (tier: BadgeTier, unlocked: boolean) => {
    if (!unlocked) {
      return {
        badgeBg: 'bg-slate-900/60 border-slate-800 text-slate-500',
        cardBorder: 'border-slate-800/80 hover:border-slate-700',
        badgeGlow: '',
        pill: 'bg-slate-800 text-slate-400',
        iconBg: 'bg-slate-800/50 text-slate-500',
      };
    }

    switch (tier) {
      case 'platinum':
        return {
          badgeBg: 'bg-gradient-to-br from-cyan-950/80 to-purple-950/80 border-cyan-400/40 text-cyan-300',
          cardBorder: 'border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
          badgeGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
          pill: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
          iconBg: 'bg-cyan-500/20 text-cyan-300',
        };
      case 'gold':
        return {
          badgeBg: 'bg-gradient-to-br from-amber-950/70 to-yellow-950/70 border-amber-400/50 text-amber-300',
          cardBorder: 'border-amber-500/40 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
          badgeGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
          pill: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
          iconBg: 'bg-amber-500/20 text-amber-300',
        };
      case 'silver':
        return {
          badgeBg: 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-400/40 text-slate-200',
          cardBorder: 'border-slate-500/40 hover:border-slate-400 shadow-[0_0_15px_rgba(203,213,225,0.1)]',
          badgeGlow: '',
          pill: 'bg-slate-400/20 text-slate-200 border border-slate-400/30',
          iconBg: 'bg-slate-700/60 text-slate-200',
        };
      case 'bronze':
      default:
        return {
          badgeBg: 'bg-gradient-to-br from-amber-950/40 to-orange-950/40 border-amber-700/40 text-amber-400',
          cardBorder: 'border-amber-700/30 hover:border-amber-600/50',
          badgeGlow: '',
          pill: 'bg-amber-700/20 text-amber-400 border border-amber-700/30',
          iconBg: 'bg-amber-900/30 text-amber-400',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Scientific Rank & XP Banner */}
      <div className="bg-gradient-to-r from-[#111c38] via-[#152347] to-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Level {currentRank.level} Scientific Rank
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {totalXP} Scientific XP
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {currentRank.title}
              <span className="text-sm font-normal text-slate-400 block sm:inline">
                ({currentRank.description})
              </span>
            </h2>

            {/* Next Rank Progress Bar */}
            {nextRank ? (
              <div className="pt-2 max-w-xl">
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Next Rank: <strong className="text-cyan-400">{nextRank.title}</strong></span>
                  <span>{progressPercent}% towards Level {nextRank.level} ({nextRank.minXP - totalXP} XP left)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs text-amber-300 font-mono">
                ★ Maximum Scientific Honor Achieved (Nobel Laureate Scholar)
              </div>
            )}
          </div>

          {/* Badge Breakdown Tiers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-center px-2 py-1">
              <span className="text-[10px] uppercase font-mono text-cyan-300 block">Platinum</span>
              <span className="text-lg font-bold text-white font-mono">{platinumCount}</span>
            </div>
            <div className="text-center px-2 py-1">
              <span className="text-[10px] uppercase font-mono text-amber-300 block">Gold</span>
              <span className="text-lg font-bold text-white font-mono">{goldCount}</span>
            </div>
            <div className="text-center px-2 py-1">
              <span className="text-[10px] uppercase font-mono text-slate-300 block">Silver</span>
              <span className="text-lg font-bold text-white font-mono">{silverCount}</span>
            </div>
            <div className="text-center px-2 py-1">
              <span className="text-[10px] uppercase font-mono text-amber-500 block">Bronze</span>
              <span className="text-lg font-bold text-white font-mono">{bronzeCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Honors' },
            { id: 'exploration', label: 'Exploration' },
            { id: 'investigation', label: 'Investigation' },
            { id: 'accuracy', label: 'Scientific Rigor' },
            { id: 'streak', label: 'Streak & Habits' },
            { id: 'mastery', label: 'Mastery' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All ({totalBadges})</option>
            <option value="unlocked">Unlocked ({unlockedCount})</option>
            <option value="locked">In Progress / Locked ({totalBadges - unlockedCount})</option>
          </select>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const unlocked = badge.isUnlocked(progress);
          const currentProg = badge.currentProgress(progress);
          const maxProg = badge.maxProgress;
          const pct = Math.min(100, Math.round((currentProg / maxProg) * 100));
          const styles = getTierStyles(badge.tier, unlocked);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-[#131E36]/90 flex flex-col justify-between ${styles.cardBorder} ${
                unlocked ? 'hover:scale-[1.01]' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${styles.badgeBg} ${styles.badgeGlow}`}
                  >
                    {unlocked ? getBadgeIcon(badge.iconName) : <Lock className="w-5 h-5 text-slate-500" />}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${styles.pill}`}>
                      {badge.tier}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      +{badge.xpPoints} XP
                    </span>
                  </div>
                </div>

                <h3 className={`text-base font-bold ${unlocked ? 'text-white' : 'text-slate-400'}`}>
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress & Condition Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-slate-400 truncate max-w-[190px]">
                    {badge.conditionDescription}
                  </span>
                  <span className={unlocked ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {unlocked ? 'UNLOCKED' : `${currentProg}/${maxProg}`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      unlocked
                        ? 'bg-emerald-400'
                        : 'bg-cyan-500/60'
                    }`}
                    style={{ width: `${unlocked ? 100 : pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-sm">
          No badges found matching your filter criteria. Try choosing "All Honors" or switching the filter.
        </div>
      )}

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131E36] border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const unlocked = selectedBadge.isUnlocked(progress);
              const styles = getTierStyles(selectedBadge.tier, unlocked);
              const currentProg = selectedBadge.currentProgress(progress);
              const maxProg = selectedBadge.maxProgress;

              return (
                <>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${styles.badgeBg} ${styles.badgeGlow}`}
                    >
                      {unlocked ? getBadgeIcon(selectedBadge.iconName, 'w-8 h-8') : <Lock className="w-7 h-7 text-slate-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${styles.pill}`}>
                          {selectedBadge.tier} Tier
                        </span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          +{selectedBadge.xpPoints} XP
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{selectedBadge.title}</h3>
                      <span className="text-xs text-slate-400 capitalize">{selectedBadge.category} Achievement</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <span className="text-slate-400 font-semibold block">Scientific Lore & Meaning:</span>
                    <p className="text-slate-300 leading-relaxed">{selectedBadge.description}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-mono text-slate-400">
                      <span>Requirement:</span>
                      <span className="text-white font-semibold">{selectedBadge.conditionDescription}</span>
                    </div>
                    <div className="flex justify-between font-mono text-slate-400">
                      <span>Progress:</span>
                      <span className={unlocked ? 'text-emerald-400 font-bold' : 'text-cyan-400'}>
                        {unlocked ? 'Completed (100%)' : `${currentProg} / ${maxProg} (${Math.round((currentProg / maxProg) * 100)}%)`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                    {!unlocked && selectedBadge.category === 'exploration' && onExploreMore && (
                      <button
                        onClick={() => {
                          setSelectedBadge(null);
                          onExploreMore();
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition"
                      >
                        Explore Concepts Now
                      </button>
                    )}
                    {!unlocked && selectedBadge.category === 'investigation' && onStartInvestigation && (
                      <button
                        onClick={() => {
                          setSelectedBadge(null);
                          onStartInvestigation();
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition"
                      >
                        Investigate Cases Now
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedBadge(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
