// Experience values for each exercise
export const EXP_VALUES = {
  pullups: 2,
  bars: 2,
  squats: 1,
  lunges: 1.5,
  situps: 1,
  plank: 0.5, // per second
  running: 10, // per km
  walking: 5, // per km
  shoulders: 3,
};

// Bonus EXP
export const BONUS_EXP = {
  dailyComplete: 50,
  streak3: 25,
  streak7: 100,
};

// Level requirements
export const getLevelRequirement = (level) => {
  return 50 + (level * 25);
};

// Ranks
export const RANKS = {
  E: { min: 1, max: 9, color: '#8b8b8b' },
  D: { min: 10, max: 19, color: '#4169e1' },
  C: { min: 20, max: 29, color: '#9370db' },
  B: { min: 30, max: 39, color: '#ff69b4' },
  A: { min: 40, max: 49, color: '#ffd700' },
  S: { min: 50, max: 999, color: '#ff0000' },
};

export const getRank = (level) => {
  for (const [rank, data] of Object.entries(RANKS)) {
    if (level >= data.min && level <= data.max) {
      return rank;
    }
  }
  return 'E';
};

// Stat progression requirements
export const STAT_REQUIREMENTS = {
  STR: 50, // per 50 pullups or bars
  END: 100, // per 100 squats/lunges/planks
  AGI: 5, // per 5km running
  INT: 10, // per 10 daily quest completions
  WIL: 3, // per 3-day streak
};

// Gold rewards
export const GOLD_REWARDS = {
  dailyQuest: 10,
  weeklyQuest: 50,
  achievement: 25,
  bigAchievement: 100,
};

// Days of week
export const DAYS = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
};

// Default exercise targets
export const DEFAULT_TARGETS = {
  pullups: 50,
  bars: 50,
  situps: 50,
  squats: 50,
  lunges: 100,
  shoulders: 50,
  plank: 60, // seconds
  running: 1, // km
  walking: 5, // km
};
