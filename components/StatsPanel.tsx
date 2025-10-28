import React from 'react';
import { Algorithm } from '../types';

interface StatsPanelProps {
  steps: number;
  backtracks: number;
  pathLength: number;
  time: number;
  algorithm: Algorithm;
}

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-baseline">
    <span className="text-sm text-gray-400 uppercase tracking-wider">{label}</span>
    <span className="text-xl md:text-2xl font-bold text-cyan-300">{value}</span>
  </div>
);

const StatsPanel: React.FC<StatsPanelProps> = ({ steps, backtracks, pathLength, time, algorithm }) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0 bg-black/50 p-4 rounded-lg shadow-2xl border border-cyan-500/50 shadow-cyan-500/20">
      <h2 className="text-center text-lg font-bold text-cyan-300 uppercase tracking-widest mb-4 neon-text">
        Statistics
      </h2>
      <div className="flex flex-col gap-3">
        <StatItem label="Time Taken" value={`${time} ms`} />
        <StatItem label="Steps Explored" value={steps} />
        {algorithm === Algorithm.DFS && (
           <StatItem label="Cells Backtracked" value={backtracks} />
        )}
        <StatItem label="Path Length" value={pathLength > 0 ? pathLength : '--'} />
      </div>
    </div>
  );
};

export default StatsPanel;
