import React from 'react';
import { Circle } from 'lucide-react';
import { TimerMode } from '../types/timer';

interface TimerDisplayProps {
  timeLeft: number;
  mode: TimerMode;
  progress: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, mode, progress }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getColor = () => {
    switch (mode) {
      case 'work':
        return 'text-rose-500 dark:text-rose-400';
      case 'break':
        return 'text-emerald-500 dark:text-emerald-400';
      case 'longBreak':
        return 'text-blue-500 dark:text-blue-400';
    }
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      <svg className="absolute w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="48%"
          className="fill-none stroke-gray-200 dark:stroke-gray-700"
          strokeWidth="4"
        />
        <circle
          cx="50%"
          cy="50%"
          r="48%"
          className={`fill-none ${getColor()} transition-all duration-1000`}
          strokeWidth="4"
          strokeDasharray={`${progress * 301.59} 301.59`}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-5xl font-bold tracking-wider">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};