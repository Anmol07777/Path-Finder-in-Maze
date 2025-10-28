import { CellState, Algorithm } from './types';

export const MAZE_SIZES = [10, 15, 20];
export const ANIMATION_SPEEDS = [
  { label: 'Slow', value: 100 },
  { label: 'Medium', value: 50 },
  { label: 'Fast', value: 10 },
];

export const ALGORITHMS = [
  { label: 'Backtracking', shortLabel: 'Backtracking', value: Algorithm.DFS, complexity: 'Time Complexity: O(Rows * Cols)' },
  { label: 'Breadth-First Search', shortLabel: 'BFS', value: Algorithm.BFS, complexity: 'Time Complexity: O(Rows * Cols)' },
];


export const CELL_COLORS: { [key in CellState]: string } = {
  [CellState.WALL]: 'bg-gray-900 border-gray-800',
  [CellState.PATH]: 'bg-gray-700 border-gray-600',
  [CellState.EXPLORING]: 'bg-blue-500 border-blue-400 shadow-[0_0_8px_#3b82f6]',
  [CellState.BACKTRACKED]: 'bg-red-600 border-red-500 shadow-[0_0_8px_#ef4444]',
  [CellState.FINAL_PATH]: 'bg-lime-500 border-lime-400 shadow-[0_0_10px_#84cc16]',
  [CellState.START]: 'bg-cyan-500 border-cyan-400 shadow-[0_0_10px_#22d3ee]',
  [CellState.END]: 'bg-fuchsia-500 border-fuchsia-400 shadow-[0_0_10px_#d946ef]',
  [CellState.EXPLORED_BFS]: 'bg-yellow-400 border-yellow-300 shadow-[0_0_8px_#facc15]',
  [CellState.VISITED]: 'bg-purple-700 border-purple-600',
};
