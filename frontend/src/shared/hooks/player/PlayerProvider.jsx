import { useState, useEffect } from 'react';
import PlayerContext from './PlayerContext';

const PlayerProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const savedQuestions = localStorage.getItem('questions');
    const savedPlayer = localStorage.getItem('player');
    if (savedPlayer) setPlayer(JSON.parse(savedPlayer));
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
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
      question, // add the entire question object
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
    setQuestions([]);
    setScore(0);
    localStorage.removeItem('score');
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
