/***************************************************************
                      Results
***************************************************************/
export function calculatePlayerResults(player, questions, questionStartTimes) {
  const results = [];

  let totalScore = 0;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const startedAt = new Date(questionStartTimes[i]).getTime();
    const answerEntry = player.answers.find(a => a.questionId === question.id);

    if (!answerEntry) {
      results.push({ questionId: question.id, correct: false, timeTaken: null, score: 0 });
      continue;
    }

    const answeredAt = new Date(answerEntry.answeredAt).getTime();
    const timeTakenSec = Math.min((answeredAt - startedAt) / 1000, question.duration);

    const isCorrect = question.correctAnswers.every(id => answerEntry.answerIds.includes(id)) &&
                      answerEntry.answerIds.length === question.correctAnswers.length;

    const score = isCorrect
      ? Math.round(question.points * (1 - timeTakenSec / question.duration) * 100) / 100
      : 0;

    totalScore += score;

    results.push({
      questionId: question.id,
      correct: isCorrect,
      timeTaken: timeTakenSec,
      score,
    });
  }

  return {
    playerId: player.id,
    name: player.name,
    totalScore: Math.round(totalScore * 100) / 100,
    perQuestion: results,
  };
}

/***************************************************************
                      Game session management
***************************************************************/
const isEqual = (game, gameId) => {
  return Number(game.id) === Number(gameId);
}

const startActiveSession = (game, sessionId) => {
  return {
    ...game,
    active: sessionId,
  }
}

const endActiveSession = (game) => {
  const sessionId = game.active;
  return {
    ...game,
    active: null,
    oldSessions: [...(game.oldSessions || []), sessionId],
  }
}

/*
 * Fetch latest session status and update state.
 */
export const updateSessionState = async (sessionId, setSessions, sessionAPI) => {
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
export const updateGameState = (games, setGames, gameId, session, sessionId) => {
  const game = games.find((g) => isEqual(g, gameId));
  if (!game) return;

  const updatedGame =
    session.active === false
      ? endActiveSession(game)
      : startActiveSession(game, sessionId);

  setGames((prev) =>
    prev.map((g) => (isEqual(g, gameId) ? updatedGame : g))
  );
};