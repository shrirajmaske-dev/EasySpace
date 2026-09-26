import React from 'react';
import { Play, Sparkles, Clock, CheckCircle2, ChevronRight, GraduationCap, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card.jsx';
import { Button } from '../common/Button.jsx';

export const CuratedVideoCard = ({ video, pathId, onStartWatch, onTakeQuiz, isCompleted = false }) => {
  const formatDuration = (seconds) => {
    if (!seconds) return '25:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card hover className="flex flex-col justify-between group overflow-hidden border border-white/[0.08] hover:border-cyan-500/40 p-0 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
      
      {/* Video Thumbnail Header */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface-950">
        <img
          src={video.thumbnail_url || 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80'}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/30 to-transparent" />

        {/* Sequence Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-surface-950/85 backdrop-blur-md border border-white/[0.1] text-xs font-mono font-bold text-cyan-400 shadow-sm">
          Module {video.sequence_order < 10 ? `0${video.sequence_order}` : video.sequence_order}
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-950/90 backdrop-blur-md border border-white/[0.1] text-xs font-mono text-slate-200">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formatDuration(video.duration_seconds)}</span>
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {video.relevance && (
            <div className="px-2 py-0.5 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/40 text-[10px] font-mono text-cyan-300 font-bold">
              {Math.round(video.relevance > 1 ? video.relevance : video.relevance * 100)}% Match
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{video.curation_source === 'n8n_learnlens' ? 'LearnLens n8n' : 'Curated Rigor'}</span>
          </div>
        </div>

        {/* Play Icon Overlay */}
        <div 
          onClick={onStartWatch}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/40 backdrop-blur-[2px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center shadow-glow-cyan transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Video Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] truncate flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              {video.channel_title || 'Academic Lecture'}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Tested
              </span>
            )}
          </div>
          <h4 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors font-display">
            {video.title}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {video.description || 'Comprehensive university instruction covering fundamental principles and applications.'}
          </p>
        </div>

        {/* Extracted Micro-Concepts */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Tested Micro-Concepts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(video.core_concepts || []).map((concept, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-surface-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06] hover:border-cyan-500/40 transition-colors"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.08]">
          <Button
            variant="secondary"
            size="sm"
            onClick={onStartWatch}
            icon={Play}
            className="w-full text-xs"
          >
            Watch Video
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onTakeQuiz}
            icon={Sparkles}
            className="w-full text-xs font-bold shadow-glow-cyan/20"
          >
            Test Concept
          </Button>
        </div>
      </div>
    </Card>
  );
};
