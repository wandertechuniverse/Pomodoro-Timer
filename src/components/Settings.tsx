import React from 'react';
import { Moon, Sun, Bell, BellOff } from 'lucide-react';
import { TimerSettings } from '../types/timer';
import { useTheme } from '../hooks/useTheme';

interface SettingsProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
  const { darkMode, setDarkMode } = useTheme();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    onSettingsChange({ ...settings, darkMode: !darkMode });
  };

  const toggleNotifications = async () => {
    if (!settings.notifications && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onSettingsChange({ ...settings, notifications: true });
      }
    } else {
      onSettingsChange({ ...settings, notifications: !settings.notifications });
    }
  };

  const updateDuration = (key: keyof Pick<TimerSettings, 'workDuration' | 'breakDuration' | 'longBreakDuration'>, minutes: number) => {
    onSettingsChange({ ...settings, [key]: minutes * 60 });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Settings</h2>
        <div className="flex space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle notifications"
          >
            {settings.notifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Work Duration (minutes)</span>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.workDuration / 60}
              onChange={(e) => updateDuration('workDuration', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Break Duration (minutes)</span>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.breakDuration / 60}
              onChange={(e) => updateDuration('breakDuration', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Long Break Duration (minutes)</span>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.longBreakDuration / 60}
              onChange={(e) => updateDuration('longBreakDuration', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Sessions Until Long Break</span>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.sessionsUntilLongBreak}
              onChange={(e) => onSettingsChange({ ...settings, sessionsUntilLongBreak: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
            />
          </label>
        </div>
      </div>
    </div>
  );
};