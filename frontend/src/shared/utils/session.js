/***************************************************************
                      Game session management
***************************************************************/
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

/**
 * Compare two session objects to check if they are equal.
 */
export const isSessionEqual = (a, b) => {
  if (a.state !== b.state) return false;
  if (a.data?.question?.id !== b.data?.question?.id) return false;
  if (a.data?.answers?.length !== b.data?.answers?.length) return false;
  return true;
}

/*
 * Fetch latest session status and update state.
 */
export const updateSessionState = async (
  sessionId,
  setSessions,
  sessionAPI
) => {
  try {
    const session = await sessionAPI.getStatus(sessionId);
    setSessions((prev) => ({
      ...prev,
      [sessionId]: session,
    }));
    return session;
  } catch (error) {
    console.error("Error updating session state:", error);
    throw error;
  }
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
