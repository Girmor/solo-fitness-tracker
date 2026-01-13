import React from 'react';
import { calculateStats } from '../../utils/calculations';

const Stats = ({ gameData }) => {
  const { player, history, streak } = gameData;
  const stats = calculateStats(history.exerciseHistory);

  const statsList = [
    { name: 'STR', value: stats.STR, color: 'text-red-500' },
    { name: 'END', value: stats.END, color: 'text-green-500' },
    { name: 'AGI', value: stats.AGI, color: 'text-yellow-500' },
    { name: 'INT', value: stats.INT, color: 'text-blue-500' },
    { name: 'WIL', value: stats.WIL, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Display */}
      <div className="border-2 border-neon-blue p-6 bg-system-darker glow-border">
        <h2 className="text-2xl text-neon-blue font-bold mb-6">CHARACTER STATS</h2>
        <div className="grid grid-cols-5 gap-4">
          {statsList.map((stat) => (
            <div key={stat.name} className="border border-gray-600 p-4 text-center bg-black/30">
              <div className={`text-sm ${stat.color} font-bold mb-2`}>{stat.name}</div>
              <div className="text-3xl text-white font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Level Progress */}
      <div className="border-2 border-neon-blue p-6 bg-system-darker">
        <h3 className="text-neon-cyan mb-4">[LVL] Level {player.level}</h3>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-400">LEVEL PROGRESS</span>
          <span className="text-neon-cyan">{player.exp} / {50 + player.level * 25} EXP</span>
        </div>
        <div className="w-full bg-gray-800 h-8 relative">
          <div
            className="bg-gradient-to-r from-neon-blue to-neon-cyan h-full transition-all"
            style={{ width: `${(player.exp / (50 + player.level * 25)) * 100}%` }}
          />
        </div>
        <div className="mt-4 text-right text-sm text-gray-400">
          Next Rank at Level {Math.ceil(player.level / 10) * 10}
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-gray-600 p-6 bg-system-darker">
          <h4 className="text-neon-cyan text-sm mb-4">CURRENT STREAK</h4>
          <div className="text-6xl text-neon-cyan font-bold">{streak.current}</div>
          <div className="text-sm text-gray-400 mt-2">DAYS</div>
        </div>

        <div className="border-2 border-gray-600 p-6 bg-system-darker">
          <h4 className="text-yellow-500 text-sm mb-4">BEST STREAK</h4>
          <div className="text-6xl text-yellow-500 font-bold">{streak.best}</div>
          <div className="text-sm text-gray-400 mt-2">DAYS</div>
        </div>
      </div>

      {/* Rank Info */}
      <div className="border-2 border-gray-600 p-6 bg-system-darker">
        <h3 className="text-neon-cyan mb-4">[RANK] Rank info</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Current rank</span>
            <span className="text-rank-e font-bold text-lg">{player.rank}-Class ({player.rank})</span>
          </div>
          <div className="text-gray-400 text-sm">
            Next rank {player.level < 10 ? 'D' : player.level < 20 ? 'C' : player.level < 30 ? 'B' : player.level < 40 ? 'A' : 'S'}-Class requires Level {Math.ceil(player.level / 10) * 10}.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
