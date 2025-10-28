import React from 'react';
import { CellState } from '../types';
import { CELL_COLORS } from '../constants';

const LegendItem: React.FC<{ colorClass: string; label: string }> = ({ colorClass, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-sm border ${colorClass}`}></div>
    <span className="text-gray-300 text-xs uppercase tracking-wider">{label}</span>
  </div>
);

const Legend: React.FC = () => {
  return (
    <div className="mt-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 p-3 bg-black/30 border border-gray-800 rounded-lg">
      <LegendItem colorClass={CELL_COLORS[CellState.START]} label="Start" />
      <LegendItem colorClass={CELL_COLORS[CellState.END]} label="End" />
      <LegendItem colorClass={CELL_COLORS[CellState.FINAL_PATH]} label="Final Path" />
       <LegendItem colorClass={CELL_COLORS[CellState.EXPLORING]} label="Backtracking" />
      <LegendItem colorClass={CELL_COLORS[CellState.EXPLORED_BFS]} label="BFS Frontier" />
      <LegendItem colorClass={CELL_COLORS[CellState.VISITED]} label="Visited" />
      <LegendItem colorClass={CELL_COLORS[CellState.BACKTRACKED]} label="Backtracked" />
      <LegendItem colorClass={CELL_COLORS[CellState.WALL]} label="Wall" />
    </div>
  );
};

export default Legend;
