import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  BrainCircuit, 
  BarChart3, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  Zap, 
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Search,
  Layers,
  GraduationCap,
  Flame,
  Award,
  Play
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useMasteryStore } from '../store/useMasteryStore.js';
import { learningPathsApi } from '../api/learningPaths.js';
import { remediationApi } from '../api/remediation.js';
import { masteryApi } from '../api/mastery.js';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { MasteryRadarChart } from '../components/mastery/MasteryRadarChart.jsx';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    pendingRemediations, 
    setPendingRemediations, 
    masterySummary, 
    setMasterySummary,
    setCurrentPath
  } = useMasteryStore();

  const [userPaths, setUserPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch enrolled paths
        const pathsData = await learningPathsApi.getUserPaths();
        setUserPaths(pathsData.paths || []);

        // Fetch pending remediations
        const pendingData = await remediationApi.getPendingRemediations();
        setPendingRemediations(pendingData.sessions || []);

        // Fetch mastery ledger
        const masteryData = await masteryApi.getMasteryLedger();
        setMasterySummary(masteryData);
      } catch (err) {
        console.warn('[Dashboard Fetch Warning]:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [setPendingRemediations, setMasterySummary]);

  const handleQuickTopicSearch = (topic) => {
    navigate(`/search?topic=${encodeURIComponent(topic)}`);
  };

  const handleContinuePath = (path) => {
    setCurrentPath(path, path.curated_videos || []);
    const firstVideoId = path.curated_videos?.[0]?.id || path.curated_videos?.[0]?.youtube_video_id || 'O8Ruv4x3FEY';
    navigate(`/learn/${path.id}/video/${firstVideoId}`);
  };

  const activeDeficitSession = pendingRemediations.find((s) => s.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome & Student Hero Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl glass-card-glow border border-white/[0.1] shadow-2xl overflow-hidden bg-radial-hero">
        
        {/* Subtle decorative glow accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cognitive Mastery Command Hub</span>
              </div>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">•</span>
              <div className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 font-mono">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user?.user_metadata?.academic_institution || 'MIT EECS / MechE'}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display">
              Welcome back, <span className="text-gradient-brand">{user?.user_metadata?.full_name || 'Alex Rivera'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Eliminate the "Illusion of Competence". You have active video sequences paired with sub-concept diagnostic testing and closed-loop adaptive remediation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/search')}
              icon={Compass}
              className="shadow-glow-cyan"
            >
              Curate Topic
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/mastery')}
              icon={BarChart3}
            >
              Mastery Ledger
            </Button>
          </div>
        </div>
      </div>

      {/* Critical Deficit Alert Banner (Mission-Critical Style) */}
      {activeDeficitSession && (
        <div className="p-6 rounded-3xl glass-card-glow-rose border border-rose-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-glow-rose/30 animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5 shadow-sm">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  Critical Deficit Isolated (&le; 50% Accuracy)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono border border-rose-500/30">
                  {activeDeficitSession.topic}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  ~4 min fix
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {activeDeficitSession.micro_concept}
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                A cognitive failure point was isolated during diagnostic assessment. Launch the 3-Tier remediation module (Intuitive Anchor &rarr; Misconception Contrast &rarr; Application Drill) to repair this deficit and boost your ledger score.
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            size="md"
            onClick={() => navigate(`/remediation/${activeDeficitSession.id}`)}
            icon={Zap}
            className="w-full md:w-auto text-xs font-bold shrink-0 whitespace-nowrap py-3 px-5 shadow-glow-rose"
          >
            Launch 3-Tier Remediation Drill
          </Button>
        </div>
      )}

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <Card className="p-5 space-y-3 border-white/[0.08] hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Mastery Index</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
            {masterySummary?.overallMasteryIndex || 74.2}%
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500" 
              style={{ width: `${masterySummary?.overallMasteryIndex || 74.2}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{masterySummary?.masteredCount || 4} Concepts Mastered</span>
          </p>
        </Card>

        {/* KPI 2 */}
        <Card className="p-5 space-y-3 border-white/[0.08] hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Critical Deficits</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">
            {pendingRemediations.length > 0 ? pendingRemediations.length : 1}
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: '35%' }} />
          </div>
          <p className="text-[11px] text-rose-300 font-medium">
            Requires 3-Tier Remediation
          </p>
        </Card>

        {/* KPI 3 */}
        <Card className="p-5 space-y-3 border-white/[0.08] hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Enrolled Paths</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {userPaths.length > 0 ? userPaths.length : 2}
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }} />
          </div>
          <p className="text-[11px] text-purple-300 font-medium">
            Active STEM Sequences
          </p>
        </Card>

        {/* KPI 4 */}
        <Card className="p-5 space-y-3 border-white/[0.08] hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Concepts Tracked</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <BrainCircuit className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {masterySummary?.totalConceptsTracked || 8}
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }} />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Cognitive Ledger Active
          </p>
        </Card>
      </div>

      {/* Quick Academic Topic Search & STEM Seed Selectors */}
      <Card className="p-6 sm:p-8 space-y-5 border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <Compass className="w-5 h-5 text-cyan-400" />
              Curate Academic Video Learning Path
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter any STEM topic to run the university lecture curation pipeline with automated noise and shorts rejection.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchQuery && handleQuickTopicSearch(searchQuery)}
              placeholder="Search e.g. Thermodynamics, Virtual Memory, Dynamic Programming, Fourier Transform..."
              className="w-full bg-surface-950/80 border border-white/[0.08] rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => searchQuery && handleQuickTopicSearch(searchQuery)}
            icon={Sparkles}
            className="shadow-glow-cyan"
          >
            Curate Syllabus
          </Button>
        </div>

        {/* Quick STEM topic chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-mono">Featured STEM Topics:</span>
          {[
            { name: 'Thermodynamics', discipline: 'Mechanical' },
            { name: 'Operating Systems', discipline: 'CS' },
            { name: 'Data Structures & Algorithms', discipline: 'CS' },
            { name: 'Signals & Systems', discipline: 'Electrical' }
          ].map(({ name, discipline }) => (
            <button
              key={name}
              onClick={() => handleQuickTopicSearch(name)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-slate-300 hover:text-cyan-300 border border-white/[0.08] hover:border-cyan-500/40 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{name}</span>
              <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-1 rounded">
                {discipline}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Active Paths & Competency Radar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Enrolled Paths Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Active Learning Sequences
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {userPaths.length} Enrolled
            </span>
          </div>

          {userPaths.length > 0 ? (
            <div className="space-y-4">
              {userPaths.map((path) => (
                <Card
                  key={path.id}
                  hover
                  onClick={() => handleContinuePath(path)}
                  className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-white/[0.08] hover:border-cyan-500/40 transition-all"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {path.discipline}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Difficulty: <span className="text-slate-200 font-semibold">{path.target_difficulty}</span>
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {path.query_topic}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        {path.curated_videos?.length || 4} Instructional Modules
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active Diagnostic Sync
                      </span>
                    </div>

                    {/* Path completion bar */}
                    <div className="w-full max-w-md h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    iconRight={ChevronRight}
                    className="shrink-0 w-full sm:w-auto"
                  >
                    Resume Study
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center space-y-4 border-white/[0.08]">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">No active curriculum paths yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Search or select a STEM topic above to generate your first distraction-free video sequence.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleQuickTopicSearch('Thermodynamics')}
                icon={Sparkles}
              >
                Start with Thermodynamics Path
              </Button>
            </Card>
          )}
        </div>

        {/* Competency Radar Widget (1 col) */}
        <div className="space-y-4">
          <MasteryRadarChart radarData={masterySummary?.radarData} />
        </div>

      </div>

    </div>
  );
};
