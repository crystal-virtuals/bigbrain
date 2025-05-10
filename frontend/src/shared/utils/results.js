import { questionTypeOptions } from '@constants/questions';

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
export function generateAnswerResultsFromPlayer(
  playerResults,
  sessionQuestions
) {
  return playerResults
    .map((answer, index) => {
      const question = sessionQuestions[index];
      if (!question) {
        console.warn(`Missing question for answer index ${index}`);
        return null;
      }
      const timeTaken = calculateTimeTaken(
        answer.questionStartedAt,
        answer.answeredAt
      );
      const score = answer.correct
        ? calculateQuestionScore(timeTaken, question.duration, question.points)
        : 0;

      return {
        index: index + 1,
        name: question.name,
        id: question.id,
        questionType: question.type,
        duration: question.duration,
        correct: answer.correct,
        timeTaken,
        score,
        points: question.points,
        answered: answer.answeredAt !== null,
      };
    })
    .filter(Boolean);
}

export function generatePlayerResults(playerResults, sessionQuestions) {
  const answers = generateAnswerResultsFromPlayer(
    playerResults,
    sessionQuestions
  );

  const totalQuestions = answers.length;
  const totalAnswered = answers.filter((a) => a.answered).length;
  const totalCorrect = answers.filter((a) => a.correct).length;
  const totalPoints = answers.reduce((sum, a) => sum + a.points, 0);
  const totalScore = parseFloat(
    answers.reduce((sum, a) => sum + a.score, 0).toFixed(2)
  );
  const totalTimeTaken = answers.reduce(
    (sum, a) => sum + (a.timeTaken || 0),
    0
  );

  const averageTime =
    totalAnswered > 0 ? Math.round(totalTimeTaken / totalAnswered) : 0;
  const successRate =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

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

/***************************************************************
                     Admin Session Results
***************************************************************/
function generateAnswerResults(resultAnswers, sessionQuestions) {
  return resultAnswers
    .map((answer, index) => {
      const question = sessionQuestions[index];
      if (!question) {
        console.warn(`Missing question for answer index ${index}`);
        return null;
      }
      const timeTaken = calculateTimeTaken(
        answer.questionStartedAt,
        answer.answeredAt
      );
      const score = answer.correct
        ? calculateQuestionScore(timeTaken, question.duration, question.points)
        : 0;

      return {
        index: index + 1,
        name: question.name,
        id: question.id,
        questionType: question.type,
        duration: question.duration,
        correct: answer.correct,
        timeTaken: timeTaken,
        score: score,
        points: question.points,
        answered: answer.answeredAt !== null,
      };
    })
    .filter(Boolean); // Filter out null values
}

export function generateAdminPlayerResults(adminResults, adminSession) {
  if (!adminResults || !adminSession) return [];

  return adminResults.map((playerResult) => {
    const answerResults = generateAnswerResults(
      playerResult.answers,
      adminSession.questions
    );

    const answeredQuestions = answerResults.filter((a) => a.answered);
    const correctAnswers = answerResults.filter((a) => a.correct);

    const totalScore = parseFloat(
      answerResults.reduce((sum, a) => sum + a.score, 0).toFixed(2)
    );
    const totalPoints = answerResults.reduce((sum, a) => sum + a.points, 0);
    const totalCorrect = correctAnswers.length;
    const totalQuestions = answerResults.length;
    const totalTimeTaken = answeredQuestions.reduce(
      (sum, a) => sum + (a.timeTaken || 0),
      0
    );

    const avgTime = Math.round(totalTimeTaken / totalQuestions);
    const successRate = Math.round((totalCorrect / totalQuestions) * 100);
    const maxQuestionDuration = Math.max(
      ...answerResults.map((a) => a.duration)
    );

    return {
      name: playerResult.name,
      answers: answerResults,
      maxDuration: maxQuestionDuration,
      totalScore: totalScore,
      totalPoints: totalPoints,
      totalAnswered: answeredQuestions.length,
      totalCorrect: totalCorrect,
      totalQuestions: totalQuestions,
      totalTimeTaken: totalTimeTaken,
      averageTime: avgTime,
      // Additional metrics
      successRate: successRate,
      accuracyByType: calculateAccuracyByType(answerResults),
    };
  });
}

/***************************************************************
                      Admin Session Stats
***************************************************************/
export function getQuestionAccuracy(results) {
  const questionCount = results[0].answers.length;
  const correctnessByQuestion = Array(questionCount).fill(0);
  const totalPlayers = results.length;
  results.forEach((player) => {
    player.answers.forEach((answer, i) => {
      if (answer.correct) {
        correctnessByQuestion[i] += 1;
      }
    });
  });

  // If no players answered a question, return null
  if (totalPlayers === 0 || correctnessByQuestion.every((count) => count === 0)) {
    return correctnessByQuestion.map((_, index) => ({
      question: `Q${index + 1}`,
      percentCorrect: null,
    }));
  }

  return correctnessByQuestion.map((correctCount, index) => ({
    question: `Q${index + 1}`,
    percentCorrect: Math.round((correctCount / totalPlayers) * 100),
  }));
}

export function getAverageTimePerQuestion(results) {
  const questionCount = results[0].answers.length;
  const timeTotals = Array(questionCount).fill(0);
  const answerCounts = Array(questionCount).fill(0);

  // If no players answered a question, return null
  if (results.length === 0 || timeTotals.every((time) => time === 0)) {
    return timeTotals.map((_, index) => ({
      question: `Q${index + 1}`,
      avgTime: null,
    }));
  }

  results.forEach((player) => {
    player.answers.forEach((answer, i) => {
      if (answer.answered && answer.timeTaken !== null) {
        timeTotals[i] += answer.timeTaken;
        answerCounts[i] += 1;
      }
    });
  });

  return timeTotals.map((totalTime, index) => ({
    question: `Q${index + 1}`,
    avgTime: answerCounts[index]
      ? Math.round(totalTime / answerCounts[index])
      : 0,
  }));
}

export function getQuestionTypeAccuracy(results) {
  const typeStats = {};

  // If no players answered a question, return null
  if (results.length === 0 || results.every((player) => player.answers.length === 0)) {
    return null;
  }

  results.forEach((player) => {
    player.answers.forEach((answer) => {
      const type = answer.questionType || 'unknown';
      if (!typeStats[type]) {
        typeStats[type] = { correct: 0, total: 0 };
      }
      typeStats[type].total += 1;
      if (answer.correct) typeStats[type].correct += 1;
    });
  });

  const data = Object.entries(typeStats)
    .map(([type, stats]) => {
      const percentage = stats.total ? (stats.correct / stats.total) * 100 : 0;
      const typeLabel = questionTypeOptions.find(
        (option) => option.value === type
      ).label;
      return {
        id: type,
        value: parseFloat(percentage.toFixed(1)),
        label: `${typeLabel} (${stats.correct}/${stats.total})`,
      };
    })
    .sort((a, b) => b.value - a.value);

  return data;
}
