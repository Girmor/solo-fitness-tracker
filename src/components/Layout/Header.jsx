import React from 'react';

const Header = ({ player }) => {
  return (
    <header className="bg-system-darker border-b-2 border-neon-blue p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neon-blue glow-text">THE SYSTEM</h1>
          <div className="text-sm">
            <span className="text-neon-cyan">Rank {player.rank}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-gray-400">Lv {player.level}</div>
            <div className="text-sm text-white">{player.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold text-xl">●</span>
            <span className="text-gold font-bold">{player.gold}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
