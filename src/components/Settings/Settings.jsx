import React, { useState } from 'react';
import { getDefaultPlayerData } from '../../hooks/useLocalStorage';
import { EXERCISES } from '../../data/exercises';
import Auth from '../Auth/Auth';
import SyncStatus from '../Auth/SyncStatus';

const Settings = ({ gameData, updateGameData, syncHook }) => {
  const { player, settings } = gameData;
  const [playerName, setPlayerName] = useState(player.name);
  const [region, setRegion] = useState(player.region);
  const [goals, setGoals] = useState(settings.goals);
  const [editingGoals, setEditingGoals] = useState(false);

  const handleSaveProfile = () => {
    updateGameData({
      ...gameData,
      player: {
        ...player,
        name: playerName,
        region: region,
      },
    });
    alert('Profile updated!');
  };

  const handleSaveGoals = () => {
    updateGameData({
      ...gameData,
      settings: {
        ...settings,
        goals: goals,
      },
    });
    setEditingGoals(false);
    alert('Goals updated!');
  };

  const handleGoalChange = (exerciseId, value) => {
    const numValue = parseFloat(value) || 0;
    setGoals({
      ...goals,
      [exerciseId]: numValue,
    });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(gameData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solo-fitness-backup-${Date.now()}.json`;
    link.click();
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          updateGameData(imported);
          alert('Data imported successfully!');
          window.location.reload(); // Reload to apply changes
        } catch (error) {
          alert('Error importing data: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset ALL data? This cannot be undone!')) {
      if (window.confirm('FINAL WARNING: All progress will be lost!')) {
        updateGameData(getDefaultPlayerData());
        alert('All data has been reset.');
        window.location.reload();
      }
    }
  };

  const allExercises = Object.values(EXERCISES);

  return (
    <div className="space-y-6">
      <div className="border-2 border-neon-blue p-6 bg-system-darker glow-border">
        <h2 className="text-2xl text-neon-blue font-bold mb-6">SETTINGS</h2>

        {/* Cloud Sync */}
        {syncHook && (
          <div className="mb-8">
            <h3 className="text-neon-cyan text-lg mb-4">Cloud Sync</h3>
            {syncHook.user ? (
              <SyncStatus
                user={syncHook.user}
                syncing={syncHook.syncing}
                lastSync={syncHook.lastSync}
                onSignOut={syncHook.signOut}
                onManualSync={syncHook.saveToCloud}
              />
            ) : (
              <Auth
                onSignIn={syncHook.signInWithEmail}
                onSignUp={syncHook.signUpWithEmail}
                onGoogleSignIn={syncHook.signInWithGoogle}
                syncEnabled={syncHook.syncEnabled}
              />
            )}
          </div>
        )}

        {/* Profile Settings */}
        <div className="mb-8">
          <h3 className="text-neon-cyan text-lg mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Player Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 px-4 py-2 text-white"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              className="bg-neon-blue hover:bg-neon-cyan text-black px-6 py-2 font-bold transition"
            >
              Save Profile
            </button>
          </div>
        </div>

        {/* Exercise Goals */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-neon-cyan text-lg">Exercise Goals</h3>
            {!editingGoals ? (
              <button
                onClick={() => setEditingGoals(true)}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 font-bold transition text-sm"
              >
                Edit Goals
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveGoals}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 font-bold transition text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setGoals(settings.goals);
                    setEditingGoals(false);
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 font-bold transition text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allExercises.map((exercise) => (
              <div key={exercise.id} className="border border-gray-600 p-4 bg-black/30">
                <div className="text-sm text-gray-400 mb-2">{exercise.nameUA} ({exercise.name})</div>
                {editingGoals ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={goals[exercise.id] || 0}
                      onChange={(e) => handleGoalChange(exercise.id, e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-500 px-3 py-2 text-white"
                      min="1"
                    />
                    <span className="text-white">
                      {exercise.type === 'reps' ? 'reps' : exercise.type === 'time' ? 'sec' : 'km'}
                    </span>
                  </div>
                ) : (
                  <div className="text-white font-bold text-lg">
                    {goals[exercise.id] || 0}{' '}
                    {exercise.type === 'reps' ? 'reps' : exercise.type === 'time' ? 'sec' : 'km'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Theme Settings */}
        <div className="mb-8">
          <h3 className="text-neon-cyan text-lg mb-4">Theme Settings</h3>
          <div className="border border-gray-600 p-4 bg-black/30">
            <p className="text-gray-400">Current theme: <span className="text-neon-blue">Dark (Default)</span></p>
            <p className="text-xs text-gray-500 mt-2">* Theme customization coming in future update</p>
          </div>
        </div>

        {/* Data Management */}
        <div className="mb-8">
          <h3 className="text-neon-cyan text-lg mb-4">Data Management</h3>
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 font-bold transition"
            >
              Export Data (Backup)
            </button>

            <div>
              <label className="w-full bg-green-600 hover:bg-green-500 text-white px-6 py-3 font-bold transition cursor-pointer block text-center">
                Import Data (Restore)
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={handleResetData}
              className="w-full bg-red-600 hover:bg-red-500 text-white px-6 py-3 font-bold transition"
            >
              Reset All Data (Dangerous!)
            </button>
          </div>
        </div>

        {/* Stats Display */}
        <div className="border border-gray-600 p-4 bg-black/30">
          <h4 className="text-gray-400 text-sm mb-3">Account Stats</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Level: <span className="text-neon-cyan">{player.level}</span></div>
            <div>Rank: <span className="text-neon-cyan">{player.rank}</span></div>
            <div>Total EXP: <span className="text-neon-cyan">{player.exp}</span></div>
            <div>Gold: <span className="text-gold">{player.gold}</span></div>
            <div>Total Workouts: <span className="text-neon-cyan">{gameData.history.totalWorkouts}</span></div>
            <div>Current Streak: <span className="text-neon-cyan">{gameData.streak.current} days</span></div>
            <div>Best Streak: <span className="text-gold">{gameData.streak.best} days</span></div>
            <div>STR: <span className="text-red-500">{player.stats.STR}</span></div>
            <div>END: <span className="text-green-500">{player.stats.END}</span></div>
            <div>AGI: <span className="text-yellow-500">{player.stats.AGI}</span></div>
            <div>INT: <span className="text-blue-500">{player.stats.INT}</span></div>
            <div>WIL: <span className="text-purple-500">{player.stats.WIL}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
