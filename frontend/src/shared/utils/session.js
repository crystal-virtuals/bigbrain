/***************************************************************
                      Game session management
***************************************************************/
export function calculateTimeLeft(duration, isoTimeLastQuestionStarted) {
  if (!isoTimeLastQuestionStarted) return duration;
  const started = new Date(isoTimeLastQuestionStarted);
  const elapsed = Math.floor((Date.now() - started.getTime()) / 1000);
  return Math.max(duration - elapsed, 0);
}

const isEqual = (game, gameId) => {
  return Number(game.id) === Number(gameId);
};

const startActiveSession = (game, sessionId) => {
  return {
    ...game,
    active: sessionId,
  };
};

const endActiveSession = (game) => {
  const sessionId = game.active;
  return {
    ...game,
    active: null,
    oldSessions: [...(game.oldSessions || []), sessionId],
  };
};

/*
 * Fetch latest session status and update state.
 */
export const updateSessionState = async (
  sessionId,
  setSessions,
  sessionAPI
) => {
  const session = await sessionAPI.getStatus(sessionId);
  setSessions((prev) => ({
    ...prev,
    [sessionId]: session,
  }));
  return session;
};

/**
 * Update the game state based on the latest session status.
 */
export const updateGameState = (
  games,
  setGames,
  gameId,
  session,
  sessionId
) => {
  const game = games.find((g) => isEqual(g, gameId));
  if (!game) return;

  const updatedGame =
    session.active === false
      ? endActiveSession(game)
      : startActiveSession(game, sessionId);

  setGames((prev) => prev.map((g) => (isEqual(g, gameId) ? updatedGame : g)));
};
