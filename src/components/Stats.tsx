import React from 'react';
import { Timer, Calendar } from 'lucide-react';

interface StatsProps {
  completedSessions: number;
  totalSessionsToday: number;
}

export const Stats: React.FC<StatsProps> = ({ completedSessions, totalSessionsToday }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Timer className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium">Total Sessions</h3>
          </div>
          <p className="text-3xl font-bold">{completedSessions}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium">Today's Sessions</h3>
          </div>
          <p className="text-3xl font-bold">{totalSessionsToday}</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
        <h3 className="font-medium mb-4">Session History</h3>
        <div className="space-y-2">
          {Array.from({ length: Math.min(5, completedSessions) }).map((_, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span>Session {completedSessions - i}</span>
              <span className="text-gray-500">Completed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};