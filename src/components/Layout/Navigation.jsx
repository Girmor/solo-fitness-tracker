import React from 'react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'stats', label: 'Stats' },
    { id: 'quests', label: 'Quests' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <nav className="bg-system-darker border-b border-neon-blue/30">
      <div className="container mx-auto flex justify-center gap-2 p-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`px-6 py-2 font-mono text-sm transition-all ${
              currentPage === item.id
                ? 'bg-neon-blue/20 border-2 border-neon-blue text-neon-blue glow-text'
                : 'border-2 border-gray-600 text-gray-400 hover:border-neon-blue/50 hover:text-neon-blue/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
