import React from 'react';

const SyncStatus = ({ user, syncing, lastSync, onSignOut, onManualSync }) => {
  const formatLastSync = () => {
    if (!lastSync) return 'Never';

    const now = new Date();
    const diff = now - lastSync;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return lastSync.toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className="border-2 border-green-500 p-4 bg-green-900/10">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-500 font-bold">☁️ Cloud Sync Active</span>
            {syncing && (
              <span className="text-xs text-yellow-400 animate-pulse">Syncing...</span>
            )}
          </div>
          <div className="text-sm text-gray-400">
            Signed in as: {user.email}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Last sync: {formatLastSync()}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onManualSync}
          disabled={syncing}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm font-bold transition disabled:opacity-50"
        >
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
        <button
          onClick={onSignOut}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 text-sm font-bold transition"
        >
          Sign Out
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>✓ Your data automatically syncs every 2 seconds</p>
        <p>✓ Access your progress from any device</p>
      </div>
    </div>
  );
};

export default SyncStatus;
