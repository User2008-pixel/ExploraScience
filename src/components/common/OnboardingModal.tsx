import React, { useState } from 'react';
import { Compass, Sparkles, FlaskConical, Bot, Menu, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'home' | 'concepts' | 'practicals' | 'detective' | 'calculator' | 'progress' | 'mistakes' | 'settings') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [step, setStep] = useState(1);
  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to ScienceLab Virtual Laboratory',
      desc: 'An interactive Class 9–12 physics, chemistry, and biology learning environment where you explore scientific principles through real-time simulations and experiments.',
      icon: Compass,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      title: '1. Using the Navigation Menu (☰)',
      desc: 'Click the "Menu" button at the top-left to open the main navigation drawer. Access Explore Concepts, Science Detective, Math Graphing, Practical Labs, and Settings.',
      icon: Menu,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      title: '2. How Experiments Work',
      desc: 'Inside Practical Labs, you can manipulate variables using sliders, press "Run" to observe the simulation, and record your data points. The system tracks your changes in real-time.',
      icon: FlaskConical,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      title: '3. What Functions Are Available',
      desc: 'Use the Science Detective to apply concepts to real-world forensic cases, log observations in the Laboratory Notebook, and use the Math Grapher for complex calculations and visual modeling.',
      icon: Sparkles,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
    {
      title: '4. Dr. Nova AI & Data Persistence',
      desc: 'Whenever you have questions, click the glowing Dr. Nova AI icon at the top right for instant guidance. Your progress saves automatically to your account as you work.',
      icon: Bot,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    },
  ];

  const current = steps[step - 1];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#131E36] border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            Getting Started • Step {step} of {steps.length}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-mono p-1 rounded-lg hover:bg-slate-800 transition"
          >
            Skip Tour
          </button>
        </div>

        <div className="space-y-4 text-center">
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border ${current.color} shadow-lg`}>
            <Icon className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">{current.title}</h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">{current.desc}</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx + 1 === step ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < steps.length ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onNavigateTab('concepts');
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Start Exploring Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
