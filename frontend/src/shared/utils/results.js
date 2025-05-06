/***************************************************************
                     Helper Functions
***************************************************************/
/**
 * Calculates time taken in seconds between two ISO timestamps
 * @param {string|null} startTime - ISO timestamp
 * @param {string|null} endTime - ISO timestamp
 * @returns {number|null} Time in seconds or null if invalid
 */
function calculateTimeTaken(startedAt, answeredAt) {
  if (!startedAt || !answeredAt) return null;
  const start = new Date(startedAt);
  const end = new Date(answeredAt);
  return Math.round((end - start) / 1000) || null;
}

/**
 * Calculates score based on time taken to answer the question,
 * where faster times = more points.
 * @param {number|null} timeTaken - Time in seconds
 * @param {number} duration - Question time limit in seconds
 * @param {number} points - Question points
 * @returns {number} Calculated score
 */
function calculateQuestionScore(timeTaken, duration, points) {
  if (!timeTaken || !duration || timeTaken < 0) return points;

  // Cap timeTaken at duration
  const clampedTime = Math.min(duration, Math.max(0, timeTaken));

  // Calculate time bonus multiplier (1.0 to 2.0 range)
  const timeBonus = 1 + (duration - clampedTime) / duration;

  return parseFloat((points * timeBonus).toFixed(2));
}

function calculateAccuracyByType(answerResults) {
  const typeMap = {};
  answerResults.forEach((answer) => {
    if (!typeMap[answer.questionType]) {
      typeMap[answer.questionType] = { correct: 0, total: 0 };
    }
    typeMap[answer.questionType].total++;
    if (answer.correct) typeMap[answer.questionType].correct++;
  });

  return Object.entries(typeMap).map(([type, stats]) => ({
    type,
    accuracy: stats.total ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));
}

/***************************************************************
                     Player Results
***************************************************************/
export function generateAnswerResultsFromPlayer(playerResults, sessionQuestions) {
  return playerResults.map((answer, index) => {
    const question = sessionQuestions[index];
    if (!question) {
      console.warn(`Missing question for answer index ${index}`);
      return null;
    }
    const timeTaken = calculateTimeTaken(answer.questionStartedAt, answer.answeredAt);
    const score = answer.correct
      ? calculateQuestionScore(timeTaken, question.duration, question.points)
      : 0;

    return {
      index: index + 1,
      name: question.name,
      id: question.id,
      questionType: question.type,
      correct: answer.correct,
      timeTaken,
      score,
      points: question.points,
      answered: answer.answeredAt !== null,
    };
  }).filter(Boolean);
}

export function generatePlayerResults(playerResults, sessionQuestions) {
  const answers = generateAnswerResultsFromPlayer(playerResults, sessionQuestions);

  const totalQuestions = answers.length;
  const totalAnswered = answers.filter(a => a.answered).length;
  const totalCorrect = answers.filter(a => a.correct).length;
  const totalPoints = answers.reduce((sum, a) => sum + a.points, 0);
  const totalScore = parseFloat(answers.reduce((sum, a) => sum + a.score, 0).toFixed(2));
  const totalTimeTaken = answers.reduce((sum, a) => sum + (a.timeTaken || 0), 0);

  const averageTime = totalAnswered > 0 ? Math.round(totalTimeTaken / totalAnswered) : 0;
  const successRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return {
    answers,
    totalScore,
    totalPoints,
    totalAnswered,
    totalCorrect,
    totalQuestions,
    totalTimeTaken,
    averageTime,
    successRate,
    accuracyByType: calculateAccuracyByType(answers),
  };
}

export function generatePlayerStats(results) {
  const stats = [
    {
      name: 'Total Score',
      value: results.totalScore,
      unit: '/ ' + results.totalPoints,
    },
    {
      name: 'Questions Skipped',
      value: results.totalQuestions - results.totalAnswered,
      unit: '/ ' + results.totalQuestions,
    },
    {
      name: 'Response Time',
      value: results.averageTime,
      unit: 'secs',
    },
    {
      name: 'Accuracy',
      value: results.successRate,
      unit: '%',
    },
  ];

  return stats;
}
