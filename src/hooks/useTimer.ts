import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, TimerSettings, TimerState } from '../types/timer';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsUntilLongBreak: 4,
  notifications: true,
  darkMode: false,
};

export const useTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem('pomodoroSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [state, setState] = useState<TimerState>({
    mode: 'work',
    timeLeft: settings.workDuration,
    isRunning: false,
    completedSessions: 0,
    totalSessionsToday: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  const notify = useCallback(() => {
    if (settings.notifications) {
      audioRef.current?.play().catch(() => {
        // Ignore audio play errors
      });
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: `${state.mode === 'work' ? 'Break' : 'Work'} time!`,
          icon: '/favicon.ico',
        });
      }
    }
  }, [settings.notifications, state.mode]);

  const switchMode = useCallback(() => {
    const newCompletedSessions = state.mode === 'work' ? state.completedSessions + 1 : state.completedSessions;
    const shouldTakeLongBreak = newCompletedSessions % settings.sessionsUntilLongBreak === 0;
    
    let newMode: TimerMode;
    let newTimeLeft: number;

    if (state.mode === 'work') {
      newMode = shouldTakeLongBreak ? 'longBreak' : 'break';
      newTimeLeft = shouldTakeLongBreak ? settings.longBreakDuration : settings.breakDuration;
    } else {
      newMode = 'work';
      newTimeLeft = settings.workDuration;
    }

    setState(prev => ({
      ...prev,
      mode: newMode,
      timeLeft: newTimeLeft,
      completedSessions: newCompletedSessions,
      totalSessionsToday: prev.totalSessionsToday + (state.mode === 'work' ? 1 : 0),
    }));

    notify();
  }, [state, settings, notify]);

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.timeLeft <= 1) {
        switchMode();
        return prev;
      }
      return { ...prev, timeLeft: prev.timeLeft - 1 };
    });
  }, [switchMode]);

  const toggleTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const resetTimer = useCallback((mode: TimerMode = 'work') => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({
      ...prev,
      timeLeft: mode === 'work' ? settings.workDuration :
                mode === 'break' ? settings.breakDuration :
                settings.longBreakDuration,
      isRunning: false,
      mode,
    }));
  }, [settings]);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = window.setInterval(tick, 1000);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning, tick]);

  return {
    state,
    settings,
    setSettings,
    toggleTimer,
    resetTimer,
  };
};