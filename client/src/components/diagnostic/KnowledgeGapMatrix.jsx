import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert,
  Brain,
  Zap,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { Card } from '../common/Card.jsx';
import { Button } from '../common/Button.jsx';

export const KnowledgeGapMatrix = ({
  conceptMatrix = [],
  remediations = [],
  onLaunchRemediation
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Mastered':
        return {
          bg: 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-400',
          badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40',
          icon: CheckCircle2,
          glow: 'emerald',
          label: 'Mastered (> 75%)'
        };
      case 'Developing':
        return {
          bg: 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-400',
          badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40',
          icon: AlertTriangle,
          glow: 'amber',
          label: 'Developing (51% - 75%)'
        };
      case 'Critical Deficit':
      default:
        return {
          bg: 'bg-rose-50/70 dark:bg-rose-950/25 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-400',
          badge: 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/50 animate-pulse',
          icon: XCircle,
          glow: 'rose',
          label: 'Critical Deficit (<= 50%)'
        };
    }
  };

  const getErrorTypeBadge = (errorType) => {
    if (!errorType) return null;
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
        <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" />
        <span>Error Type: {errorType}</span>
      </span>
    );
  };

  // Find linked remediation session for this micro-concept
  const findRemediationId = (conceptName) => {
    const session = remediations.find((r) => r.micro_concept === conceptName);
    return session ? session.id : null;
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Matrix Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 font-display">
            <Brain className="w-5 h-5 text-cyan-400" />
            Cognitive Knowledge-Gap Isolation Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Performance mathematically deconstructed down to micro-concept failure boundaries.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Mastered
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Developing
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" /> Critical Gap
          </span>
        </div>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {conceptMatrix.map((item, idx) => {
          const config = getStatusConfig(item.status);
          const Icon = config.icon;
          const isCritical = item.status === 'Critical Deficit';
          const remediationId = findRemediationId(item.micro_concept);

          return (
            <Card
              key={idx}
              className={`p-6 flex flex-col justify-between border ${config.bg} transition-all duration-300 hover:scale-[1.01] shadow-xl`}
            >
              <div className="space-y-4">
                {/* Header with status badge & score */}
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${config.badge}`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {config.label}
                  </span>
                  <span className="font-mono text-xl font-black text-white">
                    {item.accuracy}%
                  </span>
                </div>

                {/* Micro Concept Title */}
                <div>
                  <h4 className="text-base font-bold text-white leading-snug font-display">
                    {item.micro_concept}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Diagnostic Score: <strong className="text-white">{item.correctCount}</strong> of <strong className="text-white">{item.totalTested}</strong> correct
                  </p>
                </div>

                {/* Cognitive Error Tag if critical deficit */}
                {isCritical && item.primaryErrorType && (
                  <div className="pt-0.5">
                    {getErrorTypeBadge(item.primaryErrorType)}
                  </div>
                )}

                {/* Missed Rationale Snippet */}
                {isCritical && item.missedQuestions && item.missedQuestions.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-surface-950/80 border border-white/[0.08] text-xs space-y-1.5">
                    <p className="font-bold text-rose-300 text-[10px] uppercase tracking-wider font-mono flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-rose-400" />
                      Root Cognitive Failure Trap:
                    </p>
                    <p className="text-[11px] text-slate-300 italic leading-relaxed">
                      "{item.missedQuestions[0]?.distractorRationale || 'Fundamental misunderstanding of boundary conditions.'}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-white/[0.08]">
                {isCritical ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onLaunchRemediation(remediationId || item.micro_concept)}
                    icon={Zap}
                    className="w-full text-xs font-bold shadow-glow-rose py-2.5"
                  >
                    Repair Deficit (Launch 3-Tier)
                  </Button>
                ) : item.status === 'Developing' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onLaunchRemediation(remediationId || item.micro_concept)}
                    iconRight={ArrowRight}
                    className="w-full text-xs py-2.5"
                  >
                    Review Developing Concept
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mastery Verified & Logged</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
