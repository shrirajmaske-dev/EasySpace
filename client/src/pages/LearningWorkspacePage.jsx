import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ListVideo,
  GraduationCap,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { learningPathsApi } from '../api/learningPaths.js';
import { diagnosticsApi } from '../api/diagnostics.js';
import { useMasteryStore } from '../store/useMasteryStore.js';
import { VideoWorkspacePlayer } from '../components/learning/VideoWorkspacePlayer.jsx';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';

export const LearningWorkspacePage = () => {
  const { pathId, videoId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { 
    currentPath, 
    setCurrentPath, 
    currentVideos, 
    setCurrentVideo, 
    setActiveQuiz 
  } = useMasteryStore();

  const [path, setPath] = useState(currentPath);
  const [videos, setVideos] = useState(currentVideos);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchPathAndVideos = async () => {
      try {
        setLoading(true);
        const data = await learningPathsApi.getPathById(pathId);
        setPath(data.path);
        setVideos(data.videos || []);
        setCurrentPath(data.path, data.videos);

        // Find active video
        const found = (data.videos || []).find(
          (v) => v.id === videoId || v.youtube_video_id === videoId
        ) || data.videos?.[0];

        setActiveVideo(found);
        setCurrentVideo(found);

        // Check if query param demands instant quiz launch
        if (searchParams.get('quiz') === 'true' && found) {
          handleLaunchDiagnostic(found, data.path);
        }
      } catch (err) {
        console.error('[LearningWorkspace Error]:', err);
        setErrorMsg('Failed to load instructional video session.');
      } finally {
        setLoading(false);
      }
    };

    fetchPathAndVideos();
  }, [pathId, videoId]);

  const handleSelectVideo = (video) => {
    setActiveVideo(video);
    setCurrentVideo(video);
    navigate(`/learn/${pathId}/video/${video.id || video.youtube_video_id}`);
  };

  const handleLaunchDiagnostic = async (videoToTest = activeVideo, pathObj = path) => {
    if (!videoToTest) return;
    setIsGeneratingQuiz(true);
    setErrorMsg('');

    try {
      const response = await diagnosticsApi.generateQuiz({
        videoId: videoToTest.id || videoToTest.youtube_video_id,
        videoTitle: videoToTest.title,
        videoDescription: videoToTest.description || '',
        topic: pathObj?.query_topic || 'Thermodynamics',
        difficulty: pathObj?.target_difficulty || 'Intermediate',
        learningPathId: pathId
      });

      setActiveQuiz(response.quiz, response.questions);
      navigate(`/diagnostic/${response.quiz.id}`);
    } catch (err) {
      console.error('[Launch Quiz Error]:', err);
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to generate diagnostic assessment.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto animate-spin shadow-glow-cyan">
          <Sparkles className="w-7 h-7" />
        </div>
        <p className="text-sm text-slate-300 font-mono">Initializing distraction-free video sanctuary...</p>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '25m';
    return `${Math.round(seconds / 60)}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/dashboard')}
            icon={ArrowLeft}
          >
            Dashboard
          </Button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>/</span>
            <span className="text-cyan-400 font-semibold">{path?.discipline || 'Engineering'}</span>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-xs">{path?.query_topic}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Distraction-Free Mode Active
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Main Learning Grid (Workspace Left + Playlist Sidebar Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Player & Active Recall Bar (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Lecture Title Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-surface-850 text-cyan-400 border border-white/[0.08]">
                Module {activeVideo?.sequence_order || 1} of {videos.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {activeVideo?.channel_title || 'Academic Instruction'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              {activeVideo?.title}
            </h1>
          </div>

          {/* Embedded Video Workspace Component */}
          <VideoWorkspacePlayer
            video={activeVideo}
            onLaunchDiagnostic={() => handleLaunchDiagnostic(activeVideo, path)}
            isGeneratingQuiz={isGeneratingQuiz}
          />
        </div>

        {/* Right Column: Course Sequence & Module Playlist (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          
          <Card className="p-5 space-y-4 border-white/[0.08] sticky top-24">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <ListVideo className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Curriculum Playlist
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {videos.length} Modules
              </span>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
              {videos.map((vid, idx) => {
                const isActive = (vid.id === activeVideo?.id) || (vid.youtube_video_id === activeVideo?.youtube_video_id);
                return (
                  <div
                    key={vid.id || idx}
                    onClick={() => handleSelectVideo(vid)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border flex items-start gap-3 ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-400/80 shadow-glow-cyan text-white'
                        : 'bg-surface-900/60 border-white/[0.06] hover:bg-surface-850 hover:border-cyan-500/30 text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'bg-surface-950 text-slate-400 border border-white/[0.08]'
                      }`}
                    >
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold line-clamp-2 leading-snug ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {vid.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {formatDuration(vid.duration_seconds)}
                        </span>
                        <span>•</span>
                        <span className="truncate">{vid.channel_title}</span>
                      </div>
                    </div>

                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan shrink-0 mt-2" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Test Module CTA at Bottom of Playlist */}
            <div className="pt-2 border-t border-white/[0.08]">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleLaunchDiagnostic(activeVideo, path)}
                loading={isGeneratingQuiz}
                icon={Sparkles}
                className="w-full text-xs font-bold py-2.5 shadow-glow-cyan"
              >
                Test Module Knowledge
              </Button>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
