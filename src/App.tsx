import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Settings as SettingsIcon, BarChart } from 'lucide-react';
import { TimerDisplay } from './components/TimerDisplay';
import { Settings } from './components/Settings';
import { Stats } from './components/Stats';
import { useTimer } from './hooks/useTimer';
import { useTheme } from './hooks/useTheme';

type Tab = 'timer' | 'settings' | 'stats';

function App() {
  const { state, settings, setSettings, toggleTimer, resetTimer } = useTimer();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('timer');

  const progress = state.timeLeft / (
    state.mode === 'work' ? settings.workDuration :
    state.mode === 'break' ? settings.breakDuration :
    settings.longBreakDuration
  );

  const tabs = [
    { id: 'timer', label: 'Timer', icon: TimerIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'stats', label: 'Statistics', icon: BarChart },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <nav className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm mb-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 transition-colors ${
                  activeTab === id
                    ? 'bg-indigo-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {activeTab === 'timer' && (
              <div className="flex flex-col items-center space-y-8">
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      state.mode === 'work'
                        ? 'bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => resetTimer('work')}
                  >
                    Work
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      state.mode === 'break'
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => resetTimer('break')}
                  >
                    Break
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      state.mode === 'longBreak'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => resetTimer('longBreak')}
                  >
                    Long Break
                  </button>
                </div>

                <TimerDisplay
                  timeLeft={state.timeLeft}
                  mode={state.mode}
                  progress={progress}
                />

                <div className="flex space-x-4">
                  <button
                    onClick={toggleTimer}
                    className="flex items-center space-x-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                  >
                    {state.isRunning ? (
                      <>
                        <Pause className="w-5 h-5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Start</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => resetTimer(state.mode)}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <Settings settings={settings} onSettingsChange={setSettings} />
            )}

            {activeTab === 'stats' && (
              <Stats
                completedSessions={state.completedSessions}
                totalSessionsToday={state.totalSessionsToday}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;