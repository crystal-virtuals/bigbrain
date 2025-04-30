import { useAuth } from '@hooks/auth';
import { gamesAPI, mutateGameAPI } from '@services/api';
import { isEqual, mapToGame, newGame } from '@utils/game';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const Authenticate = ({ user, redirectPath = '/login', children }) => {
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
  const [sessions, setSessions] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    // fetch games on first render
    gamesAPI.getGames()
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
    };
  }, []);

  const createGame = (name) => {
    const updatedGames = [...games, newGame(name, user)];
    return gamesAPI.updateGames(updatedGames).then(() => setGames(updatedGames));
  };

  const deleteGame = (gameId) => {
    const updatedGames = games.filter((game) => !isEqual(game, gameId));
    return gamesAPI.updateGames(updatedGames).then(() => setGames(updatedGames));
  };

  const updateGame = (editedGame) => {
    const updatedGames = games.map((game) =>
      isEqual(game, editedGame.id) ? mapToGame(editedGame) : game
    );
    return gamesAPI.updateGames(updatedGames).then(() => setGames(updatedGames));
  };

  const startGame = async (gameId) => {
    // find the game by ID
    const game = games.find((game) => isEqual(game, gameId));
    console.log('Starting game:', game);
    console.log('Sessions:', sessions);

    // validate the game
    if (!game) throw new Error('Game not found');
    if (game.active) throw new Error('Game already has an active session');

    try {
      // start a new session
      const sessionData = await mutateGameAPI.start(gameId);

      // update the game with the new session ID
      setGames((prev) =>
        prev.map((game) =>
          isEqual(game, gameId)
            ? { ...game, active: sessionData.sessionId }
            : game
        )
      );

      // update the sessions state with the new session
      setSessions((prev) => ({
        ...prev,
        [gameId]: sessionData, // use gameId as the key
      }));

      // return the sessionId
      return sessionData.sessionId;

    } catch (error) {
      throw new Error(error.data || 'Failed to start game. Please try again.');
    }
  };


  const data = {
    games,
    setGames,
    sessions,
    setSessions,
    createGame,
    deleteGame,
    updateGame,
    startGame,
  };

  return (
    <Authenticate>
      <Outlet context={data} />
    </Authenticate>
  );
}

export default AdminLayout;
