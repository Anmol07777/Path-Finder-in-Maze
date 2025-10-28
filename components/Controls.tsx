import React from 'react';
import { MazeSize, AnimationSpeed, Algorithm } from '../types';
import { MAZE_SIZES, ANIMATION_SPEEDS, ALGORITHMS } from '../constants';

interface ControlsProps {
  onGenerate: () => void;
  onStart: () => void;
  onReset: () => void;
  isSolving: boolean;
  isSolved: boolean;
  mazeSize: MazeSize;
  setMazeSize: (size: MazeSize) => void;
  animationSpeed: AnimationSpeed;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  algorithm: Algorithm;
  setAlgorithm: (algorithm: Algorithm) => void;
}

const ControlButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode; className?: string }> = ({ onClick, disabled, children, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 text-sm md:text-base font-bold text-cyan-300 uppercase border-2 border-cyan-400 rounded-md transition-all duration-300
      hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(0,255,255,0.6)]
      focus:outline-none focus:ring-2 focus:ring-cyan-300
      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-cyan-300 disabled:hover:shadow-none ${className}`}
  >
    {children}
  </button>
);

const SettingToggle: React.FC<{ label: string, value: any, options: { label: string, value: any }[], setter: (val: any) => void, disabled: boolean }> = ({ label, value, options, setter, disabled }) => (
    <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4">
        <span className="text-gray-400 font-semibold uppercase tracking-wider text-sm">{label}:</span>
        <div className="flex bg-gray-900 border border-gray-700 rounded-md p-1">
            {options.map(option => (
                <button
                    key={option.label}
                    onClick={() => setter(option.value)}
                    disabled={disabled}
                    className={`px-3 py-1 text-xs md:text-sm rounded transition-colors duration-200 ${
                        value === option.value ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700'
                    } disabled:opacity-50 disabled:hover:bg-transparent`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
);


const Controls: React.FC<ControlsProps> = ({
  onGenerate,
  onStart,
  onReset,
  isSolving,
  isSolved,
  mazeSize,
  setMazeSize,
  animationSpeed,
  setAnimationSpeed,
  algorithm,
  setAlgorithm,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 p-4 bg-black/30 border border-gray-800 rounded-lg">
        <SettingToggle
          label="Algorithm"
          value={algorithm}
          options={ALGORITHMS.map(a => ({label: a.shortLabel, value: a.value}))}
          setter={setAlgorithm}
          disabled={isSolving}
        />
        <SettingToggle
          label="Size"
          value={mazeSize}
          options={MAZE_SIZES.map(s => ({label: `${s}x${s}`, value: s}))}
          setter={setMazeSize}
          disabled={isSolving}
        />
        <SettingToggle
          label="Speed"
          value={animationSpeed}
          options={ANIMATION_SPEEDS}
          setter={setAnimationSpeed}
          disabled={isSolving}
        />
      </div>
       <div className="flex flex-wrap justify-center gap-4">
        <ControlButton onClick={onGenerate} disabled={isSolving}>
          Generate Maze
        </ControlButton>
        <ControlButton onClick={onStart} disabled={isSolving || isSolved} className="text-lime-300 border-lime-400 hover:bg-lime-400 hover:shadow-[0_0_15px_rgba(132,204,22,0.6)] focus:ring-lime-300 disabled:hover:text-lime-300">
          Start Pathfinding
        </ControlButton>
        <ControlButton onClick={onReset} disabled={isSolving}>
          Reset
        </ControlButton>
      </div>
    </div>
  );
};

export default Controls;
