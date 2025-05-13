import { useAuth } from '@hooks/auth';
import { isEqual, mapToGame, newGame } from '@utils/game';
import { updateGameState, updateSessionState } from '@utils/session';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { gamesAPI, sessionAPI } from '@services/api';

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
  const [games, setGames] = useState([]);
  const [sessions, setSessions] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // ---- Fetch all games and sessions on first render ----
  useEffect(() => {
    const load = async () => {
      try {
        // Step 1: Fetch all games
        const games = await gamesAPI.getGames();

        // Step 2: Collect all active session IDs from each game
        const activeSessionIds = games
          .map((game) => game.active)
          .filter(Boolean);

        // Step 3: Fetch the status of each active session
        const activeSessionEntries = await Promise.all(
          activeSessionIds.map(async (id) => {
            try {
              const status = await sessionAPI.getStatus(id);
              return [id, status];
            } catch {
              return [id, null];
            }
          })
        );

        // Step 4: Update sessions state
        setSessions((prev) => ({
          ...prev,
          ...Object.fromEntries(activeSessionEntries),
        }));

        // Step 5: Update games state
        setGames(games);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ---- Game Management ----
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

  // ---- Session Management ----
  const startGame = async (gameId) => {
    const game = games.find((g) => isEqual(g, gameId));
    if (!game) throw new Error('Game not found');
    if (game.active) throw new Error('Game already has an active session');

    try {
      const { sessionId } = await gamesAPI.start(gameId);
      const session = await updateSessionState(
        sessionId,
        setSessions,
        sessionAPI
      );
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
      const { position } = await gamesAPI.advance(gameId);
      const session = await updateSessionState(
        sessionId,
        setSessions,
        sessionAPI
      );
      updateGameState(games, setGames, gameId, session, sessionId);
      return position; // return the sessionId
    } catch (error) {
      throw new Error(error.message || 'Failed to advance game.');
    }
  };

  const stopGame = async (gameId) => {
    const game = games.find((g) => isEqual(g, gameId));
    if (!game || !game.active) throw new Error('Game not found or inactive');

    const sessionId = game.active;

    try {
      await gamesAPI.end(gameId);
      const session = await updateSessionState(
        sessionId,
        setSessions,
        sessionAPI
      );
      updateGameState(games, setGames, gameId, session, sessionId);
      return sessionId; // return the sessionId
    } catch (error) {
      throw new Error(error.message || 'Failed to end game.');
    }
  };

  const data = {
    games,
    sessions,
    loading,
    setSessions,
    // Game management methods
    createGame,
    deleteGame,
    updateGame,
    // Session management methods
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
