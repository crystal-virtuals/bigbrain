import { questionTypes, duration, points } from '@constants/questions';
import { uid, pluralSuffix, isEmptyString } from '@utils/helpers';

/***************************************************************
                        Validation
***************************************************************/
export const isEqual = (game, id) => {
  return Number(game.id) == Number(id);
}

const validateSingleChoice = (errors, answers) => {
  // Validate correct answer
  const correctAnswer = answers.find(a => a.correct);
  if (isEmptyString(correctAnswer?.name)) {
    errors.set('correctAnswer', 'Correct answer cannot be empty');
  }

  // Validate at least one false answer exists
  const falseAnswers = answers.filter(a => !a.correct);
  if (falseAnswers.length === 0) {
    errors.set('falseAnswers', 'At least one false answer is required');
  }

  // Validate each false answer (only first one is required)
  falseAnswers.forEach((answer, index) => {
    if (index === 0 && isEmptyString(answer.name)) {
      errors.set(`falseAnswers`, 'First false answer cannot be empty');
    }
  });
};

const validateMultipleChoice = (errors, answers) => {
  const nonEmptyAnswers = answers.filter(a => !isEmptyString(a.name));
  const correctAnswers = answers.filter(a => a.correct);

  // At least one correct answer is required
  if (correctAnswers.length === 0) {
    errors.set('answers', 'At least one answer must be correct');
  }

  // If there is only one correct answer, it cannot be empty
  if (correctAnswers.length === 1 && isEmptyString(correctAnswers[0].name)) {
    errors.set('answers', 'Correct answer cannot be empty');
  }

  // First two answers are required
  answers.forEach((answer, index) => {
    if (index < 2 && isEmptyString(answer.name)) {
      errors.set(`answers`, 'First two answers cannot be empty');
    }
  });

  // At least two answers are required
  if (nonEmptyAnswers.length < 2) {
    errors.set('answers', 'At least two answers are required');
  }
}

export function validateQuestion(question) {
  const errors = new Map();

  // Validate question name
  if (isEmptyString(question.name)) {
    errors.set('name', 'Question cannot be empty');
  }

  // Validate answers
  if (question.type === questionTypes.SINGLE_CHOICE) {
    validateSingleChoice(errors, question.answers);
  } else if (question.type === questionTypes.MULTIPLE_CHOICE) {
    validateMultipleChoice(errors, question.answers);
  }

  return errors;
}

/***************************************************************
                        Question
***************************************************************/
// Given the value of a question type (e.g. 'singleChoice'),
// validate it against the questionTypes object and return the value
const mapToQuestionType = (type) => {
  const questionType = Object.values(questionTypes).find((t) => t === type);
  if (!questionType) {
    return questionTypes.SINGLE_CHOICE; // default to single choiced
  }
  return questionType;
}

export const newAnswers = (type) => {
  let answers = [];
  if (type === questionTypes.JUDGEMENT) {
    answers.push({
      id: 1,
      name: 'True',
      correct: true,
    });
    answers.push({
      id: 2,
      name: 'False',
      correct: false,
    });
  } else {
    answers.push(newAnswer(true));
    answers.push(newAnswer(false));
  }
  return answers;
}

export const newQuestion = (type) => {
  return {
    id: uid(),
    name: '',
    thumbnail: '',
    type: mapToQuestionType(type),
    duration: duration.NORMAL,
    points: points.STANDARD,
    answers: newAnswers(type),
  };
}

export const isEmptyQuestion = (question) => {
  return (
    isEmptyString(question.name) &&
    question.answers.filter((a) => !isEmptyString(a.name)).length === 0);
}

export const newAnswer = (isCorrect) => {
  return {
    id: uid(),
    name: '',
    correct: isCorrect,
  };
}

export const mapToAnswer = (answer) => {
  return {
    id: Number(answer.id),
    name: answer.name.trim(),
    correct: !!answer.correct,
  };
}

export const mapToQuestion = (question) => {
  return {
    id: Number(question.id),
    name: question.name.trim(),
    thumbnail: question.thumbnail,
    type: mapToQuestionType(question.type),
    duration: Number(question.duration) || duration.NORMAL,
    points: Number(question.points),
    answers: question.answers.filter(a => !isEmptyString(a.name)).map(a => mapToAnswer(a)),
    correctAnswers: question.answers.filter(a => a.correct && !isEmptyString(a.name)).map(a => Number(a.id)),
  };
}

export const convertToQuestion = (question) => {
  return {
    id: Number(question.id),
    name: question.name.trim(),
    thumbnail: question.thumbnail,
    type: mapToQuestionType(question.type),
    duration: Number(question.duration) || duration.NORMAL,
    points: Number(question.points),
    answers: question.answers.length > 0
      ? question.answers.filter(a => !isEmptyString(a.name)).map(a => mapToAnswer(a))
      : newAnswers(question.type),
  };
}

export const changeQuestionType = (question, type) => {
  const newType = mapToQuestionType(type);
  const newQuestion = {
    ...question,
    type: newType,
    answers: newAnswers(newType),
  };
  return newQuestion;
}

/***************************************************************
                        Game
***************************************************************/
export const newGame = (name, user) => {
  const newGame = {
    id: uid(),
    name: name,
    owner: user.email,
    createdAt: new Date().toISOString(),
    thumbnail: '',
    active: null, // the ID of the active session for this game. If no active session, set to null
    questions: [],
  };
  return newGame;
}

export const mapToGame = (game) => {
  return {
    id: Number(game.id),
    name: game.name,
    owner: game.owner,
    createdAt: game.createdAt,
    thumbnail: game.thumbnail,
    active: Number(game.active) || null,
    questions: game.questions ? game.questions.map((q) => mapToQuestion(q)) : [],
  };
}

export const mapToGames = (games) => {
  return games.map((game) => mapToGame(game));
}

export const getTotalDuration = (questions) => {
  if (!questions || questions.length === 0) {
    return '0 min';
  }

  // if questions exist, sum the duration of each question
  const total = questions.reduce((acc, question) => {
    // if question has no duration, return 0
    if (!question.duration) {
      return acc;
    }
    // if question has duration, add to total
    return acc + question.duration;
  }, 0);

  // if total is less than 60, return in minutes
  if (total < 60) {
    return `${total} min`;
  }
  // if total is greater than 60, return in hours and minutes
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${minutes}min`;
};


export const getNumberOfQuestions = (questions) => {
  // if no questions, return 0
  if (!questions || questions.length === 0) {
    return '0 questions';
  }
  const count = questions.length;
  return `${count} question${pluralSuffix(count)}`;
};

export const isActive = (active) => {
  return active === 1 ? 'Active' : 'Inactive';
};
