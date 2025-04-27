import { useAuth } from '@hooks/auth';
import { fetchGames, updateGames } from '@services/api';
import { newGame, mapToGame, newQuestion, isEqual } from '@utils/game';
import { useState, useEffect } from 'react';
import { Loading } from '@pages/public';
import GameContext from './GameContext';

export default function GameProvider({ children }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch games on first render
  useEffect(() => {
    setLoading(true);
    fetchGames()
      .then((games => {
        const newGames = games.map((game) => mapToGame(game));
        console.log('Fetched games:', newGames);
        setGames(newGames);
      }))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);


  const findGame = (gameId) => {
    return games.find((game) => isEqual(game, gameId));
  };

  const createGame = (name) => {
    const updatedGames = [...games, newGame(name, user)];
    return updateGames(updatedGames).then(setGames);
  };

  const deleteGame = (gameId) => {
    const updatedGames = games.filter((game) => isEqual(game, gameId));
    return updateGames(updatedGames).then(setGames);
  }

  const updateGame = (editedGame) => {
    const updatedGames = games.map((game) =>
      isEqual(game, editedGame.id) ? mapToGame(editedGame) : game
    );
    return updateGames(updatedGames).then(setGames);
  };

  const createQuestion = (gameId, questionType) => {
    const game = findGame(gameId);
    if (!game) return;
    const newQuestions = [...game.questions, newQuestion(questionType)];
    const newGame = mapToGame({ ...game, questions: newQuestions });
    const updatedGames = games.map((game) => (isEqual(game, gameId) ? newGame : game));
    return updateGames(updatedGames).then(setGames);
  }

  const value = {
    games,
    setGames,
    findGame,
    createGame,
    deleteGame,
    updateGame,
    createQuestion,
    loading,
    error,
  }

  return (
    <GameContext.Provider value={value}>
      {loading ? <Loading /> : children} {/* Show loading until data is fetched */}
    </GameContext.Provider>
  );
}
