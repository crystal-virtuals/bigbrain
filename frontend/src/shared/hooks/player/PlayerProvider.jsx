import { useState } from 'react';
import PlayerContext from './PlayerContext';

const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem('player');
    return saved ? JSON.parse(saved) : null;
  });

  const updatePlayer = (data) => {
    setPlayer(data);
    localStorage.setItem('player', JSON.stringify(data));
  };

  return (
    <PlayerContext.Provider value={{ player, updatePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;