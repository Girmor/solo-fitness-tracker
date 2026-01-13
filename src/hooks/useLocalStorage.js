import { useState, useEffect } from 'react';

// Custom hook for localStorage
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

// Initialize default player data
export const getDefaultPlayerData = () => ({
  player: {
    name: 'USER',
    level: 1,
    exp: 0,
    rank: 'E',
    gold: 0,
    stats: { STR: 0, END: 0, AGI: 0, INT: 0, WIL: 0 },
    region: 'UKRAINE',
    createdAt: Date.now(),
  },
  quests: {
    daily: [],
    weekly: [],
    lastReset: null,
  },
  streak: {
    current: 0,
    best: 0,
    lastCompletedDate: null,
  },
  history: {
    totalWorkouts: 0,
    dailyCompletions: 0,
    exerciseHistory: {},
    bestStreak: 0,
    dailyHistory: [], // Array of { date: 'YYYY-MM-DD', exercises: {}, totalExp: 0 }
    weeklyHistory: [], // Array of { week: 'YYYY-Wxx', exercises: {}, totalExp: 0 }
  },
  skills: [],
  achievements: [],
  settings: {
    schedule: {
      mondayExercise: 'bars',
      tuesdayExercise: 'pullups',
      wednesdayExercise: 'bars',
      thursdayExercise: 'pullups',
      fridayExercise: 'bars',
      restDays: ['saturday', 'sunday'],
    },
    goals: {
      pullups: 50,
      bars: 50,
      situps: 50,
      squats: 50,
      lunges: 100,
      shoulders: 50,
      plank: 60,
      running: 1,
      walking: 5,
    },
    weightTracking: {
      enabled: false,
      exercises: ['pullups', 'bars'],
    },
    theme: {
      mode: 'dark',
      colorScheme: 'blue',
      fontSize: 'medium',
    },
    notifications: {
      enabled: false,
      time: '09:00',
      soundEffects: true,
    },
    language: 'ua',
  },
  systemMessages: [
    {
      timestamp: Date.now(),
      message: 'System booted. Welcome to The System.',
      type: 'system',
    },
  ],
});
