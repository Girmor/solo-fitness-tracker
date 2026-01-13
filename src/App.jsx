import { useState, useEffect } from 'react';
import { useLocalStorage, getDefaultPlayerData } from './hooks/useLocalStorage';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { SKILLS } from './data/skills';
import { ACHIEVEMENTS } from './data/achievements';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Stats from './components/Stats/Stats';
import Quests from './components/Quests/Quests';
import Skills from './components/Skills/Skills';
import Achievements from './components/Achievements/Achievements';
import Settings from './components/Settings/Settings';

function App() {
  const [gameData, setGameData] = useLocalStorage('solo-fitness-data', getDefaultPlayerData());
  const [currentPage, setCurrentPage] = useState('home');

  // Cloud Sync
  const syncHook = useSupabaseSync(gameData, setGameData);

  // Initialize skills and achievements if not set
  useEffect(() => {
    if (!gameData.skills || gameData.skills.length === 0) {
      setGameData({
        ...gameData,
        skills: SKILLS.map(skill => ({ ...skill, unlocked: false, progress: 0 })),
        achievements: ACHIEVEMENTS.map(ach => ({ ...ach, unlocked: false, unlockedAt: null })),
      });
    }
  }, []);

  const updateGameData = (updates) => {
    setGameData({ ...gameData, ...updates });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home gameData={gameData} updateGameData={updateGameData} />;
      case 'stats':
        return <Stats gameData={gameData} />;
      case 'quests':
        return <Quests gameData={gameData} updateGameData={updateGameData} />;
      case 'skills':
        return <Skills gameData={gameData} />;
      case 'achievements':
        return <Achievements gameData={gameData} />;
      case 'settings':
        return <Settings gameData={gameData} updateGameData={updateGameData} syncHook={syncHook} />;
      default:
        return <Home gameData={gameData} updateGameData={updateGameData} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      player={gameData.player}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
