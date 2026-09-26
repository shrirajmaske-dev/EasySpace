import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  BrainCircuit, 
  Flame, 
  BarChart3, 
  AlertTriangle, 
  User, 
  LogOut, 
  Sparkles,
  ChevronDown,
  Search,
  Command,
  GraduationCap,
  Activity,
  Layers
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useMasteryStore } from '../../store/useMasteryStore.js';
import { ThemeToggle } from './ThemeToggle.jsx';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loginDemoUser } = useAuth();
  const { pendingRemediations } = useMasteryStore();
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: BrainCircuit },
    { name: 'Curriculum Search', path: '/search', icon: Compass },
    { name: 'Mastery Ledger', path: '/mastery', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClose = () => setProfileOpen(false);
    if (profileOpen) {
      window.addEventListener('click', handleClose);
    }
    return () => window.removeEventListener('click', handleClose);
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060913]/80 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/dashboard" className="flex items-center gap-3 group select-none">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-brand-500 to-indigo-600 flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 opacity-0 group-hover:opacity-40 blur transition-opacity" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-display">
                Easy<span className="text-gradient-brand">Space</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 2.5
                </span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-white/[0.08] text-cyan-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-white/[0.08]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-cyan-400 shadow-glow-cyan" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Curriculum Search Button */}
          <button
            onClick={() => navigate('/search')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-850/80 hover:bg-surface-800 border border-white/[0.08] text-xs text-slate-400 hover:text-slate-200 transition-colors shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search topics...</span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
              /
            </span>
          </button>

          {/* Remediation Critical Queue Badge */}
          <button
            onClick={() => navigate('/mastery')}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-all cursor-pointer shadow-glow-rose/20"
            title="Active Deficits Needing Adaptive Remediation"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">Deficit Queue</span>
            <span className="bg-rose-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold text-[10px] shadow-sm">
              {pendingRemediations.length > 0 ? pendingRemediations.length : 1}
            </span>
          </button>

          {/* Active Mastery Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-glow-amber/10">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>5-Day Streak</span>
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle size="md" />

          {/* User Profile Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.08] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-xs font-extrabold text-slate-950 shadow-inner">
                {user?.user_metadata?.full_name ? user.user_metadata.full_name[0] : 'A'}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180 text-white' : ''}`} />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-72 glass-panel border border-white/[0.12] rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 bg-[#0a101d]/95 backdrop-blur-3xl"
              >
                <div className="border-b border-white/[0.08] pb-3 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                      Student Active Session
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">
                    {user?.user_metadata?.full_name || 'Alex Rivera'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user?.email || 'alex.rivera@mit.edu'}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 mt-2 font-mono bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{user?.user_metadata?.academic_institution || 'MIT EECS / MechE'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      loginDemoUser();
                      navigate('/dashboard');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    <span>Reset to Demo Student (MIT)</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/mastery');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Cognitive Mastery Ledger</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      signOut();
                      navigate('/auth/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 rounded-xl text-left transition-colors cursor-pointer mt-1 border-t border-white/[0.06] pt-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
