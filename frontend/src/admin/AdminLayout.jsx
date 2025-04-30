import { useAuth } from '@hooks/auth';
import { gamesAPI, mutateGameAPI } from '@services/api';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { isEqual, mapToGame, newGame, endActiveSession } from '@utils/game';
import { createSession, endSession} from '@utils/session';

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
  const [sessions, setSessions] = useState({});
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

  const findGameSession = (gameId) => {
    // find the session by game ID
    const session = sessions[gameId];
    if (!session) throw new Error('Session not found');
    return session;
  }

  const startGameSession = async (gameId) => {
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
      const sessionId = sessionData.sessionId;

      // update the game with the new session ID
      setGames((prev) =>
        prev.map((game) =>
          isEqual(game, gameId)
            ? { ...game, active: sessionId}
            : game
        )
      );

      // update the sessions state with the new session
      setSessions((prev) => ({
        ...prev,
        [sessionId]: createSession(gameId, sessionData.status, sessionData.position)
      }));

      // return the sessionId
      return sessionId;

    } catch (error) {
      throw new Error(error.message || 'Failed to start game. Please try again.');
    }
  };

  const stopGameSession = async (gameId) => {
    // find the game by ID
    const game = games.find((game) => isEqual(game, gameId));

    // validate the game
    if (!game) throw new Error('Game not found');
    if (!game.active) throw new Error('Game does not have an active session');

    console.log('Ending the active session in this game:', game);
    console.log('Stopping session:', sessions[game.active]);

    const sessionId = game.active;

    try {
      await mutateGameAPI.end(gameId);

      setGames((prev) =>
        prev.map((game) =>
          isEqual(game, gameId)
            ? endActiveSession(game)
            : game
        )
      );

      // mark session as inactive
      setSessions((prev) => {
        const session = prev[sessionId];
        return {
          ...prev,
          [sessionId]: endSession(session)
        };
      })

      return sessionId;

    } catch (error) {
      throw new Error(error.message || 'Failed to end game. Please try again.');
    }
  }

  const data = {
    games,
    setGames,
    sessions,
    setSessions,
    // game functions
    createGame,
    deleteGame,
    updateGame,
    // session functions
    findGameSession,
    startGameSession,
    stopGameSession,
  };

  return (
    <Authenticate>
      <Outlet context={data} />
    </Authenticate>
  );
}

export default AdminLayout;
