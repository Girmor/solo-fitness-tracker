import React, { useEffect } from 'react';

const Skills = ({ gameData }) => {
  const { skills, history } = gameData;

  // Debug: Log history changes
  useEffect(() => {
    console.log('Skills - History updated:', history.exerciseHistory);
  }, [history.exerciseHistory]);

  const calculateProgress = (skill) => {
    let current = 0;

    switch (skill.requirementType) {
      case 'total_pushups_bars':
        current = (history.exerciseHistory.pullups?.total || 0) + (history.exerciseHistory.bars?.total || 0);
        return { current, percentage: (current / skill.requirement) * 100 };
      case 'total_situps':
        current = history.exerciseHistory.situps?.total || 0;
        return { current, percentage: (current / skill.requirement) * 100 };
      case 'total_squats':
        current = history.exerciseHistory.squats?.total || 0;
        return { current, percentage: (current / skill.requirement) * 100 };
      case 'total_running_km':
        current = history.exerciseHistory.running?.total || 0;
        return { current, percentage: (current / skill.requirement) * 100 };
      case 'daily_streak':
        current = history.dailyCompletions || 0;
        return { current, percentage: (current / skill.requirement) * 100 };
      case 'total_workouts':
        current = history.totalWorkouts || 0;
        return { current, percentage: (current / skill.requirement) * 100 };
      case 'single_quest_reps':
        return { current: 0, percentage: 0 }; // Would need to track this separately
      default:
        return { current: 0, percentage: 0 };
    }
  };

  const unlockedCount = skills.filter(s => s.unlocked).length;

  return (
    <div className="space-y-6">
      <div className="border-2 border-neon-blue p-6 bg-system-darker glow-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-neon-blue font-bold">Skills</h2>
          <div className="text-neon-cyan">Mastered {unlockedCount}/{skills.length}</div>
        </div>
        <p className="text-gray-400 text-sm mb-6">Unlock passive abilities by completing challenges.</p>

        <div className="space-y-4">
          {skills.map((skill) => {
            const { current, percentage } = calculateProgress(skill);
            const progress = Math.min(percentage, 100);
            const isUnlocked = progress >= 100 || skill.unlocked;

            return (
              <div
                key={skill.id}
                className={`border-2 p-4 ${
                  isUnlocked
                    ? 'border-green-500 bg-green-900/20'
                    : 'border-gray-600 bg-black/30'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-bold text-lg">{skill.nameUA || skill.name}</h3>
                    <p className="text-gray-400 text-sm">{skill.descriptionUA || skill.description}</p>
                  </div>
                  <div className={`text-right ${isUnlocked ? 'text-green-500' : 'text-gray-500'}`}>
                    {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    <div className="text-xs mt-1">{progress.toFixed(0)}%</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-400 mb-1 flex justify-between">
                    <span>Requirement: {skill.requirementTextUA || skill.requirementText}</span>
                    <span className="text-neon-cyan">{current.toFixed(1)} / {skill.requirement}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-4 relative">
                    <div
                      className={`h-full transition-all ${
                        isUnlocked ? 'bg-green-500' : 'bg-neon-blue'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Skills;
