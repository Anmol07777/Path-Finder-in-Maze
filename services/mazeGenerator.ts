
import { Maze, CellState, MazeSize } from '../types';

export function generateMaze(size: MazeSize): Maze {
  const maze: Maze = Array(size).fill(null).map(() => Array(size).fill(CellState.PATH));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // Ensure start and end are paths
      if ((i === 0 && j === 0) || (i === size - 1 && j === size - 1)) {
        maze[i][j] = CellState.PATH;
      } else {
        // 30% chance of being a wall
        maze[i][j] = Math.random() < 0.3 ? CellState.WALL : CellState.PATH;
      }
    }
  }

  // Ensure a clear area around start and end for better solvability
  maze[0][1] = CellState.PATH;
  maze[1][0] = CellState.PATH;
  maze[1][1] = CellState.PATH;
  maze[size - 1][size - 2] = CellState.PATH;
  maze[size - 2][size - 1] = CellState.PATH;
  maze[size - 2][size - 2] = CellState.PATH;

  return maze;
}
