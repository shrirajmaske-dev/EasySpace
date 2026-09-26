import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { ThemeToggle } from '../components/common/ThemeToggle.jsx';

export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('Massachusetts Institute of Technology');
  const [fieldOfStudy, setFieldOfStudy] = useState('EECS & Mechanical Engineering');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { signIn, signUp, loginDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        await signUp(email, password, fullName, institution, fieldOfStudy);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-grid-tech relative overflow-hidden">
      
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle size="md" />
      </div>

      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 py-6">
        
        {/* Left Column: Hero & Platform Showcase (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold tracking-wide shadow-glow-cyan/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI-Powered Cognitive Diagnostic Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] font-display">
              Break the <span className="text-gradient-brand">"Illusion of Competence"</span> in STEM Video Learning.
            </h1>

            <p className="text-base text-slate-300 max-w-xl leading-relaxed">
              Passive video watching leads students to believe they understand concepts when they merely recognize them. EasySpace turns university lectures into an active, self-correcting cognitive mastery loop.
            </p>
          </div>

          {/* Interactive Feature Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-surface-900/80 border border-white/[0.08] space-y-1.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sub-Concept Isolation</h4>
              <p className="text-[11px] text-slate-400">Isolates micro-deficits down to specific mathematical axioms.</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-900/80 border border-white/[0.08] space-y-1.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">3-Tier Remediation</h4>
              <p className="text-[11px] text-slate-400">Mental Model &rarr; Misconception Contrast &rarr; Application Drill.</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-900/80 border border-white/[0.08] space-y-1.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Longitudinal Ledger</h4>
              <p className="text-[11px] text-slate-400">Spaced repetition decay prevention and multi-axis radar tracking.</p>
            </div>
          </div>

          {/* Simulated Live Cognitive Gap Card */}
          <div className="p-4 rounded-2xl bg-surface-900/70 border border-white/[0.08] backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">Deficit Isolated (40% Accuracy)</span>
                <span className="text-xs font-bold text-white">State Functions vs Path Functions</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Remediated &rarr; 85%
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: High-End Auth Glass Card (5 cols on lg) */}
        <div className="lg:col-span-5 w-full">
          <Card className="p-6 sm:p-8 border border-white/[0.12] shadow-2xl backdrop-blur-3xl bg-[#0a101d]/90 relative overflow-hidden">
            
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-brand-400 to-indigo-600" />

            {/* Header Brand Inside Card */}
            <div className="text-center space-y-1 pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 via-cyan-400 to-indigo-600 shadow-glow-cyan mb-1">
                <Sparkles className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight font-display">
                Easy<span className="text-gradient-brand">Space</span>
              </h2>
              <p className="text-xs text-slate-400">
                Academic Portal for Rigorous STEM Video Mastery
              </p>
            </div>

            {/* Quick Demo Access Hero Box */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-surface-900 to-purple-950/40 border border-cyan-500/30 text-center space-y-2.5 shadow-inner">
              <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Instant 1-Click Sandbox</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Explore with pre-seeded thermodynamics lecture paths, diagnostic attempts, and remediation drills:
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={handleDemoLogin}
                icon={Sparkles}
                className="w-full text-xs font-bold py-2.5 shadow-glow-cyan"
              >
                Launch Sandbox as Alex Rivera (MIT Junior)
              </Button>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-white/[0.08] w-full" />
              <span className="bg-[#0a101d] px-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider absolute">
                Or Continue With Credentials
              </span>
            </div>

            {/* Sign In vs Register Switcher */}
            <div className="flex items-center justify-center gap-1 p-1 bg-surface-950 rounded-xl border border-white/[0.08] mb-5">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !isRegister
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isRegister
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {isRegister && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Maya Chen"
                        className="w-full bg-surface-950/80 border border-white/[0.08] rounded-xl px-4 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">University / Institution</label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. Stanford University"
                        className="w-full bg-surface-950/80 border border-white/[0.08] rounded-xl px-4 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Academic Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-surface-950/80 border border-white/[0.08] rounded-xl px-4 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-950/80 border border-white/[0.08] rounded-xl px-4 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                iconRight={ArrowRight}
                className="w-full mt-4 py-3 text-xs sm:text-sm font-bold shadow-glow-cyan"
              >
                {isRegister ? 'Register Student Profile' : 'Sign In to Workspace'}
              </Button>
            </form>
          </Card>
        </div>

      </div>

    </div>
  );
};
