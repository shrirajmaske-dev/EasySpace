import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowUpRight, 
  HelpCircle, 
  Award,
  RefreshCw,
  TrendingUp,
  Check,
  ArrowRight
} from 'lucide-react';
import { Card } from '../common/Card.jsx';
import { Button } from '../common/Button.jsx';

export const RemediationTier3Drill = ({
  drills = [],
  baselineScore = 0,
  onVerify,
  isVerifying = false,
  verificationResult = null,
  onFinish
}) => {
  const [drillAnswers, setDrillAnswers] = useState({});
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (verificationResult) return; // Locked after submission
    setDrillAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const isAllAnswered = drills.length === 2 && drillAnswers[0] !== undefined && drillAnswers[1] !== undefined;

  const handleSubmitDrill = async () => {
    if (!isAllAnswered) return;
    const answersArray = [drillAnswers[0], drillAnswers[1]];
    const result = await onVerify(answersArray);

    if (result?.passed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tier Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-black text-sm shadow-inner">
            T3
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Tier 3: Application & Verification Drill
            </span>
            <h3 className="text-lg font-bold text-white font-display">
              Targeted 2-Question Mastery Verification
            </h3>
          </div>
        </div>

        <div className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-surface-950 border border-white/[0.08] text-slate-300">
          Requirement: <span className="text-emerald-400 font-bold">2 of 2 Correct</span> to Resolve Deficit
        </div>
      </div>

      {/* Dynamic Score Upgrade Banner if Verified */}
      {verificationResult && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 shadow-2xl relative overflow-hidden ${
            verificationResult.passed
              ? 'glass-card-glow-emerald border-emerald-500/60 shadow-glow-emerald/30'
              : 'glass-card-glow border-amber-500/60 shadow-glow-amber/30'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold shadow-lg shrink-0 ${
                  verificationResult.passed
                    ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                    : 'bg-amber-500 text-slate-950 shadow-glow-amber'
                }`}
              >
                {verificationResult.passed ? (
                  <Award className="w-7 h-7" />
                ) : (
                  <TrendingUp className="w-7 h-7" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white flex items-center gap-2 font-display">
                  {verificationResult.passed
                    ? 'Cognitive Deficit Fully Resolved!'
                    : 'Partial Resolution — Developing Status'}
                </h4>
                <p className="text-xs text-slate-300">
                  Verification Performance: <strong className="text-white">{verificationResult.drillCorrectCount}</strong> of <strong className="text-white">{verificationResult.totalDrills}</strong> questions answered accurately.
                </p>
              </div>
            </div>

            {/* Score Delta Badge */}
            <div className="flex items-center gap-4 bg-surface-950/90 px-5 py-3 rounded-2xl border border-white/[0.1] shadow-inner">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Baseline</span>
                <span className="text-sm font-bold text-rose-400 font-mono">{verificationResult.baselineScore}%</span>
              </div>

              <div className="flex items-center text-cyan-400 font-mono text-xs font-black">
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                +{verificationResult.masteryDelta}%
              </div>

              <div className="text-left">
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">New Mastery</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {verificationResult.postRemediationScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Problems */}
      <div className="space-y-6">
        {drills.map((drill, qIdx) => {
          const selectedOption = drillAnswers[qIdx];
          const hasSubmitted = Boolean(verificationResult);
          const isCorrect = hasSubmitted && selectedOption === drill.correct_option_index;
          const isWrong = hasSubmitted && selectedOption !== drill.correct_option_index;

          return (
            <Card
              key={qIdx}
              className={`p-6 sm:p-8 space-y-5 border transition-all duration-300 shadow-xl ${
                hasSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/15'
                    : 'border-rose-500/50 bg-rose-950/15'
                  : 'border-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Verification Drill Problem {qIdx + 1} of 2
                </span>
                {hasSubmitted && (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border font-mono flex items-center gap-1.5 ${
                      isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed font-display">
                {drill.question_text}
              </h4>

              {/* 4 Interactive Options */}
              <div className="space-y-3">
                {(drill.options || []).map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isTheCorrectOption = hasSubmitted && optIdx === drill.correct_option_index;
                  const isUserWrongChoice = hasSubmitted && isSelected && !isCorrect;

                  let optionBorder = 'border-white/[0.06] hover:border-cyan-500/40 bg-surface-900/70 text-slate-300';
                  if (isSelected && !hasSubmitted) {
                    optionBorder = 'bg-cyan-950/40 border-cyan-400 shadow-glow-cyan text-white';
                  } else if (isTheCorrectOption) {
                    optionBorder = 'bg-emerald-950/40 border-emerald-400 text-emerald-100 shadow-glow-emerald/20';
                  } else if (isUserWrongChoice) {
                    optionBorder = 'bg-rose-950/40 border-rose-400 text-rose-100 shadow-glow-rose/20';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`flex items-start gap-3.5 p-4 rounded-2xl cursor-pointer transition-all border ${optionBorder}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-sm ${
                          isSelected || isTheCorrectOption
                            ? isTheCorrectOption
                              ? 'bg-emerald-500 text-slate-950 font-extrabold'
                              : isUserWrongChoice
                              ? 'bg-rose-500 text-white font-extrabold'
                              : 'bg-cyan-500 text-slate-950 font-extrabold'
                            : 'bg-surface-950 text-slate-400 border border-white/[0.08]'
                        }`}
                      >
                        {optionLetters[optIdx]}
                      </div>
                      <div className="text-sm font-medium pt-0.5 leading-relaxed">
                        {opt}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Post-Submission Explanation */}
              {hasSubmitted && drill.explanation && (
                <div className="p-4 rounded-2xl bg-surface-950/80 border border-white/[0.08] text-xs space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider font-mono block">
                    Conceptual Explanation:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {drill.explanation}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Drill Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
        {!verificationResult ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmitDrill}
            loading={isVerifying}
            disabled={!isAllAnswered}
            icon={Sparkles}
            className="w-full sm:w-auto shadow-glow-cyan py-3 px-8 font-bold"
          >
            Submit Application Drill & Recalculate Mastery
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={onFinish}
            iconRight={ArrowRight}
            className="w-full sm:w-auto shadow-glow-cyan py-3 px-8 font-bold"
          >
            Update Cognitive Ledger & Return
          </Button>
        )}
      </div>

    </div>
  );
};
