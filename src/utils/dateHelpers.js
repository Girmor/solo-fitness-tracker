// Check if date is today
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

// Check if date is yesterday
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === yesterday.getDate() &&
    checkDate.getMonth() === yesterday.getMonth() &&
    checkDate.getFullYear() === yesterday.getFullYear()
  );
};

// Get day of week (0 = Sunday, 1 = Monday, etc.)
export const getDayOfWeek = () => {
  return new Date().getDay();
};

// Check if it's a rest day (Saturday or Sunday)
export const isRestDay = () => {
  const day = getDayOfWeek();
  return day === 0 || day === 6; // Sunday or Saturday
};

// Get formatted date string
export const getFormattedDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Check if should reset daily quests
export const shouldResetDaily = (lastResetDate) => {
  if (!lastResetDate) return true;
  return !isToday(lastResetDate);
};

// Get days between dates
export const getDaysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Get alternating exercise for the day (bars/pullups)
export const getDailyUpperExercise = () => {
  const startDate = new Date('2024-01-01'); // Reference date
  const today = new Date();
  const daysSinceStart = getDaysBetween(startDate, today);

  // Alternate: even days = bars, odd days = pullups
  return daysSinceStart % 2 === 0 ? 'bars' : 'pullups';
};
