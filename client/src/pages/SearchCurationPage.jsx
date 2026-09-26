import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  Filter, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  SlidersHorizontal,
  GraduationCap,
  Search,
  Clock,
  ShieldCheck,
  Zap,
  Play,
  Award
} from 'lucide-react';
import { learningPathsApi } from '../api/learningPaths.js';
import { useMasteryStore } from '../store/useMasteryStore.js';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { CuratedVideoCard } from '../components/learning/CuratedVideoCard.jsx';

export const SearchCurationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentPath, setCurrentVideo } = useMasteryStore();

  const [domains, setDomains] = useState([]);
  const [selectedDomainId, setSelectedDomainId] = useState('mechanical_engineering');
  const [selectedDiscipline, setSelectedDiscipline] = useState('Thermodynamics');
  const [topic, setTopic] = useState('Thermodynamics');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [curatedResult, setCuratedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch taxonomy on mount
  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const data = await learningPathsApi.getDomains();
        setDomains(data.domains || []);

        const initialTopic = searchParams.get('topic');
        if (initialTopic) {
          setTopic(initialTopic);
          handleCurate(initialTopic, 'Engineering', 'mechanical_engineering', difficulty);
        }
      } catch (err) {
        console.warn('[Taxonomy Warning]:', err.message);
      }
    };
    fetchTaxonomy();
  }, []);

  const handleCurate = async (
    targetTopic = topic,
    targetDiscipline = selectedDiscipline,
    targetDomain = selectedDomainId,
    targetDiff = difficulty
  ) => {
    if (!targetTopic.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await learningPathsApi.curatePath({
        topic: targetTopic,
        query: targetTopic,
        discipline: targetDiscipline,
        domainId: targetDomain,
        difficulty: targetDiff
      });

      setCuratedResult(response);
      setCurrentPath(response.learningPath, response.videos);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to curate academic path');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPredefinedTopic = (topicName, disciplineName, domainId) => {
    setTopic(topicName);
    setSelectedDiscipline(disciplineName);
    setSelectedDomainId(domainId);
    handleCurate(topicName, disciplineName, domainId, difficulty);
  };

  const handleStartWatch = (video) => {
    if (curatedResult?.learningPath) {
      setCurrentVideo(video);
      navigate(`/learn/${curatedResult.learningPath.id}/video/${video.id || video.youtube_video_id}`);
    }
  };

  const handleTakeQuiz = (video) => {
    if (curatedResult?.learningPath) {
      setCurrentVideo(video);
      navigate(`/learn/${curatedResult.learningPath.id}/video/${video.id || video.youtube_video_id}?quiz=true`);
    }
  };

  const handleStartEntireSequence = () => {
    const firstVid = curatedResult?.videos?.[0];
    if (firstVid && curatedResult?.learningPath) {
      handleStartWatch(firstVid);
    }
  };

  const currentDomainObj = domains.find((d) => d.id === selectedDomainId) || domains[0];

  const totalRuntimeMinutes = Math.round(
    (curatedResult?.videos || []).reduce((acc, v) => acc + (v.duration_seconds || 1500), 0) / 60
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Search Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-wide">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Academic Curriculum Discovery Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Curate Distraction-Free <span className="text-gradient-brand">Learning Pathways</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Filter academic video lectures (5 to 45 mins) for scientific rigor, automatically rejecting shorts, reactions, and algorithm-driven promotional noise.
        </p>
      </div>

      {/* Discovery Control Panel */}
      <Card className="p-6 sm:p-8 space-y-6 border-white/[0.08]">
        
        {/* Domain Tabs */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            Target Engineering / Science Domain
          </label>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomainId(domain.id);
                  const firstDisc = domain.disciplines?.[0];
                  if (firstDisc) {
                    setSelectedDiscipline(firstDisc.name);
                    setTopic(firstDisc.topics?.[0] || firstDisc.name);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDomainId === domain.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan/20'
                    : 'bg-surface-900 text-slate-400 hover:text-white border border-white/[0.06] hover:bg-surface-850'
                }`}
              >
                {domain.name}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input, Difficulty, & Curate Action */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* Topic Input */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Syllabus Topic or Keyword
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCurate()}
                placeholder="e.g. Thermodynamics, Virtual Memory, Navier-Stokes, Eigenvectors..."
                className="w-full bg-surface-950/80 border border-white/[0.08] rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Difficulty Level Selector */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Target Academic Rigor
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-surface-950 rounded-xl border border-white/[0.08]">
              {['Foundational', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    difficulty === lvl
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl.slice(0, 5)}
                </button>
              ))}
            </div>
          </div>

          {/* Curate Button */}
          <div className="md:col-span-3">
            <Button
              variant="primary"
              size="md"
              loading={loading}
              onClick={() => handleCurate()}
              icon={Sparkles}
              className="w-full py-3 shadow-glow-cyan"
            >
              {loading ? 'Synthesizing Path...' : 'Curate Pathway'}
            </Button>
          </div>

        </div>

        {/* Quick Predefined STEM Seeds */}
        {currentDomainObj?.disciplines && (
          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <span className="text-xs text-slate-400 font-mono">Suggested Curricula in {currentDomainObj.name}:</span>
            <div className="flex flex-wrap gap-2">
              {currentDomainObj.disciplines.flatMap((disc) =>
                (disc.topics || []).slice(0, 3).map((top) => (
                  <button
                    key={top}
                    onClick={() => handleSelectPredefinedTopic(top, disc.name, currentDomainObj.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-900/90 hover:bg-surface-800 text-slate-300 hover:text-cyan-300 border border-white/[0.06] hover:border-cyan-500/30 transition-all cursor-pointer"
                  >
                    {top}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

      </Card>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Curated Results Section */}
      {curatedResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Results Overview Bar */}
          <div className="p-6 rounded-3xl glass-card-glow border border-white/[0.1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {curatedResult.learningPath.discipline}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Rigor: <strong className="text-white">{curatedResult.learningPath.target_difficulty}</strong>
                </span>
                <span className="text-xs font-mono text-slate-400">•</span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Noise Rejected
                </span>
                {curatedResult.videos?.some((v) => v.curation_source === 'n8n_learnlens') && (
                  <>
                    <span className="text-xs font-mono text-slate-400">•</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400 animate-pulse" /> LearnLens n8n Workflow
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight font-display">
                {curatedResult.learningPath.query_topic}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-3 font-mono">
                <span>{curatedResult.videos?.length || 4} Instructional Modules</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  ~{totalRuntimeMinutes} Minutes Total Rigor
                </span>
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartEntireSequence}
              icon={Play}
              className="w-full md:w-auto text-sm font-bold shadow-glow-cyan"
            >
              Start Module 01
            </Button>
          </div>

          {/* Video Sequence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(curatedResult.videos || []).map((video, idx) => (
              <CuratedVideoCard
                key={video.id || idx}
                video={video}
                pathId={curatedResult.learningPath.id}
                onStartWatch={() => handleStartWatch(video)}
                onTakeQuiz={() => handleTakeQuiz(video)}
                isCompleted={false}
              />
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
