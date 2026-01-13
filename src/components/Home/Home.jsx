import React from 'react';
import { EXERCISES } from '../../data/exercises';

const Home = ({ gameData, updateGameData }) => {
  const { player, history, streak, systemMessages } = gameData;

  const getTodayProgress = (exerciseId) => {
    return history.exerciseHistory[exerciseId]?.today || 0;
  };

  const getTotalProgress = (exerciseId) => {
    return history.exerciseHistory[exerciseId]?.total || 0;
  };

  const allExercises = Object.values(EXERCISES);

  return (
    <div className="space-y-6">
      {/* Player Card */}
      <div className="border-2 border-neon-blue p-6 bg-system-darker glow-border">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-gray-400">PLAYER</div>
            <h2 className="text-3xl text-neon-cyan font-bold mb-2">{player.name}</h2>
            <div className="text-sm text-yellow-400">SYSTEM USER</div>
            <div className="mt-2 text-sm">
              <span className="text-rank-e">E-Class</span> (Rank {player.rank})
            </div>
            <div className="text-sm">Level: {player.level}</div>
            <div className="mt-4 bg-gray-800 h-6 w-full max-w-md relative">
              <div className="text-xs text-center absolute w-full top-1 text-white z-10">
                Level {player.level} ({player.exp} / {50 + player.level * 25} EXP)
              </div>
              <div
                className="bg-neon-blue h-full"
                style={{ width: `${(player.exp / (50 + player.level * 25)) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">GOLD</div>
            <div className="text-3xl text-gold">●</div>
            <div className="text-xl text-gold">{player.gold}</div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="border-2 border-yellow-500 p-6 bg-system-darker">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-yellow-400 font-bold">TODAY'S TRAINING</h3>
          <div className="text-yellow-300">
            {new Date().toLocaleDateString('uk-UA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allExercises.map((exercise) => {
            const today = getTodayProgress(exercise.id);

            if (today === 0) return null;

            return (
              <div key={exercise.id} className="border-2 border-yellow-500/50 p-3 bg-yellow-900/20">
                <div className="text-xs text-gray-400 mb-1">{exercise.nameUA}</div>
                <div className="text-2xl text-yellow-400 font-bold">
                  {today}
                  <span className="text-sm ml-1">
                    {exercise.type === 'reps' ? 'reps' : exercise.type === 'time' ? 'sec' : 'km'}
                  </span>
                </div>
              </div>
            );
          })}
          {allExercises.every(ex => getTodayProgress(ex.id) === 0) && (
            <div className="col-span-full text-center py-8 text-gray-400">
              <p className="text-xl mb-2">No training today yet</p>
              <p className="text-sm">Go to Quests to add your progress!</p>
            </div>
          )}
        </div>
      </div>

      {/* All-Time Statistics */}
      <div className="border-2 border-purple-500 p-6 bg-system-darker">
        <h3 className="text-xl text-purple-400 font-bold mb-4">ALL-TIME STATISTICS</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allExercises.map((exercise) => {
            const total = getTotalProgress(exercise.id);

            return (
              <div key={exercise.id} className="border border-purple-600 p-3 bg-purple-900/10">
                <div className="text-xs text-gray-400 mb-1">{exercise.nameUA}</div>
                <div className="text-xl text-purple-300 font-bold">
                  {total.toFixed(1)}
                  <span className="text-sm ml-1">
                    {exercise.type === 'reps' ? 'reps' : exercise.type === 'time' ? 'sec' : 'km'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Workouts */}
        <div className="mt-4 border-2 border-purple-500 p-4 bg-purple-900/20 text-center">
          <div className="text-sm text-gray-400">Total Workouts</div>
          <div className="text-4xl text-purple-400 font-bold">{history.totalWorkouts}</div>
        </div>
      </div>

      {/* Streak */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-gray-600 p-4 bg-system-darker">
          <div className="text-neon-cyan text-sm mb-2">CURRENT STREAK</div>
          <div className="text-4xl text-neon-cyan font-bold">{streak.current}</div>
          <div className="text-sm text-gray-400">Days</div>
        </div>

        <div className="border-2 border-gold p-4 bg-system-darker">
          <div className="text-gold text-sm mb-2">BEST STREAK</div>
          <div className="text-4xl text-gold font-bold">{streak.best}</div>
          <div className="text-sm text-gray-400">Days</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="border-2 border-neon-blue p-6 bg-system-darker">
        <h3 className="text-neon-cyan text-lg mb-4">CHARACTER STATS</h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(player.stats).map(([stat, value]) => (
            <div key={stat} className="border border-gray-600 p-3 text-center bg-black/30">
              <div className="text-xs text-gray-400 mb-1">{stat}</div>
              <div className="text-2xl text-neon-cyan font-bold">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Region */}
      <div className="border-2 border-gray-600 p-4 bg-system-darker text-center">
        <div className="text-xs text-gray-400 mb-2">REGION</div>
        <div className="text-3xl text-neon-cyan font-bold">{player.region}</div>
      </div>

      {/* System Messages */}
      <div className="border-2 border-gray-600 p-4 bg-system-darker">
        <div className="text-neon-cyan text-sm mb-3">SYSTEM MESSAGE FEED</div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {systemMessages.slice(-10).reverse().map((msg, index) => (
            <div key={index} className="text-xs text-gray-400">
              {msg.message}
            </div>
          ))}
        </div>
      </div>

      {/* System Update */}
      <div className="border-2 border-yellow-500 p-4 bg-yellow-900/10">
        <div className="flex justify-between items-center mb-2">
          <div className="text-yellow-500 font-bold">● SYSTEM UPDATE v2.4.0</div>
          <div className="text-xs text-gray-400">{new Date().toLocaleDateString()}</div>
        </div>
        <div className="text-sm">
          <div className="text-neon-cyan mb-1">PATCH NOTES: QUEST SYSTEM OVERHAUL</div>
          <ul className="text-gray-300 text-xs space-y-1">
            <li>• Manual Quest Selection - Choose any exercise to track</li>
            <li>• Today's Progress - See what you've accomplished today</li>
            <li>• All-Time Stats - Track your total progress</li>
            <li>• Customizable Goals - Set your own targets in Settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
