import { calculateExp, checkLevelUp } from './calculations.js';
import { BONUS_EXP } from './constants.js';

// Add experience and handle level ups
export const addExperience = (currentPlayer, amount, systemMessages) => {
  const oldExp = currentPlayer.exp;
  const newExp = oldExp + amount;

  const levelCheck = checkLevelUp(oldExp, newExp);

  const updatedPlayer = {
    ...currentPlayer,
    exp: newExp,
  };

  const newMessages = [...systemMessages];

  if (levelCheck.leveled) {
    updatedPlayer.level = levelCheck.newLevel;
    updatedPlayer.rank = getRank(levelCheck.newLevel);
    newMessages.push({
      timestamp: Date.now(),
      message: `🎉 LEVEL UP! You are now Level ${levelCheck.newLevel} (Rank ${updatedPlayer.rank})`,
      type: 'levelup',
    });
  }

  newMessages.push({
    timestamp: Date.now(),
    message: `+${amount} EXP gained`,
    type: 'exp',
  });

  return { updatedPlayer, newMessages, leveledUp: levelCheck.leveled };
};

// Process quest completion
export const processQuestCompletion = (quest, exerciseHistory, player, skills, systemMessages) => {
  const expGained = calculateExp(quest.id, quest.current, false, skills);

  // Update exercise history
  const updatedHistory = { ...exerciseHistory };
  if (!updatedHistory[quest.id]) {
    updatedHistory[quest.id] = { total: 0, withWeight: [] };
  }
  updatedHistory[quest.id].total += quest.current;

  // Add experience
  const { updatedPlayer, newMessages, leveledUp } = addExperience(player, expGained, systemMessages);

  return { updatedPlayer, updatedHistory, newMessages, leveledUp };
};

// Process daily quest completion bonus
export const processDailyCompletionBonus = (player, skills, systemMessages) => {
  let bonusAmount = BONUS_EXP.dailyComplete;

  // Check if Daily Completion skill is unlocked
  const dailySkill = skills.find(s => s.id === 'daily_completion' && s.unlocked);
  if (dailySkill) {
    bonusAmount += dailySkill.effectValue;
  }

  const { updatedPlayer, newMessages, leveledUp } = addExperience(player, bonusAmount, systemMessages);

  newMessages.push({
    timestamp: Date.now(),
    message: '✨ Daily quests completed! Bonus EXP awarded.',
    type: 'bonus',
  });

  return { updatedPlayer, newMessages, leveledUp };
};

// Process streak bonus
export const processStreakBonus = (streakCount, player, systemMessages) => {
  let bonusAmount = 0;
  let message = '';

  if (streakCount === 3) {
    bonusAmount = BONUS_EXP.streak3;
    message = '🔥 3-day streak! Bonus EXP awarded.';
  } else if (streakCount === 7) {
    bonusAmount = BONUS_EXP.streak7;
    message = '🔥🔥 7-day streak! Big bonus EXP awarded!';
  } else if (streakCount > 7 && streakCount % 7 === 0) {
    bonusAmount = BONUS_EXP.streak7;
    message = `🔥🔥 ${streakCount}-day streak! Keep going!`;
  }

  if (bonusAmount > 0) {
    const { updatedPlayer, newMessages, leveledUp } = addExperience(player, bonusAmount, systemMessages);

    newMessages.push({
      timestamp: Date.now(),
      message,
      type: 'streak',
    });

    return { updatedPlayer, newMessages, leveledUp };
  }

  return { updatedPlayer: player, newMessages: systemMessages, leveledUp: false };
};

function getRank(level) {
  if (level < 10) return 'E';
  if (level < 20) return 'D';
  if (level < 30) return 'C';
  if (level < 40) return 'B';
  if (level < 50) return 'A';
  return 'S';
}
