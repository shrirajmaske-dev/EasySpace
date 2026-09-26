import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  ExternalLink, 
  PlayCircle,
  HelpCircle,
  Layers,
  Zap,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';

export const VideoWorkspacePlayer = ({
  video,
  onLaunchDiagnostic,
  isGeneratingQuiz = false
}) => {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'concepts'

  const videoId = video?.youtube_video_id || 'O8Ruv4x3FEY';

  // Academic lecture milestones for focused study
  const milestones = [
    { time: '00:00', title: 'System Boundary & Thermodynamic Coordinates', tag: 'Definition' },
    { time: '05:30', title: 'Derivation of First Principles & Work Integrals', tag: 'Derivation' },
    { time: '12:45', title: 'Equilibrium vs Quasi-Static Trajectories', tag: 'Core Axiom' },
    { time: '21:10', title: 'Common Engineering Misconceptions & Traps', tag: 'Misconception' },
    { time: '28:50', title: 'Analytical Problem Formulation & Verification', tag: 'Application' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Distraction-Free Embedded Video Container with Ambient Cinema Lighting */}
      <div className="relative group">
        {/* Ambient Cinema Backdrop Glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/10 to-purple-500/20 blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />

        <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/[0.12] shadow-2xl">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&iv_load_policy=3`}
            title={video?.title || 'Academic Lecture'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Persistent "Test Comprehension" Launch Action Bar (High-Contrast Hero Bar) */}
      <div className="p-5 sm:p-6 rounded-3xl glass-card-glow-cyan border border-cyan-500/40 flex flex-col md:flex-row items-center justify-between gap-5 shadow-glow-cyan/25">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-white font-display">
                Ready to Break the "Illusion of Competence"?
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                Active Assessment
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Take an adaptive 5-10 question diagnostic quiz to expose micro-concept gaps before they compound.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onLaunchDiagnostic}
          loading={isGeneratingQuiz}
          icon={Sparkles}
          className="w-full md:w-auto text-xs sm:text-sm font-bold shrink-0 whitespace-nowrap shadow-glow-cyan py-3 px-6"
        >
          {isGeneratingQuiz ? 'Synthesizing Diagnostic Quiz...' : 'Launch Diagnostic Assessment'}
        </Button>
      </div>

      {/* Synchronized Lecture Notes & Micro-Concept Decomposition */}
      <Card className="p-6 border-white/[0.08]">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Synchronized Milestones
            </button>
            <button
              onClick={() => setActiveTab('concepts')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'concepts'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Deconstructed Micro-Concepts
            </button>
          </div>

          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Duration: {Math.floor((video?.duration_seconds || 1800) / 60)} mins
          </span>
        </div>

        {activeTab === 'notes' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-3">
              Key conceptual timestamps extracted from the university curriculum:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-surface-900/80 border border-white/[0.06] hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-md bg-surface-950 text-cyan-400 font-mono text-xs font-bold border border-white/[0.06] group-hover:border-cyan-500/40">
                      {m.time}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">{m.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-surface-950 text-slate-400 border border-white/[0.06]">
                    {m.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-2">
              Atomic sub-concepts evaluated in the upcoming diagnostic quiz:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(video?.core_concepts || ['First Law Formulations', 'State Functions vs Path Functions', 'Carnot Cycles']).map((concept, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-900/80 border border-white/[0.06] flex items-start gap-3 hover:border-cyan-500/30 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{concept}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Tested for mental model inversions and boundary neglect.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
