import { useGamesApi, useSessionApi } from '@hooks/api';
import { useAuth } from '@hooks/auth';
import { isEqual, mapToGame, newGame } from '@utils/game';
import { updateGameState, updateSessionState } from '@utils/session';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

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
  const gamesAPI = useGamesApi();
  const sessionAPI = useSessionApi();
  const { user } = useAuth();

  // ---- Fetch all games and sessions on first render ----
  useEffect(() => {
    const load = async () => {
      try {
        // Fetch the list of games
        const games = await gamesAPI.getGames();
        // Collect all session IDs from each game
        const sessionIds = games.flatMap(game => {
          const ids = [];
          if (game.active) ids.push(game.active);
          if (game.oldSessions) ids.push(...game.oldSessions);
          return ids;
        });
        // Fetch the status of each session
        const sessionEntries = await Promise.all(
          sessionIds.map(async (sessionId) => {
            try {
              const status = await sessionAPI.getStatus(sessionId);
              return [sessionId, status];
            } catch {
              return [sessionId, null];
            }
          })
        );
        setGames(games);
        setSessions(Object.fromEntries(sessionEntries));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ---- Game Management ----
  const createGame = async (name) => {
    const updated = [...games, newGame(name, user)];
    await gamesAPI.updateGames(updated);
    setGames(updated);
  };

  const deleteGame = async (gameId) => {
    const updated = games.filter((g) => !isEqual(g, gameId));
    await gamesAPI.updateGames(updated);
    setGames(updated);
  };

  const updateGame = async (editedGame) => {
    const updated = games.map((g) =>
      isEqual(g, editedGame.id) ? mapToGame(editedGame) : g
    );
    await gamesAPI.updateGames(updated);
    setGames(updated);
  };

  // ---- Session Management ----
  const startGame = async (gameId) => {
    const game = games.find((g) => isEqual(g, gameId));
    if (!game) throw new Error('Game not found');
    if (game.active) throw new Error('Game already has an active session');

    const { sessionId } = await gamesAPI.start(gameId);
    const session = await updateSessionState(sessionId, setSessions, sessionAPI);
    updateGameState(games, setGames, gameId, session, sessionId);
    return sessionId;
  };

  const advanceGame = async (gameId) => {
    const game = games.find((g) => isEqual(g, gameId));
    if (!game || !game.active) throw new Error('Game not found or inactive');

    const { position } = await gamesAPI.advance(gameId);
    const session = await updateSessionState(game.active, setSessions, sessionAPI);
    updateGameState(games, setGames, gameId, session, game.active);
    return position;
  };

  const stopGame = async (gameId) => {
    const game = games.find((g) => isEqual(g, gameId));
    if (!game || !game.active) throw new Error('Game not found or inactive');

    await gamesAPI.end(gameId);
    const session = await updateSessionState(game.active, setSessions, sessionAPI);
    updateGameState(games, setGames, gameId, session, game.active);
    return game.active;
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
