import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Sparkles, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Printer, 
  Filter, 
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Search,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { masteryApi } from '../api/mastery.js';
import { useMasteryStore } from '../store/useMasteryStore.js';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { MasteryRadarChart } from '../components/mastery/MasteryRadarChart.jsx';

export const MasteryLedgerPage = () => {
  const navigate = useNavigate();
  const { masterySummary, setMasterySummary } = useMasteryStore();

  const [ledger, setLedger] = useState(masterySummary);
  const [loading, setLoading] = useState(!masterySummary);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'Critical Deficit' | 'Developing' | 'Mastered'
  const [filterTopic, setFilterTopic] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        setLoading(true);
        const data = await masteryApi.getMasteryLedger();
        setLedger(data);
        setMasterySummary(data);
      } catch (err) {
        console.error('[Mastery Ledger Fetch Error]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [setMasterySummary]);

  const concepts = ledger?.concepts || [];

  const filteredConcepts = concepts.filter((c) => {
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesTopic = filterTopic === 'ALL' || c.topic === filterTopic;
    const matchesSearch = !searchFilter || c.micro_concept.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesStatus && matchesTopic && matchesSearch;
  });

  const topicsList = Array.from(new Set(concepts.map((c) => c.topic)));

  const decayAlerts = concepts.filter((c) => c.decayRisk === 'High' || c.decayRisk === 'Medium');

  const handlePrintReport = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Mastered':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
          </span>
        );
      case 'Developing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
            <AlertTriangle className="w-3.5 h-3.5" /> Developing
          </span>
        );
      case 'Critical Deficit':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
            <ShieldAlert className="w-3.5 h-3.5" /> Critical Gap
          </span>
        );
    }
  };

  const getDecayBadge = (risk) => {
    switch (risk) {
      case 'High':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
            High Decay
          </span>
        );
      case 'Medium':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            Decay Alert
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
            Retained
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0">
      
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Longitudinal Cognitive Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
            Student Academic <span className="text-gradient-brand">Mastery Matrix</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrintReport}
            icon={Printer}
          >
            Export Diagnostic Report
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/search')}
            icon={Sparkles}
            className="shadow-glow-cyan"
          >
            Curate New Topic
          </Button>
        </div>
      </div>

      {/* Top Overview: Radar Matrix & Retention Decay Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        
        {/* Radar Chart (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <MasteryRadarChart radarData={ledger?.radarData || []} />
        </div>

        {/* Retention Decay & Memory Intervals (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-6 space-y-5 border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <Clock className="w-4 h-4 text-cyan-400" />
                Spaced Retention & Cognitive Decay Alerts
              </h4>
              <span className="text-xs font-mono text-slate-400">
                Ebbinghaus Model
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Without active diagnostic re-testing, memory retention decays according to exponential cognitive decay. The following micro-concepts are entering critical decay windows:
            </p>

            {decayAlerts.length > 0 ? (
              <div className="space-y-3">
                {decayAlerts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-surface-950/80 border border-white/[0.06] flex items-center justify-between gap-3 hover:border-amber-500/30 transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {getDecayBadge(concept.decayRisk)}
                        <span className="text-xs font-bold text-white font-display">
                          {concept.micro_concept}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {concept.topic} • Last Tested: {concept.lastTestedDaysAgo} days ago
                      </span>
                    </div>

                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => navigate(`/search?topic=${encodeURIComponent(concept.topic)}`)}
                      icon={RotateCcw}
                      className="shrink-0"
                    >
                      Refresh
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-surface-950/60 border border-white/[0.06] text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">All active concepts within safe retention thresholds.</p>
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Filterable Concept Matrix Ledger Table */}
      <Card className="p-6 sm:p-8 space-y-6 border-white/[0.08] shadow-xl">
        
        {/* Table Filters Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Micro-Concept Competency Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Total {filteredConcepts.length} Concepts Tracked
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search concepts..."
                className="w-full bg-surface-950/80 border border-white/[0.08] rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-surface-950 rounded-xl border border-white/[0.08]">
              {['ALL', 'Critical Deficit', 'Developing', 'Mastered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status === 'Critical Deficit' ? 'Deficit' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Concepts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                <th className="py-3 px-4">Micro-Concept</th>
                <th className="py-3 px-4">Academic Topic</th>
                <th className="py-3 px-4 text-center">Diagnostic Accuracy</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Decay Risk</th>
                <th className="py-3 px-4 text-right">Adaptive Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredConcepts.map((item, idx) => {
                const isCritical = item.status === 'Critical Deficit';

                return (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-bold text-white">
                      {item.micro_concept}
                    </td>

                    <td className="py-4 px-4 text-slate-300 font-mono text-xs">
                      {item.topic}
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-bold">
                      <span className={item.accuracy >= 75 ? 'text-emerald-400' : item.accuracy >= 51 ? 'text-amber-400' : 'text-rose-400'}>
                        {item.accuracy}%
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="py-4 px-4 text-center">
                      {getDecayBadge(item.decayRisk)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {isCritical ? (
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => navigate('/remediation/10000000-0000-0000-0000-000000000001')}
                          icon={Zap}
                          className="font-bold shadow-glow-rose/20"
                        >
                          Remediate
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => navigate(`/search?topic=${encodeURIComponent(item.topic)}`)}
                          iconRight={ArrowRight}
                        >
                          Review
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </Card>

    </div>
  );
};
