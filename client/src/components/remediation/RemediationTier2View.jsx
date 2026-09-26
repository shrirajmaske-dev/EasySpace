import React from 'react';
import { Split, XCircle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { Card } from '../common/Card.jsx';

export const RemediationTier2View = ({ discrimination }) => {
  if (!discrimination) return null;

  return (
    <div className="space-y-6">
      
      {/* Tier Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-mono font-black text-sm shadow-inner">
          T2
        </div>
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
            Tier 2: Conceptual Discrimination
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            Root Misconception Buster & Contrast Matrix
          </h3>
        </div>
      </div>

      {/* Primary Misconception vs Invariant Rule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identified Cognitive Trap */}
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-2.5 shadow-glow-rose/10">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider font-mono">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Identified Undergraduate Cognitive Trap</span>
          </div>
          <p className="text-sm text-rose-100 font-medium leading-relaxed">
            {discrimination.misconception}
          </p>
        </div>

        {/* Corrective Invariant Principle */}
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5 shadow-glow-emerald/10">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Resolving Physical / Algorithmic Principle</span>
          </div>
          <p className="text-sm text-emerald-100 font-medium leading-relaxed">
            {discrimination.corrective_rule}
          </p>
        </div>
      </div>

      {/* Contrast Table (Faulty Belief vs Scientific Reality) */}
      <Card className="p-6 sm:p-8 space-y-4 border-white/[0.08] shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 font-display">
            <Split className="w-4 h-4 text-cyan-400" />
            Side-by-Side Cognitive Discrimination Matrix
          </h4>
          <span className="text-xs font-mono text-slate-400">
            Intuitive Traps vs Rigorous Mechanics
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                <th className="py-3 px-4 w-1/2 text-rose-400">Faulty Student Intuition</th>
                <th className="py-3 px-4 w-1/2 text-emerald-400">Scientific / Mathematical Reality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {(discrimination.contrast_table || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 text-slate-300 align-top leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0 shadow-glow-rose" />
                      <span>{row.faulty_belief}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-200 align-top font-medium leading-relaxed bg-emerald-500/5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-glow-emerald" />
                      <span>{row.scientific_reality}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
