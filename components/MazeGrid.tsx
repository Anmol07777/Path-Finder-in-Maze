import React from 'react';
import { Maze, CellState, MazeSize } from '../types';
import { CELL_COLORS } from '../constants';

interface MazeGridProps {
  maze: Maze;
  size: MazeSize;
  startPos: { row: number; col: number };
  endPos: { row: number; col: number };
  isSolving: boolean;
  onCellClick: (row: number, col: number, event: React.MouseEvent) => void;
}

const MazeGrid: React.FC<MazeGridProps> = ({ maze, size, startPos, endPos, isSolving, onCellClick }) => {
  return (
    <div className="bg-black/50 p-2 md:p-4 rounded-lg shadow-2xl border border-gray-700">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          gap: '2px',
        }}
      >
        {maze.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            let cellType = cell;
            if (rowIndex === startPos.row && colIndex === startPos.col) {
              cellType = CellState.START;
            } else if (rowIndex === endPos.row && colIndex === endPos.col) {
              cellType = CellState.END;
            }
            
            const cellSize = size === 20 ? 'w-4 h-4 md:w-5 md:h-5' : size === 15 ? 'w-6 h-6 md:w-8 md:h-8' : 'w-8 h-8 md:w-10 md:h-10';
            const cursorClass = isSolving ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110 transform';

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={(e) => onCellClick(rowIndex, colIndex, e)}
                className={`transition-all duration-150 border ${cellSize} ${CELL_COLORS[cellType]} ${cursorClass}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default MazeGrid;