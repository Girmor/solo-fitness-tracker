import { EXP_VALUES, BONUS_EXP, getLevelRequirement, getRank, STAT_REQUIREMENTS } from './constants.js';

// Calculate EXP for an exercise
export const calculateExp = (exerciseId, value, withWeight = false, skills = []) => {
  let baseExp = EXP_VALUES[exerciseId] * value;

  // Apply weight bonus (10% more exp)
  if (withWeight) {
    baseExp *= 1.1;
  }

  // Apply skill bonuses
  let expMultiplier = 1;

  // Check for exercise-specific bonuses
  const exerciseBonus = skills.find(
    skill => skill.unlocked && skill.effect === 'exp_bonus' && skill.affectedExercises.includes(exerciseId)
  );
  if (exerciseBonus) {
    expMultiplier += exerciseBonus.effectValue;
  }

  // Check for global exp bonus
  const globalBonus = skills.find(
    skill => skill.unlocked && skill.effect === 'global_exp_bonus'
  );
  if (globalBonus) {
    expMultiplier += globalBonus.effectValue;
  }

  return Math.floor(baseExp * expMultiplier);
};

// Calculate level from total EXP
export const calculateLevel = (totalExp) => {
  let level = 1;
  let expNeeded = 0;

  while (expNeeded <= totalExp) {
    expNeeded += getLevelRequirement(level);
    if (expNeeded <= totalExp) {
      level++;
    }
  }

  return level;
};

// Get EXP needed for next level
export const getExpForNextLevel = (currentLevel) => {
  return getLevelRequirement(currentLevel);
};

// Get current EXP progress in current level
export const getCurrentLevelProgress = (totalExp) => {
  let level = 1;
  let expUsed = 0;

  while (true) {
    const expForThisLevel = getLevelRequirement(level);
    if (expUsed + expForThisLevel > totalExp) {
      return {
        level,
        currentExp: totalExp - expUsed,
        expNeeded: expForThisLevel,
        progress: ((totalExp - expUsed) / expForThisLevel) * 100,
      };
    }
    expUsed += expForThisLevel;
    level++;
  }
};

// Calculate stats based on exercise history
export const calculateStats = (history) => {
  const stats = {
    STR: 0,
    END: 0,
    AGI: 0,
    INT: 0,
    WIL: 0,
  };

  // STR: +1 per 50 pullups/bars
  const upperBodyTotal = (history.pullups?.total || 0) + (history.bars?.total || 0);
  stats.STR = Math.floor(upperBodyTotal / STAT_REQUIREMENTS.STR);

  // END: +1 per 100 squats/lunges/plank seconds
  const lowerBodyTotal =
    (history.squats?.total || 0) +
    (history.lunges?.total || 0) +
    (history.plank?.total || 0);
  stats.END = Math.floor(lowerBodyTotal / STAT_REQUIREMENTS.END);

  // AGI: +1 per 5km running
  const runningTotal = history.running?.total || 0;
  stats.AGI = Math.floor(runningTotal / STAT_REQUIREMENTS.AGI);

  // INT: +1 per 10 daily completions
  const dailyCompletions = history.dailyCompletions || 0;
  stats.INT = Math.floor(dailyCompletions / STAT_REQUIREMENTS.INT);

  // WIL: +1 per streak of 3
  const bestStreak = history.bestStreak || 0;
  stats.WIL = Math.floor(bestStreak / STAT_REQUIREMENTS.WIL);

  return stats;
};

// Check if player leveled up
export const checkLevelUp = (oldExp, newExp) => {
  const oldLevel = calculateLevel(oldExp);
  const newLevel = calculateLevel(newExp);
  return newLevel > oldLevel ? { leveled: true, newLevel } : { leveled: false };
};

// Calculate modified target based on skills
export const calculateModifiedTarget = (exerciseId, baseTarget, skills) => {
  let reduction = 0;

  // Check for exercise-specific reduction
  const exerciseReduction = skills.find(
    skill => skill.unlocked && skill.effect === 'target_reduction' && skill.affectedExercises.includes(exerciseId)
  );
  if (exerciseReduction) {
    reduction += exerciseReduction.effectValue;
  }

  // Check for global reduction
  const globalReduction = skills.find(
    skill => skill.unlocked && skill.effect === 'global_target_reduction'
  );
  if (globalReduction) {
    reduction += globalReduction.effectValue;
  }

  return Math.floor(baseTarget * (1 - reduction));
};
