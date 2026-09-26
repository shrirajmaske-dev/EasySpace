import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Lightbulb, 
  Split, 
  Award,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { remediationApi } from '../api/remediation.js';
import { useMasteryStore } from '../store/useMasteryStore.js';
import { RemediationTier1View } from '../components/remediation/RemediationTier1View.jsx';
import { RemediationTier2View } from '../components/remediation/RemediationTier2View.jsx';
import { RemediationTier3Drill } from '../components/remediation/RemediationTier3Drill.jsx';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';

export const RemediationPage = () => {
  const { remediationId } = useParams();
  const navigate = useNavigate();

  const { activeRemediation, setActiveRemediation } = useMasteryStore();
  const [remediation, setRemediation] = useState(activeRemediation);
  const [loading, setLoading] = useState(!activeRemediation || activeRemediation.id !== remediationId);
  const [activeTier, setActiveTier] = useState(1); // 1 | 2 | 3
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const data = await remediationApi.getRemediationById(remediationId);
        setRemediation(data.remediation);
        setActiveRemediation(data.remediation);
      } catch (err) {
        console.error('[Remediation Fetch Error]:', err);
        setErrorMsg('Failed to load remediation module.');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [remediationId]);

  const handleVerify = async (drillAnswers) => {
    setIsVerifying(true);
    try {
      const response = await remediationApi.verifyRemediation({
        remediationId,
        answers: drillAnswers
      });
      setVerificationResult(response.verification);
      return response.verification;
    } catch (err) {
      console.error('[Verify Drill Error]:', err);
      setErrorMsg('Failed to verify drill submission.');
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFinish = () => {
    navigate('/mastery');
  };

  if (loading || !remediation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto animate-spin shadow-glow-cyan">
          <Sparkles className="w-7 h-7" />
        </div>
        <p className="text-sm text-slate-300 font-mono">Generating Closed-Loop Adaptive Remediation Modules...</p>
      </div>
    );
  }

  const tiers = [
    { num: 1, name: 'Mental Model', full: 'Intuitive Foundation', icon: Lightbulb },
    { num: 2, name: 'Discrimination', full: 'Misconception Buster', icon: Split },
    { num: 3, name: 'Application', full: 'Verification Drill', icon: Award }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" />
              Closed-Loop Adaptive Remediation
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-300 font-semibold">{remediation.topic}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            {remediation.micro_concept}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/mastery')}
            icon={BarChart3}
          >
            Mastery Ledger
          </Button>
        </div>
      </div>

      {/* 3-Tier Stepper Progress Bar */}
      <div className="p-2 sm:p-3 rounded-2xl bg-surface-950/80 border border-white/[0.08] grid grid-cols-3 gap-2">
        {tiers.map((t) => {
          const Icon = t.icon;
          const isActive = activeTier === t.num;
          const isPassed = activeTier > t.num || (verificationResult?.passed && t.num === 3);

          return (
            <button
              key={t.num}
              onClick={() => setActiveTier(t.num)}
              className={`p-3 rounded-xl flex items-center justify-center sm:justify-start gap-3 transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 border border-cyan-400 text-white shadow-glow-cyan/20'
                  : isPassed
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-surface-900/50 border border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950'
                    : isPassed
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-surface-850 text-slate-400'
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-4 h-4" /> : `0${t.num}`}
              </div>

              <div className="hidden sm:block text-left">
                <span className="text-[10px] uppercase font-mono block text-slate-400">
                  {t.name}
                </span>
                <span className="text-xs font-bold leading-tight block">
                  {t.full}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Active Tier Content */}
      <div className="animate-in fade-in duration-200">
        {activeTier === 1 && (
          <div className="space-y-6">
            <RemediationTier1View
              foundation={remediation.tier1_foundation}
              topic={remediation.topic}
              microConcept={remediation.micro_concept}
            />

            <div className="flex justify-end pt-4 border-t border-white/[0.08]">
              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveTier(2)}
                iconRight={ChevronRight}
                className="shadow-glow-cyan"
              >
                Proceed to Tier 2: Misconception Buster
              </Button>
            </div>
          </div>
        )}

        {activeTier === 2 && (
          <div className="space-y-6">
            <RemediationTier2View
              discrimination={remediation.tier2_discrimination}
            />

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setActiveTier(1)}
              >
                Back to Tier 1
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveTier(3)}
                iconRight={ChevronRight}
                className="shadow-glow-cyan"
              >
                Proceed to Tier 3: Verification Drill
              </Button>
            </div>
          </div>
        )}

        {activeTier === 3 && (
          <div className="space-y-6">
            <RemediationTier3Drill
              drills={remediation.tier3_drill}
              baselineScore={40}
              onVerify={handleVerify}
              isVerifying={isVerifying}
              verificationResult={verificationResult}
              onFinish={handleFinish}
            />
          </div>
        )}
      </div>

    </div>
  );
};
