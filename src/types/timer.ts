export type TimerMode = 'work' | 'break' | 'longBreak';

export interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  notifications: boolean;
  darkMode: boolean;
}

export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  completedSessions: number;
  totalSessionsToday: number;
}