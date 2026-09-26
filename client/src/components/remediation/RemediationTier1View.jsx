import React from 'react';
import { Lightbulb, Code2, PlayCircle, Bookmark, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card.jsx';

export const RemediationTier1View = ({ foundation, topic, microConcept }) => {
  if (!foundation) return null;

  return (
    <div className="space-y-6">
      
      {/* Tier Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-black text-sm shadow-inner">
          T1
        </div>
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Tier 1: Intuitive Mental Model
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            Axiomatic Foundation & Physical Intuition
          </h3>
        </div>
      </div>

      {/* Mental Model Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-cyan-950/20 via-surface-900 to-surface-950 border border-cyan-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider font-mono">
          <Lightbulb className="w-4 h-4 text-cyan-400" />
          <span>Core Intuitive Mental Model</span>
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
          {foundation.mental_model}
        </p>
      </Card>

      {/* Governing Formula / Rule Box */}
      <div className="p-6 rounded-3xl bg-surface-950/90 border border-white/[0.08] space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">
          <Code2 className="w-4 h-4 text-brand-400" />
          <span>Governing Equation & Conservation Invariant</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface-900/90 border border-cyan-500/25 font-mono text-sm sm:text-base font-bold text-cyan-300 overflow-x-auto shadow-inner">
          {foundation.core_formula}
        </div>
      </div>

      {/* Recommended Video Timestamp Hint */}
      {foundation.timestamp_hint && (
        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs shadow-sm">
          <PlayCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5 font-display text-sm">Recommended Lecture Timestamp:</span>
            <span className="leading-relaxed">{foundation.timestamp_hint}</span>
          </div>
        </div>
      )}

    </div>
  );
};
