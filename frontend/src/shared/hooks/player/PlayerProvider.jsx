import { useState, useEffect } from 'react';
import PlayerContext from './PlayerContext';

const PlayerProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem('player');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const saved = localStorage.getItem('questions');
    if (saved) {
      setQuestions(JSON.parse(saved));
    }
  }, []);

  const updatePlayer = (data) => {
    setPlayer(data);
    localStorage.setItem('player', JSON.stringify(data));
  };

  const cacheQuestion = (question) => {
    const existing = questions.find((q) => q.id === question.id);
    if (existing) return;

    const updated = [
      ...questions,
      {
        id: question.id,
        name: question.name,
        points: question.points ?? 100,
      },
    ];

    setQuestions(updated);
    localStorage.setItem('questions', JSON.stringify(updated));
  };

  const updateScore = (points) => {
    setScore((prev) => prev + points);
  };

  const getQuestionCount = () => questions.length;

  const clear = () => {
    setPlayer(null);
    setQuestions({});
    localStorage.removeItem('player');
    localStorage.removeItem('questions');
  };

  const data = {
    player,
    score,
    questions,
    updatePlayer,
    cacheQuestion,
    updateScore,
    getQuestionCount,
    clear,
  };

  return (
    <PlayerContext.Provider value={data}>{children}</PlayerContext.Provider>
  );
};

export default PlayerProvider;
