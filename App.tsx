import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Maze, CellState, MazeSize, AnimationSpeed, Algorithm } from './types';
import { generateMaze } from './services/mazeGenerator';
import MazeGrid from './components/MazeGrid';
import Controls from './components/Controls';
import Legend from './components/Legend';
import StatsPanel from './components/StatsPanel';
import { ALGORITHMS } from './constants';

const App: React.FC = () => {
  const [mazeSize, setMazeSize] = useState<MazeSize>(10);
  const [maze, setMaze] = useState<Maze>(() => generateMaze(mazeSize));
  const [startPos, setStartPos] = useState({ row: 0, col: 0 });
  const [endPos, setEndPos] = useState({ row: mazeSize - 1, col: mazeSize - 1 });
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [pathExists, setPathExists] = useState<boolean | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>(AnimationSpeed.MEDIUM);
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.DFS);
  const [algorithmInfo, setAlgorithmInfo] = useState<string>('');
  const [stats, setStats] = useState({ steps: 0, backtracks: 0, pathLength: 0, time: 0 });
  const timerRef = useRef<number | null>(null);


  const createNewMaze = useCallback((size: MazeSize) => {
    setMaze(generateMaze(size));
    setStartPos({ row: 0, col: 0 });
    setEndPos({ row: size - 1, col: size - 1 });
    setIsSolved(false);
    setPathExists(null);
    setAlgorithmInfo('');
    setStats({ steps: 0, backtracks: 0, pathLength: 0, time: 0 });
  }, []);

  useEffect(() => {
    createNewMaze(mazeSize);
  }, [mazeSize, createNewMaze]);

  const handleGenerate = () => {
    createNewMaze(mazeSize);
  };
  
  const handleReset = useCallback(() => {
    const newMaze = maze.map(row => row.map(cell => (cell === CellState.WALL ? CellState.WALL : CellState.PATH)));
    setMaze(newMaze);
    setIsSolved(false);
    setPathExists(null);
    setStats({ steps: 0, backtracks: 0, pathLength: 0, time: 0 });
  }, [maze]);

  const handleCellClick = (row: number, col: number, event: React.MouseEvent) => {
    if (isSolving) return;
    
    // Prevent edits after a solution is found until reset/generate
    if(isSolved) return;

    const newMaze = maze.map(r => [...r]);

    if (event.shiftKey) {
      if (newMaze[row][col] !== CellState.WALL && !(row === endPos.row && col === endPos.col)) {
        setStartPos({ row, col });
      }
    } else if (event.ctrlKey) {
      if (newMaze[row][col] !== CellState.WALL && !(row === startPos.row && col === startPos.col)) {
        setEndPos({ row, col });
      }
    } else {
      if ((row === startPos.row && col === startPos.col) || (row === endPos.row && col === endPos.col)) {
        return;
      }
      newMaze[row][col] = newMaze[row][col] === CellState.WALL ? CellState.PATH : CellState.WALL;
      setMaze(newMaze);
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const reconstructAndAnimatePath = async (
    cameFrom: { [key: string]: { r: number; c: number } | null },
    end: { r: number; c: number }
  ) => {
    const path: { r: number; c: number }[] = [];
    let current: { r: number; c: number } | null = end;
    while (current) {
      path.unshift(current);
      current = cameFrom[`${current.r},${current.c}`];
    }
    setStats(prev => ({ ...prev, pathLength: path.length }));
    
    const finalMaze = maze.map(row => row.map(cell => {
      return (cell === CellState.WALL ? CellState.WALL : CellState.PATH);
    }));

    for (const pos of path) {
      if (!((pos.r === startPos.row && pos.c === startPos.col) || (pos.r === endPos.row && pos.c === endPos.col))) {
        finalMaze[pos.r][pos.c] = CellState.FINAL_PATH;
      }
    }
    setMaze(finalMaze);
  };

  const solveDFS = async (): Promise<boolean> => {
    const path: [number, number][] = [];
    const visited: boolean[][] = Array(mazeSize).fill(null).map(() => Array(mazeSize).fill(false));
    
    const dfs = async (r: number, c: number): Promise<boolean> => {
      if (r < 0 || c < 0 || r >= mazeSize || c >= mazeSize || visited[r][c] || maze[r][c] === CellState.WALL) {
        return false;
      }

      visited[r][c] = true;
      path.push([r, c]);
      setStats(prev => ({...prev, steps: prev.steps + 1}));

      const newMaze = maze.map(row => [...row]);
      if(!(r === startPos.row && c === startPos.col) && !(r === endPos.row && c === endPos.col)) {
        newMaze[r][c] = CellState.EXPLORING;
      }
      setMaze(newMaze);
      await delay(animationSpeed);
      
      if (r === endPos.row && c === endPos.col) {
        return true;
      }

      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // R, D, L, U
      for (const [dr, dc] of directions) {
        if (await dfs(r + dr, c + dc)) {
          return true;
        }
      }

      path.pop();
      setStats(prev => ({...prev, backtracks: prev.backtracks + 1}));
      const backtrackMaze = maze.map(row => [...row]);
      if(!(r === startPos.row && c === startPos.col)) {
        backtrackMaze[r][c] = CellState.BACKTRACKED;
      }
      setMaze(backtrackMaze);
      await delay(animationSpeed);
      return false;
    };

    const found = await dfs(startPos.row, startPos.col);

    if (found) {
      setStats(prev => ({...prev, pathLength: path.length}));
      const finalMaze = maze.map(row => row.map(cell => (cell === CellState.WALL ? CellState.WALL : CellState.PATH)));
      for (const [r, c] of path) {
         if(!(r === startPos.row && c === startPos.col) && !(r === endPos.row && c === endPos.col)) {
            finalMaze[r][c] = CellState.FINAL_PATH;
         }
      }
      setMaze(finalMaze);
    }
    return found;
  };

  const solveBFS = async (): Promise<boolean> => {
    const start = { r: startPos.row, c: startPos.col };
    const end = { r: endPos.row, c: endPos.col };
    const queue: { r: number, c: number }[] = [start];
    const cameFrom: { [key: string]: { r: number, c: number } | null } = { [`${start.r},${start.c}`]: null };
    const mazeCopy = maze.map(r => [...r]);

    setStats(prev => ({...prev, steps: 1}));

    while (queue.length > 0) {
      const { r, c } = queue.shift()!;
      if (r === end.r && c === end.c) {
        await reconstructAndAnimatePath(cameFrom, end);
        return true;
      }

      if (!(r === start.r && c === start.c)) {
        mazeCopy[r][c] = CellState.VISITED;
      }

      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;

        if (nr >= 0 && nr < mazeSize && nc >= 0 && nc < mazeSize && mazeCopy[nr][nc] !== CellState.WALL && !cameFrom.hasOwnProperty(key)) {
          setStats(prev => ({...prev, steps: prev.steps + 1}));
          cameFrom[key] = { r, c };
          queue.push({ r: nr, c: nc });
          if (!(nr === end.r && nc === end.c)) {
            mazeCopy[nr][nc] = CellState.EXPLORED_BFS;
          }
        }
      }
      setMaze(mazeCopy.map(r => [...r]));
      await delay(animationSpeed);
    }
    return false;
  };

  const solve = async () => {
    setIsSolving(true);
    setIsSolved(false);
    setPathExists(null);
    setStats({ steps: 0, backtracks: 0, pathLength: 0, time: 0 });
    handleReset();
    await delay(100); // Give time for reset to render

    const currentAlgorithm = ALGORITHMS.find(a => a.value === algorithm);
    if (currentAlgorithm) {
      setAlgorithmInfo(`Running: ${currentAlgorithm.label} | ${currentAlgorithm.complexity}`);
    }

    const startTime = performance.now();
    timerRef.current = window.setInterval(() => {
      setStats(prev => ({ ...prev, time: Math.floor(performance.now() - startTime) }));
    }, 45);

    let found = false;
    switch (algorithm) {
      case Algorithm.DFS:
        found = await solveDFS();
        break;
      case Algorithm.BFS:
        found = await solveBFS();
        break;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const endTime = performance.now();
    setStats(prev => ({ ...prev, time: Math.floor(endTime - startTime) }));

    setPathExists(found);
    setIsSolving(false);
    setIsSolved(true);
  };


  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white p-4 flex flex-col items-center justify-center gap-4">
      <header className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-cyan-300 neon-text tracking-widest py-4">
          Path Finder in Maze
        </h1>
      </header>
      
      <main className="w-full flex flex-col items-center gap-6">
        <Controls
          onGenerate={handleGenerate}
          onStart={solve}
          onReset={handleReset}
          isSolving={isSolving}
          isSolved={isSolved}
          mazeSize={mazeSize}
          setMazeSize={setMazeSize}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
        />
        
        {pathExists === false && (
          <div className="text-red-500 font-bold bg-red-900/50 border border-red-700 px-4 py-2 rounded-lg">
            No Path Found!
          </div>
        )}
        
        <div className="w-full flex flex-col md:flex-row justify-center items-start gap-6">
            <MazeGrid 
              maze={maze} 
              size={mazeSize} 
              startPos={startPos}
              endPos={endPos}
              isSolving={isSolving}
              onCellClick={handleCellClick}
            />
            <StatsPanel 
              steps={stats.steps}
              backtracks={stats.backtracks}
              pathLength={stats.pathLength}
              time={stats.time}
              algorithm={algorithm}
            />
        </div>

        {algorithmInfo && !isSolving && (
           <p className="text-center text-cyan-400 mt-2 h-6">{algorithmInfo.split('|')[0]}</p>
        )}
         {isSolving && (
           <p className="text-center text-cyan-400 mt-2 h-6">{algorithmInfo}</p>
        )}

        <Legend />
      </main>
    </div>
  );
};

export default App;
