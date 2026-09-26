import React from 'react';
import { HelpCircle, Check, Flame, Award, ShieldAlert, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '../common/Card.jsx';
import { Button } from '../common/Button.jsx';

export const DiagnosticQuestionCard = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswerIndex,
  onSelectAnswer,
  confidence = 'Medium',
  onSelectConfidence,
  onNext,
  onPrev,
  isLast = false,
  onSubmit,
  isSubmitting = false
}) => {
  const optionLetters = ['A', 'B', 'C', 'D'];

  const difficultyColors = {
    Basic: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    Conceptual: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    Application: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
  };

  const confidenceLevels = [
    { level: 'Low', label: 'Low (Intuition / Guess)', desc: 'Unsure of derivation' },
    { level: 'Medium', label: 'Medium (Reasonable)', desc: 'Likely correct' },
    { level: 'High', label: 'High (Mathematical Certainty)', desc: 'Proven from axioms' }
  ];

  return (
    <Card className="p-6 sm:p-8 space-y-6 border-white/[0.1] shadow-2xl relative overflow-hidden">
      
      {/* Top Header with Badges & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-surface-950 border border-slate-200 dark:border-white/[0.08] text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
            Question {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} / {totalQuestions < 10 ? `0${totalQuestions}` : totalQuestions}
          </span>
          <span className={`px-2.5 py-1 rounded-xl border text-xs font-semibold ${difficultyColors[question.difficulty] || difficultyColors.Conceptual}`}>
            {question.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-surface-950/80 border border-slate-200 dark:border-white/[0.08] text-xs text-slate-700 dark:text-slate-300">
          <span className="text-slate-500 font-mono text-[11px]">Micro-Concept:</span>
          <span className="font-bold text-cyan-700 dark:text-cyan-300 font-mono text-xs">{question.micro_concept}</span>
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-display">
          {question.question_text}
        </h3>
      </div>

      {/* 4 Interactive Option Choices */}
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswerIndex === idx;
          return (
            <div
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 border group select-none ${
                isSelected
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 dark:border-cyan-400 shadow-glow-cyan text-slate-900 dark:text-white ring-1 ring-cyan-500/50'
                  : 'bg-slate-50/80 dark:bg-surface-900/70 border-slate-200 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-surface-850 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors shadow-sm ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-extrabold'
                    : 'bg-white dark:bg-surface-950 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/[0.08] group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:border-cyan-500/30'
                }`}
              >
                {optionLetters[idx]}
              </div>

              <div className="flex-1 text-sm font-medium leading-relaxed pt-1">
                {option}
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Metacognitive Calibration (Confidence Rating Selector) */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-surface-950/70 border border-slate-200 dark:border-white/[0.08] space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 font-mono">
            <Award className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Metacognitive Calibration:
          </span>
          <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase text-[11px]">
            Selected: {confidence}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {confidenceLevels.map(({ level, label, desc }) => {
            const isChosen = confidence === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onSelectConfidence(level)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isChosen
                    ? 'bg-cyan-100/80 dark:bg-cyan-500/20 border-cyan-500 dark:border-cyan-400 text-cyan-900 dark:text-cyan-300 shadow-sm'
                    : 'bg-white dark:bg-surface-900/60 border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>{label}</span>
                  {isChosen && <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400" />}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        <Button
          variant="secondary"
          size="md"
          onClick={onPrev}
          disabled={currentIndex === 0}
          icon={ChevronLeft}
        >
          Previous
        </Button>

        {isLast ? (
          <Button
            variant="primary"
            size="md"
            onClick={onSubmit}
            loading={isSubmitting}
            disabled={selectedAnswerIndex === undefined || selectedAnswerIndex === null}
            icon={Sparkles}
            className="shadow-glow-cyan"
          >
            Submit Diagnostic Assessment
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={onNext}
            disabled={selectedAnswerIndex === undefined || selectedAnswerIndex === null}
            iconRight={ChevronRight}
            className="shadow-glow-cyan"
          >
            Next Question
          </Button>
        )}
      </div>
    </Card>
  );
};
