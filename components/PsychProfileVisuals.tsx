import React from 'react';
import { DecisionBiases, RegretProfile } from '../types';

interface Props {
  biases: DecisionBiases;
  regrets: RegretProfile;
}

const TensionBar = ({ 
  leftLabel, 
  rightLabel, 
  value, 
  inverted = false 
}: { 
  leftLabel: string, 
  rightLabel: string, 
  value: number, 
  inverted?: boolean 
}) => {
  const pos = inverted ? 100 - value : value;
  const glowColor = pos < 50 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(220, 38, 38, 0.8)';
  const borderColor = pos < 50 ? 'border-blue-500' : 'border-red-500';

  return (
    <div className="mb-8 relative group">
      <div className="flex justify-between text-xs font-serif text-neutral-400 mb-2 tracking-widest uppercase">
        <span className={pos < 40 ? "text-blue-400" : ""}>{leftLabel}</span>
        <span className={pos > 60 ? "text-red-400" : ""}>{rightLabel}</span>
      </div>

      <div className="relative h-1.5 bg-neutral-900/80 rounded-full border border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-red-900/20 opacity-40" />
        <div className="absolute left-1/2 top-[-4px] bottom-[-4px] w-px bg-neutral-800 -translate-x-1/2" />

        <div
          className="absolute top-1/2 h-0.5 w-16 blur-[2px] -translate-y-1/2 -translate-x-1/2 transition-all duration-1000"
          style={{ left: `${pos}%`, backgroundColor: pos < 50 ? '#93c5fd' : '#fca5a5' }}
        />

        <div
          className={`absolute top-1/2 w-3 h-3 bg-neutral-900 rounded-full border-2 ${borderColor} -translate-y-1/2 -translate-x-1/2`}
          style={{ left: `${pos}%`, boxShadow: `0 0 12px ${glowColor}` }}
        />
      </div>

      <div className="text-center mt-1 h-4">
        <span className={`text-[10px] font-mono ${Math.abs(pos - 50) < 10 ? "text-neutral-500" : "opacity-0"}`}>
          YOUR BALANCE ZONE
        </span>
      </div>
    </div>
  );
};

const PsychProfileVisuals: React.FC<Props> = ({ biases, regrets }) => {
  const radius = 120;
const labelPaddingX = 90;
const labelPaddingY = 70;

const minX = -radius - labelPaddingX;
const maxX =  radius + labelPaddingX;
const minY = -radius - labelPaddingY;
const maxY =  radius + labelPaddingY;


  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  // Polygon points (centered at 0,0)
  const p1 = { x: 0, y: -(regrets.regret_of_inaction / 100) * radius };
  const p2 = { x: (regrets.regret_of_action / 100) * radius, y: 0 };
  const p3 = { x: 0, y: (regrets.regret_of_outcome / 100) * radius };
  const p4 = { x: -(regrets.regret_of_self_betrayal / 100) * radius, y: 0 };

  const points = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;

  const parchmentBg =
    "bg-[#0c0b0a] bg-[radial-gradient(ellipse_at_top,_rgba(180,90,40,0.08),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(120,40,20,0.06),_transparent_70%)]";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl mb-8">

      {/* LEFT PANEL */}
      <div className={`p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-neutral-800 ${parchmentBg}`}>
        <h3 className="text-2xl font-serif text-neutral-200 text-center mb-1">
          Moral Tension Map
        </h3>
        <p className="text-neutral-500 text-xs text-center uppercase tracking-widest mb-10 font-mono">
          Where You Navigate
        </p>

        <TensionBar leftLabel="Action" rightLabel="Inaction" value={biases.prioritizes_action_over_passivity} inverted />
        <TensionBar leftLabel="Loyalty" rightLabel="Impartiality" value={biases.prioritizes_loyalty_over_impartiality} inverted />
        <TensionBar leftLabel="Principle" rightLabel="Outcome" value={biases.prioritizes_principle_over_outcome} inverted />
        <TensionBar leftLabel="Self-Preservation" rightLabel="Self-Sacrifice" value={biases.prioritizes_self_sacrifice_over_self_preservation} />
      </div>

      {/* RIGHT PANEL */}
      <div className={`p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden ${parchmentBg}`}>
        <h3 className="text-2xl font-serif text-neutral-200 mb-1">
          Regret Profile
        </h3>
        <p className="text-neutral-500 text-xs uppercase tracking-widest mb-8 font-mono">
          What Haunts You
        </p>

        <svg
          viewBox={viewBox}
          className="w-96 h-96 max-w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* axes */}
          <circle cx={0} cy={0} r={radius} fill="none" stroke="#262626" />
          <line x1={0} y1={-radius} x2={0} y2={radius} stroke="#262626" />
          <line x1={-radius} y1={0} x2={radius} y2={0} stroke="#262626" />

          {/* TOP — Inaction */}
          <text x={0} y={-radius - 24} textAnchor="middle" fill="#e5e5e5" fontSize="12" fontFamily="serif">
            <tspan x={0} dy="-14">Regret</tspan>
            <tspan x={0} dy="14">of</tspan>
            <tspan x={0} dy="14">Inaction</tspan>
          </text>

          {/* RIGHT — Action */}
          <text x={radius + 24} y={0} textAnchor="start" dominantBaseline="middle" fill="#e5e5e5" fontSize="12" fontFamily="serif">
            <tspan x={radius + 24} dy="-14">Regret</tspan>
            <tspan x={radius + 24} dy="14">of</tspan>
            <tspan x={radius + 24} dy="14">Action</tspan>
          </text>

          {/* BOTTOM — Outcome */}
          <text x={0} y={radius + 28} textAnchor="middle" fill="#e5e5e5" fontSize="12" fontFamily="serif">
            <tspan x={0} dy="-14">Regret</tspan>
            <tspan x={0} dy="14">of</tspan>
            <tspan x={0} dy="14">Outcome</tspan>
          </text>

          {/* LEFT — Self-Betrayal */}
          <text x={-radius - 24} y={0} textAnchor="end" dominantBaseline="middle" fill="#e5e5e5" fontSize="12" fontFamily="serif">
            <tspan x={-radius - 24} dy="-14">Regret</tspan>
            <tspan x={-radius - 24} dy="14">of</tspan>
            <tspan x={-radius - 24} dy="14">Self-Betrayal</tspan>
          </text>

          {/* polygon */}
          <polygon
            points={points}
            fill="rgba(153, 27, 27, 0.2)"
            stroke="rgba(220, 38, 38, 0.8)"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default PsychProfileVisuals;
