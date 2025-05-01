import { useAuth } from '@hooks/auth';
import { gamesAPI, gameAPI, sessionAPI, fetchGamesAndSessions } from '@services/api';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isEqual, mapToGame, newGame } from '@utils/game';
import { updateSessionState, updateGameState } from '@utils/session';

function Authenticate({ user, redirectPath = '/login', children }) {
  // wait for user to be set
  if (user === null) return null;

  if (user && !user.authenticated) {
    console.log('User is not authenticated, redirecting to login');
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
}

function AdminLayout() {
  const [games, setGames] = useState(null);
  const [sessions, setSessions] = useState(null);
  const { user } = useAuth();

  // on first render, fetch all games and sessions
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const { games, sessions } = await fetchGamesAndSessions();
        if (!isMounted) return;
        setGames(games);
        setSessions(sessions);
        console.log('Running useEffect to fetch games and sessions in AdminLayout');
        console.log('Fetched games:', games);
        console.log('Fetched sessions:', sessions);
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching games and sessions:', error);
        setGames([]);
        setSessions({});
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Polling for session updates
  useEffect(() => {
    if (!games) return;
    const interval = setInterval(async () => {
      const activeSessionIds = games.map((g) => g.active).filter(Boolean); // ignore nulls

      const updates = await Promise.all(
        activeSessionIds.map(async (id) => {
          try {
            const status = await sessionAPI.getStatus(id);
            return [id, status];
          } catch (err) {
            console.warn(`Polling failed for session ${id}:`, err);
            return null;
          }
        })
      );

      const newSessions = Object.fromEntries(updates.filter(Boolean));
      setSessions((prev) => ({ ...prev, ...newSessions }));
    }, 1000);

    return () => clearInterval(interval);
  }, [games]);

  // ---- Game management methods below ----
  const createGame = (name) => {
    const updatedGames = [...games, newGame(name, user)];
    return gamesAPI
      .updateGames(updatedGames)
      .then(() => setGames(updatedGames));
  };

  const deleteGame = (gameId) => {
    const updatedGames = games.filter((game) => !isEqual(game, gameId));
    return gamesAPI
      .updateGames(updatedGames)
      .then(() => setGames(updatedGames));
  };

  const updateGame = (editedGame) => {
    const updatedGames = games.map((game) =>
      isEqual(game, editedGame.id) ? mapToGame(editedGame) : game
    );
    return gamesAPI
      .updateGames(updatedGames)
      .then(() => setGames(updatedGames));
  };

  // ---- Session management methods below ----
  const startGame = async (gameId) => {
    const game = games.find((g) => isEqual(g, gameId));
    if (!game) throw new Error('Game not found');
    if (game.active) throw new Error('Game already has an active session');

    try {
      const { sessionId } = await gameAPI.start(gameId);
      const session = await updateSessionState(sessionId, setSessions, sessionAPI);
      updateGameState(games, setGames, gameId, session, sessionId);
      return sessionId; // return the sessionId
    } catch (error) {
      throw new Error(error.message || 'Failed to start game.');
    }
  };

  const advanceGame = async (gameId) => {
    const game = games.find((g) => isEqual(g, gameId));
    if (!game || !game.active) throw new Error('Game not found or inactive');

    const sessionId = game.active;

    try {
      const { position } = await gameAPI.advance(gameId);
      const session = await updateSessionState(sessionId, setSessions, sessionAPI);
      updateGameState(games, setGames, gameId, session, sessionId);
      return sessionId; // return the sessionId
    } catch (error) {
      throw new Error(error.message || 'Failed to advance game.');
    }
  };

  const stopGame = async (gameId) => {
    const game = games.find((g) => isEqual(g, gameId));
    if (!game || !game.active) throw new Error('Game not found or inactive');

    const sessionId = game.active;

    try {
      await gameAPI.end(gameId);
      const session = await updateSessionState(sessionId, setSessions, sessionAPI);
      updateGameState(games, setGames, gameId, session, sessionId);
      return sessionId; // return the sessionId
    } catch (error) {
      throw new Error(error.message || 'Failed to end game.');
    }
  };

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
    startGame,
    advanceGame,
    stopGame,
  };

  return (
    <Authenticate>
      <Outlet context={data} />
    </Authenticate>
  );
}

export default AdminLayout;
