import React from 'react';
import { Card } from '../common/Card.jsx';
import { Award, Zap, TrendingUp, Sparkles } from 'lucide-react';

export const MasteryRadarChart = ({ radarData = [] }) => {
  // If no data, use standard STEM topics
  const topics = radarData.length > 0 ? radarData : [
    { topic: 'Thermodynamics', averageMastery: 72 },
    { topic: 'Operating Systems', averageMastery: 68 },
    { topic: 'Data Structures', averageMastery: 84 },
    { topic: 'Signals & Systems', averageMastery: 60 }
  ];

  const size = 320;
  const center = size / 2;
  const radius = 105;
  const numSides = topics.length;

  // Calculate coordinates on the radar polygon
  const getCoordinates = (index, valuePercent) => {
    const angle = (Math.PI * 2 / numSides) * index - Math.PI / 2;
    const r = (valuePercent / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate web rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  const ringPoints = rings.map((factor) => {
    return topics
      .map((_, i) => {
        const { x, y } = getCoordinates(i, factor * 100);
        return `${x},${y}`;
      })
      .join(' ');
  });

  // Data polygon points
  const polygonPoints = topics
    .map((item, i) => {
      const val = Math.max(15, Math.min(100, item.averageMastery || 50));
      const { x, y } = getCoordinates(i, val);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card className="p-6 flex flex-col items-center justify-between border-white/[0.08] shadow-xl">
      <div className="w-full flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2 font-display">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            STEM Competency Radar Matrix
          </h4>
          <p className="text-xs text-slate-400">
            Multi-axis cognitive distribution across engineering disciplines.
          </p>
        </div>
      </div>

      {/* SVG Radar */}
      <div className="relative flex items-center justify-center my-3 select-none">
        <svg width={size} height={size} className="overflow-visible">
          
          {/* Background Concentric Webs */}
          {ringPoints.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="currentColor"
              className="text-slate-300 dark:text-white/10"
              strokeWidth="1.2"
              strokeDasharray={idx === 3 ? 'none' : '3 3'}
            />
          ))}

          {/* Radial Axis Spokes */}
          {topics.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="currentColor"
                className="text-slate-300 dark:text-white/15"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Data Filled Polygon with Smooth Glow */}
          <polygon
            points={polygonPoints}
            fill="url(#radarGradient)"
            fillOpacity="0.4"
            stroke="#0284c7"
            className="dark:stroke-[#22d3ee] filter drop-shadow-[0_0_14px_rgba(6,182,212,0.35)]"
            strokeWidth="2.5"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Vertex Circles */}
          {topics.map((item, i) => {
            const val = Math.max(15, Math.min(100, item.averageMastery || 50));
            const { x, y } = getCoordinates(i, val);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#0284c7"
                  className="dark:fill-[#00f2fe]"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all hover:scale-125"
                />
              </g>
            );
          })}

          {/* Dynamic Labels */}
          {topics.map((item, i) => {
            const angle = (Math.PI * 2 / numSides) * i - Math.PI / 2;
            const labelR = radius + 32;
            const x = center + labelR * Math.cos(angle);
            const y = center + labelR * Math.sin(angle);

            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-mono font-bold fill-slate-700 dark:fill-slate-200"
              >
                {item.topic} ({item.averageMastery}%)
              </text>
            );
          })}
        </svg>
      </div>

      {/* Competency Summary Bars */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/[0.08] mt-2">
        {topics.map((t, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-surface-950/70 border border-white/[0.06] text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 truncate block font-bold">
              {t.topic}
            </span>
            <span className="text-sm font-black text-cyan-400 font-mono mt-0.5 block">
              {t.averageMastery}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
