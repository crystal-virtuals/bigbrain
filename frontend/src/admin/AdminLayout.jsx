import { useAuth } from '@hooks/auth';
import { fetchGames, updateGames } from '@services/api';
import { isEqual, newGame, newQuestion, mapToGames, mapToQuestion } from '@utils/game';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const Authenticate = ({ user, redirectPath="/login", children }) => {
  // wait for user to be set
  if (user === null) return null;

  if (user && !user.authenticated) {
    console.log('User is not authenticated, redirecting to login');
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

function AdminLayout() {
  const [games, setGames] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    // fetch games on first render
    fetchGames()
      .then((games) => {
        if (!isMounted) return;
        console.log('Running useEffect to fetch games in AdminLayout:', games);
        setGames(games);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('Error fetching games:', error);
        setGames(null);
        if (error.status === 403) navigate('/403');
      });

    // cleanup after the component unmounts
    return () => {
      isMounted = false;
    }

  }, []);

  const createGame = (name) => {
    const updatedGames = [...games, newGame(name, user)];
    return updateGames(updatedGames).then(() => setGames(updatedGames));
  };

  const deleteGame = (gameId) => {
    const updatedGames = games.filter((game) => !isEqual(game, gameId));
    return updateGames(updatedGames).then(() => setGames(updatedGames));
  }

  const updateGame = (editedGame) => {
    const updatedGames = games.map((game) =>
      isEqual(game, editedGame.id) ? editedGame : game
    );
    return updateGames(updatedGames).then(() => setGames(updatedGames));
  };

  const createQuestion = (gameId, questionType) => {
    const game = games.find((game) => isEqual(game, gameId));
    if (!game) return;
    const question = newQuestion(questionType);
    const updatedQuestions = [...game.questions, question];
    const updatedGame = { ...game, questions: updatedQuestions };
    const updatedGames = games.map((g) => isEqual(g, gameId) ? updatedGame : g);
    console.log('Creating question in this game:', updatedGame);
    return updateGames(updatedGames).then(() => setGames(updatedGames));
  }

  const updateQuestion = (gameId, editedQuestion) => {
    const game = games.find((game) => isEqual(game, gameId));
    if (!game) return;
    const updatedQuestions = game.questions.map((question) =>
      isEqual(question, editedQuestion.id) ? mapToQuestion(editedQuestion) : question
    );
    const updatedGame = { ...game, questions: updatedQuestions };
    const updatedGames = games.map((g) => isEqual(g, gameId) ? updatedGame : g);
    console.log('Updating question in this game:', updatedGame);
    return updateGames(updatedGames).then(() => setGames(updatedGames));
  }

  return (
    <Authenticate>
      <Outlet context={{ user, games, setGames, createGame, deleteGame, updateGame, createQuestion, updateQuestion }} />
    </Authenticate>
  );
}

export default AdminLayout;
