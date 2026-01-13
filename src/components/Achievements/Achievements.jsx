import React, { useEffect } from 'react';

const Achievements = ({ gameData }) => {
  const { achievements, player, history } = gameData;

  const checkAchievement = (achievement) => {
    switch (achievement.requirementType) {
      case 'quests_completed':
        return history.totalWorkouts >= achievement.requirement;
      case 'level':
        return player.level >= achievement.requirement;
      case 'streak':
        return history.bestStreak >= achievement.requirement;
      default:
        return false;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked || checkAchievement(a)).length;

  return (
    <div className="space-y-6">
      <div className="border-2 border-neon-blue p-6 bg-system-darker glow-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-neon-blue font-bold">Achievements</h2>
          <div className="text-neon-cyan">Unlocked {unlockedCount}/{achievements.length}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const isUnlocked = achievement.unlocked || checkAchievement(achievement);

            return (
              <div
                key={achievement.id}
                className={`border-2 p-6 ${
                  isUnlocked
                    ? 'border-gold bg-yellow-900/20'
                    : 'border-gray-700 bg-black/30'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gold' : 'text-gray-500'}`}>
                    {isUnlocked ? '' : '[LOCKED] '}
                    {achievement.nameUA || achievement.name}
                  </h3>
                  {isUnlocked && <span className="text-gold text-2xl">🏆</span>}
                </div>

                <p className={`text-sm mb-3 ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                  {achievement.descriptionUA || achievement.description}
                </p>

                <div className="text-xs text-gray-500">
                  {isUnlocked ? 'Locked' : achievement.unlocked && achievement.unlockedAt ? `Unlocked: ${new Date(achievement.unlockedAt).toLocaleDateString()}` : 'Locked'}
                </div>

                {isUnlocked && (
                  <div className="mt-2 text-gold font-bold">
                    +{achievement.goldReward} Gold
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
