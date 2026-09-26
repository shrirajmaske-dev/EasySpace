import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { diagnosticsApi } from '../api/diagnostics.js';
import { useMasteryStore } from '../store/useMasteryStore.js';
import { DiagnosticQuestionCard } from '../components/diagnostic/DiagnosticQuestionCard.jsx';
import { QuizTimer } from '../components/diagnostic/QuizTimer.jsx';
import { Button } from '../components/common/Button.jsx';
import { Modal } from '../components/common/Modal.jsx';

export const DiagnosticQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const {
    activeQuiz,
    quizQuestions,
    quizAnswers,
    quizConfidence,
    setActiveQuiz,
    setQuizAnswer,
    setQuizConfidence,
    setLastAttemptResult
  } = useMasteryStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!activeQuiz || quizQuestions.length === 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchQuizIfNeeded = async () => {
      if (!activeQuiz || quizQuestions.length === 0 || activeQuiz.id !== quizId) {
        try {
          setLoading(true);
          const data = await diagnosticsApi.getQuizById(quizId);
          setActiveQuiz(data.quiz, data.questions);
        } catch (err) {
          console.error('[Quiz Fetch Error]:', err);
          setErrorMsg('Failed to load diagnostic quiz questions.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchQuizIfNeeded();
  }, [quizId]);

  const questions = quizQuestions || [];
  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(quizAnswers).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const handleSelectAnswer = (optionIndex) => {
    setQuizAnswer(currentIndex, optionIndex);
  };

  const handleSelectConfidence = (confidence) => {
    setQuizConfidence(currentIndex, confidence);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAttempt = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const elapsedSeconds = Math.max(15, Math.floor((Date.now() - startTime) / 1000));
      
      // Prepare answers array matching question indices
      const answersArray = questions.map((_, idx) => (
        quizAnswers[idx] !== undefined ? quizAnswers[idx] : 0
      ));

      const confidenceArray = questions.map((_, idx) => (
        quizConfidence[idx] || 'Medium'
      ));

      const response = await diagnosticsApi.submitQuiz({
        quizId,
        answers: answersArray,
        timeTakenSeconds: elapsedSeconds,
        confidenceRatings: confidenceArray
      });

      setLastAttemptResult(response);
      navigate(`/diagnostic/${quizId}/results`);
    } catch (err) {
      console.error('[Quiz Submit Error]:', err);
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to submit quiz attempt.');
      setIsSubmitting(false);
    }
  };

  if (loading || !currentQ) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto animate-spin shadow-glow-cyan">
          <Sparkles className="w-7 h-7" />
        </div>
        <p className="text-sm text-slate-300 font-mono">Synthesizing Sub-Concept Diagnostic Assessment...</p>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" />
              Cognitive Diagnostic Exam
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-300 font-semibold">{activeQuiz?.topic}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
            {activeQuiz?.title || 'Sub-Concept Diagnostic Assessment'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <QuizTimer initialSeconds={600} onTimeExpired={handleSubmitAttempt} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Exit Exam
          </Button>
        </div>
      </div>

      {/* Progress Track & Step Indicators */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Diagnostic Progress</span>
          <span className="text-cyan-400 font-bold">
            {answeredCount} of {questions.length} answered ({Math.round(progressPercent)}%)
          </span>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="w-full h-2 rounded-full bg-surface-950 border border-white/[0.08] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-brand-400 to-indigo-500 rounded-full transition-all duration-300 shadow-glow-cyan"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {questions.map((_, idx) => {
            const isAnswered = quizAnswers[idx] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'w-8 bg-cyan-400 shadow-glow-cyan'
                    : isAnswered
                    ? 'w-3 bg-emerald-400/80'
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Question ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Active Question Card Component */}
      <DiagnosticQuestionCard
        question={currentQ}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        selectedAnswerIndex={quizAnswers[currentIndex]}
        onSelectAnswer={handleSelectAnswer}
        confidence={quizConfidence[currentIndex] || 'Medium'}
        onSelectConfidence={handleSelectConfidence}
        onNext={handleNext}
        onPrev={handlePrev}
        isLast={isLastQuestion}
        onSubmit={handleSubmitAttempt}
        isSubmitting={isSubmitting}
      />

    </div>
  );
};
