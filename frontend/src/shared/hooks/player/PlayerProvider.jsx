import { useState } from 'react';
import PlayerContext from './PlayerContext';

const PlayerProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState({});
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem('player');
    return saved ? JSON.parse(saved) : null;
  });

  const updatePlayer = (data) => {
    setPlayer(data);
    localStorage.setItem('player', JSON.stringify(data));
  };

  const cacheQuestion = (question) => {
    setQuestions(prev => ({
      ...prev,
      [question.id]: {
        points: question.points,
        name: question.name,
      }
    }));
  };

  const updateScore = (points) => {
    setScore(prev => prev + points);
  };

  const getQuestionCount = () => {
    return Object.keys(questions).length;
  };

  const clear = () => {
    setPlayer(null);
    localStorage.removeItem('player');
    setQuestions({});
  }

  const data = {
    player,
    score,
    questions,
    updatePlayer,
    cacheQuestion,
    updateScore,
    getQuestionCount,
  }

  return (
    <PlayerContext.Provider value={data}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;