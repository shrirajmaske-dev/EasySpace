import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ArrowRight,
  RotateCcw,
  BarChart3,
  Layers,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { useMasteryStore } from '../store/useMasteryStore.js';
import { KnowledgeGapMatrix } from '../components/diagnostic/KnowledgeGapMatrix.jsx';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';

export const DiagnosticResultsPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const { lastAttemptResult, activeQuiz } = useMasteryStore();
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);

  // If no attempt stored, generate simulated results for preview or redirect
  const result = lastAttemptResult || {
    quizTitle: activeQuiz?.title || 'Thermodynamics Diagnostic Assessment',
    topic: activeQuiz?.topic || 'Thermodynamics',
    evaluation: {
      totalScore: 50.0,
      totalPossible: 6,
      accuracyPercentage: 50.0,
      timeTakenSeconds: 245,
      conceptMatrix: [
        {
          micro_concept: 'State Functions vs Path Functions',
          topic: 'Thermodynamics',
          accuracy: 40.0,
          status: 'Critical Deficit',
          totalTested: 2,
          correctCount: 0,
          primaryErrorType: 'Mental Model Inversion',
          missedQuestions: [
            {
              questionText: 'Which physical quantity is a true state function?',
              userAnswer: 'Shaft Work (W)',
              correctAnswer: 'Specific Internal Energy (u)',
              errorType: 'Mental Model Inversion',
              distractorRationale: 'Shaft work is a path function whose integral depends directly on the process trajectory.'
            }
          ]
        },
        {
          micro_concept: 'First Law Closed System Balance',
          topic: 'Thermodynamics',
          accuracy: 100.0,
          status: 'Mastered',
          totalTested: 2,
          correctCount: 2,
          primaryErrorType: null,
          missedQuestions: []
        },
        {
          micro_concept: 'Carnot Thermal Efficiency',
          topic: 'Thermodynamics',
          accuracy: 50.0,
          status: 'Critical Deficit',
          totalTested: 2,
          correctCount: 1,
          primaryErrorType: 'Boundary Neglect',
          missedQuestions: [
            {
              questionText: 'A proposed engine claims 60% efficiency between 600K and 300K.',
              userAnswer: 'Valid because 60% < 100%',
              correctAnswer: 'Violates Second Law because Carnot limit is 50%',
              errorType: 'Boundary Neglect',
              distractorRationale: 'Exceeds Carnot temperature-ratio upper bound.'
            }
          ]
        }
      ],
      criticalDeficits: [
        {
          micro_concept: 'State Functions vs Path Functions',
          accuracy: 40.0,
          status: 'Critical Deficit'
        },
        {
          micro_concept: 'Carnot Thermal Efficiency',
          accuracy: 50.0,
          status: 'Critical Deficit'
        }
      ],
      detailedBreakdown: []
    },
    remediations: [
      {
        id: '10000000-0000-0000-0000-000000000001',
        micro_concept: 'State Functions vs Path Functions',
        topic: 'Thermodynamics'
      }
    ]
  };

  const evaluation = result.evaluation;
  const criticalCount = evaluation.criticalDeficits?.length || 0;
  const isPassingMastery = evaluation.accuracyPercentage >= 75.0;

  const handleLaunchRemediation = (remediationIdOrConcept) => {
    // If an ID is provided, navigate directly; otherwise find the session or navigate
    if (typeof remediationIdOrConcept === 'string' && remediationIdOrConcept.includes('-')) {
      navigate(`/remediation/${remediationIdOrConcept}`);
    } else {
      const match = (result.remediations || []).find(
        (r) => r.micro_concept === remediationIdOrConcept
      );
      if (match) {
        navigate(`/remediation/${match.id}`);
      } else {
        navigate(`/remediation/10000000-0000-0000-0000-000000000001`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Diagnostic Assessment Complete
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
            {result.quizTitle || 'Sub-Concept Diagnostic Heatmap'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/dashboard')}
            icon={ArrowLeft}
          >
            Return to Dashboard
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/mastery')}
            icon={BarChart3}
            className="shadow-glow-cyan"
          >
            View Mastery Ledger
          </Button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 shadow-2xl relative overflow-hidden ${
          isPassingMastery
            ? 'glass-card-glow border-emerald-500/40 shadow-glow-emerald/20'
            : 'glass-card-glow-rose border-rose-500/40 shadow-glow-rose/25'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Left Score Gauge */}
          <div className="flex items-center gap-6">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex flex-col items-center justify-center font-mono shrink-0 shadow-2xl border ${
                isPassingMastery
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-glow-emerald/30'
                  : 'bg-rose-500/15 border-rose-500/50 text-rose-400 shadow-glow-rose/30'
              }`}
            >
              <span className="text-3xl sm:text-4xl font-black">
                {Math.round(evaluation.accuracyPercentage)}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                Accuracy
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border font-mono ${
                    isPassingMastery
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {isPassingMastery ? 'Mastery Verified' : 'Critical Deficits Isolated'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {evaluation.timeTakenSeconds}s elapsed
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                {isPassingMastery
                  ? 'Congratulations! Strong Cognitive Retention.'
                  : `${criticalCount} Knowledge Gap${criticalCount > 1 ? 's' : ''} Require Adaptive Remediation`}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {isPassingMastery
                  ? 'Your mental model accurately resisted distractor traps. Your longitudinal ledger has been credited with these concepts.'
                  : 'Passive recognition failed under diagnostic pressure. Use the 3-Tier Closed-Loop Remediation engine to reconstruct the underlying physical intuition.'}
              </p>
            </div>
          </div>

          {/* Right Action Trigger */}
          <div className="shrink-0 w-full md:w-auto">
            {criticalCount > 0 ? (
              <Button
                variant="danger"
                size="lg"
                onClick={() => handleLaunchRemediation(result.remediations?.[0]?.id || '10000000-0000-0000-0000-000000000001')}
                icon={Zap}
                className="w-full md:w-auto text-xs sm:text-sm font-bold shadow-glow-rose py-3 px-6"
              >
                Launch 3-Tier Remediation Drill
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/search')}
                icon={Sparkles}
                className="w-full md:w-auto text-xs sm:text-sm font-bold shadow-glow-cyan py-3 px-6"
              >
                Curate Next Syllabus Topic
              </Button>
            )}
          </div>

        </div>
      </div>

      {/* Cognitive Knowledge-Gap Isolation Matrix Component */}
      <KnowledgeGapMatrix
        conceptMatrix={evaluation.conceptMatrix || []}
        remediations={result.remediations || []}
        onLaunchRemediation={handleLaunchRemediation}
      />

    </div>
  );
};
