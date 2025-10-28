export enum CellState {
  WALL = 0,
  PATH = 1,
  EXPLORING = 2, // DFS exploring
  BACKTRACKED = 3, // DFS backtrack
  FINAL_PATH = 4,
  START = 5,
  END = 6,
  EXPLORED_BFS = 7, // BFS frontier
  VISITED = 8, // BFS/A* visited
}

export type Maze = CellState[][];

export type MazeSize = 10 | 15 | 20;

export enum AnimationSpeed {
  SLOW = 100,
  MEDIUM = 50,
  FAST = 10,
}

export enum Algorithm {
  DFS = 'DFS', // Represents Backtracking
  BFS = 'BFS',
}
