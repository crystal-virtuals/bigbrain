import { useState, useEffect, useCallback } from 'react';
import SessionContext from './SessionContext';

const SessionProvider = ({ children }) => {
  const [state, setState] = useState({
    player: null,
    score: 0,
    questions: [],
    answerAvailable: false
  });

  const updateState = useCallback((newState) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  // Load saved state from localStorage
  useEffect(() => {
    const savedPlayer = localStorage.getItem('player');
    const savedQuestions = localStorage.getItem('questions');
    const savedScore = localStorage.getItem('score');

    updateState({
      player: savedPlayer ? JSON.parse(savedPlayer) : null,
      questions: savedQuestions ? JSON.parse(savedQuestions) : [],
      score: savedScore ? Number(savedScore) : 0
    });
  }, [updateState]);


  // Player methods
  const updatePlayer = useCallback((data) => {
    setState(prev => ({ ...prev, player: data }));
    localStorage.setItem('player', JSON.stringify(data));
  }, []);

  // Question methods
  const cacheQuestion = useCallback((question) => {
    setState(prev => {
      const updatedQuestions = [...prev.questions, question];
      localStorage.setItem('questions', JSON.stringify(updatedQuestions));
      return { ...prev, questions: updatedQuestions };
    });
  }, []);

  // Score methods
  const updateScore = useCallback((points) => {
    setState(prev => {
      const newScore = prev.score + points;
      localStorage.setItem('score', newScore.toString());
      return { ...prev, score: newScore };
    });
  }, []);

  // Answer methods
  const showAnswers = useCallback(() => {
    updateState({ answerAvailable: true });
  }, [updateState]);

  const resetAnswers = useCallback(() => {
    updateState({ answerAvailable: false });
  }, [updateState]);

  const clear = useCallback(() => {
    updateState({
      player: null,
      questions: [],
      score: 0,
      answerAvailable: false
    });
    localStorage.removeItem('player');
    localStorage.removeItem('questions');
    localStorage.removeItem('score');
  }, []);

  // Context value
  const contextValue = {
    // State
    player: state.player,
    score: state.score,
    questions: state.questions,
    answerAvailable: state.answerAvailable,

    // Methods
    updatePlayer,
    cacheQuestion,
    updateScore,
    showAnswers,
    resetAnswers,
    clear,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;