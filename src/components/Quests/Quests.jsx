import React, { useState } from 'react';
import { calculateExp, calculateStats } from '../../utils/calculations';
import { addExperience } from '../../utils/experienceSystem';
import { GOLD_REWARDS } from '../../utils/constants';
import { EXERCISES } from '../../data/exercises';

const Quests = ({ gameData, updateGameData }) => {
  const { player, history, systemMessages, skills, settings } = gameData;
  const [inputValues, setInputValues] = useState({});
  const [weightEnabled, setWeightEnabled] = useState({});
  const [selectedExercise, setSelectedExercise] = useState('pullups');

  const handleInputChange = (value) => {
    setInputValues({ ...inputValues, [selectedExercise]: value });
  };

  const handleAddProgress = () => {
    const value = parseFloat(inputValues[selectedExercise] || 0);
    if (value <= 0) return;

    const exercise = EXERCISES[selectedExercise];
    const hasWeight = weightEnabled[selectedExercise] || false;

    // Calculate EXP
    const exp = calculateExp(selectedExercise, value, hasWeight, skills);

    // Update exercise history
    const updatedHistory = { ...history.exerciseHistory };
    if (!updatedHistory[selectedExercise]) {
      updatedHistory[selectedExercise] = { total: 0, withWeight: [] };
    }
    updatedHistory[selectedExercise].total += value;

    // Track today's progress
    if (!updatedHistory[selectedExercise].today) {
      updatedHistory[selectedExercise].today = 0;
    }
    updatedHistory[selectedExercise].today += value;

    if (hasWeight) {
      updatedHistory[selectedExercise].withWeight.push({ value, date: Date.now() });
    }

    // Add experience
    const { updatedPlayer, newMessages } = addExperience(player, exp, systemMessages);

    // Update stats
    const newStats = calculateStats(updatedHistory);
    updatedPlayer.stats = newStats;

    // Award gold
    updatedPlayer.gold += 5; // Small gold reward per exercise

    newMessages.push({
      timestamp: Date.now(),
      message: `+${value} ${exercise.name} completed! +${exp} EXP, +5 Gold`,
      type: 'progress',
    });

    updateGameData({
      ...gameData,
      player: updatedPlayer,
      history: {
        ...history,
        exerciseHistory: updatedHistory,
        totalWorkouts: history.totalWorkouts + 1,
      },
      systemMessages: newMessages,
    });

    // Clear input
    setInputValues({ ...inputValues, [selectedExercise]: '' });
  };

  const handleResetToday = (exerciseId) => {
    if (!window.confirm(`Скинути сьогоднішній прогрес для ${EXERCISES[exerciseId].nameUA}?`)) {
      return;
    }

    const todayValue = getTodayProgress(exerciseId);
    if (todayValue === 0) return;

    // Update exercise history
    const updatedHistory = { ...history.exerciseHistory };
    if (updatedHistory[exerciseId]) {
      updatedHistory[exerciseId].total -= todayValue;
      updatedHistory[exerciseId].today = 0;
    }

    // Recalculate stats
    const newStats = calculateStats(updatedHistory);

    // Remove EXP (approximate based on today's value)
    const exercise = EXERCISES[exerciseId];
    const lostExp = calculateExp(exerciseId, todayValue, false, skills);

    const updatedPlayer = {
      ...player,
      exp: Math.max(0, player.exp - lostExp),
      gold: Math.max(0, player.gold - 5),
      stats: newStats,
    };

    const newMessages = [...systemMessages];
    newMessages.push({
      timestamp: Date.now(),
      message: `Скинуто ${todayValue} ${exercise.nameUA}. -${lostExp} EXP`,
      type: 'reset',
    });

    updateGameData({
      ...gameData,
      player: updatedPlayer,
      history: {
        ...history,
        exerciseHistory: updatedHistory,
      },
      systemMessages: newMessages,
    });
  };

  const handleEditToday = (exerciseId) => {
    const currentValue = getTodayProgress(exerciseId);
    const newValue = prompt(
      `Введіть нове значення для ${EXERCISES[exerciseId].nameUA} (поточне: ${currentValue}):`,
      currentValue
    );

    if (newValue === null) return; // Cancelled

    const parsedValue = parseFloat(newValue);
    if (isNaN(parsedValue) || parsedValue < 0) {
      alert('Невірне значення!');
      return;
    }

    const todayValue = getTodayProgress(exerciseId);
    const difference = parsedValue - todayValue;

    if (difference === 0) return;

    // Update exercise history
    const updatedHistory = { ...history.exerciseHistory };
    if (!updatedHistory[exerciseId]) {
      updatedHistory[exerciseId] = { total: 0, withWeight: [] };
    }

    updatedHistory[exerciseId].total += difference;
    updatedHistory[exerciseId].today = parsedValue;

    // Recalculate stats
    const newStats = calculateStats(updatedHistory);

    // Adjust EXP
    const expChange = calculateExp(exerciseId, Math.abs(difference), false, skills);
    const updatedPlayer = {
      ...player,
      exp: difference > 0 ? player.exp + expChange : Math.max(0, player.exp - expChange),
      stats: newStats,
    };

    const newMessages = [...systemMessages];
    newMessages.push({
      timestamp: Date.now(),
      message: `Відредаговано ${EXERCISES[exerciseId].nameUA}: ${parsedValue} (${difference > 0 ? '+' : ''}${difference})`,
      type: 'edit',
    });

    updateGameData({
      ...gameData,
      player: updatedPlayer,
      history: {
        ...history,
        exerciseHistory: updatedHistory,
      },
      systemMessages: newMessages,
    });
  };

  const getTodayProgress = (exerciseId) => {
    return history.exerciseHistory[exerciseId]?.today || 0;
  };

  const getTotalProgress = (exerciseId) => {
    return history.exerciseHistory[exerciseId]?.total || 0;
  };

  const getGoal = (exerciseId) => {
    return settings.goals[exerciseId] || 50;
  };

  const allExercises = Object.values(EXERCISES);

  return (
    <div className="space-y-6">
      <div className="border-2 border-neon-blue p-6 bg-system-darker glow-border">
        <h2 className="text-2xl text-neon-blue font-bold mb-6">QUEST TRACKER</h2>

        {/* Exercise Selector */}
        <div className="mb-6">
          <h3 className="text-neon-cyan mb-3">SELECT EXERCISE</h3>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full bg-gray-800 border-2 border-neon-blue px-4 py-3 text-white text-lg font-mono"
          >
            {allExercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.nameUA} ({exercise.name})
              </option>
            ))}
          </select>
        </div>

        {/* Add Progress */}
        <div className="border-2 border-neon-cyan p-4 bg-black/30 mb-6">
          <h3 className="text-neon-cyan mb-3">ADD PROGRESS</h3>
          <div className="flex gap-3">
            <input
              type="number"
              value={inputValues[selectedExercise] || ''}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={`Enter ${EXERCISES[selectedExercise].type === 'reps' ? 'reps' : EXERCISES[selectedExercise].type === 'time' ? 'seconds' : 'km'}`}
              className="flex-1 bg-gray-800 border border-gray-600 px-4 py-3 text-white text-lg"
            />
            {EXERCISES[selectedExercise].canHaveWeight && (
              <label className="flex items-center gap-2 px-4 text-white border border-gray-600 bg-gray-800">
                <input
                  type="checkbox"
                  checked={weightEnabled[selectedExercise] || false}
                  onChange={(e) =>
                    setWeightEnabled({ ...weightEnabled, [selectedExercise]: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                +Weight
              </label>
            )}
            <button
              onClick={handleAddProgress}
              className="bg-neon-blue hover:bg-neon-cyan text-black px-8 py-3 font-bold text-lg transition"
            >
              ADD
            </button>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="mb-6">
          <h3 className="text-yellow-400 mb-3 text-lg">TODAY'S PROGRESS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allExercises.map((exercise) => {
              const today = getTodayProgress(exercise.id);
              const goal = getGoal(exercise.id);
              const percentage = Math.min((today / goal) * 100, 100);

              return (
                <div key={exercise.id} className="border border-gray-600 p-3 bg-black/50">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm text-gray-400">{exercise.nameUA}</div>
                    {today > 0 && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditToday(exercise.id)}
                          className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 border border-blue-400 hover:border-blue-300"
                          title="Редагувати"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleResetToday(exercise.id)}
                          className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-400 hover:border-red-300"
                          title="Скинути"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-lg text-white font-bold">
                    {today} / {goal}
                    {exercise.type === 'reps' ? ' reps' : exercise.type === 'time' ? ' sec' : ' km'}
                  </div>
                  <div className="w-full bg-gray-700 h-2 mt-2">
                    <div
                      className="bg-yellow-400 h-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All-Time Stats */}
        <div>
          <h3 className="text-purple-400 mb-3 text-lg">ALL-TIME STATS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allExercises.map((exercise) => {
              const total = getTotalProgress(exercise.id);

              return (
                <div key={exercise.id} className="border border-purple-600 p-3 bg-purple-900/10">
                  <div className="text-sm text-gray-400 mb-1">{exercise.nameUA}</div>
                  <div className="text-xl text-purple-300 font-bold">
                    {total.toFixed(1)}
                    {exercise.type === 'reps' ? ' reps' : exercise.type === 'time' ? ' sec' : ' km'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quests;
