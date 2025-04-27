import { questionTypes, duration, points } from '@constants/question';
import { uid, pluralSuffix, isEmptyString } from '@utils/helpers';

/***************************************************************
                        Equality
***************************************************************/
export const isEqual = (game, id) => {
  return Number(game.id) == Number(id);
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
  let answers = [newAnswer(true)];
  if (type !== questionTypes.JUDGEMENT) {
    answers.push(newAnswer(false));
  }
  return answers;
}

export const newQuestion = (type) => {
  let answers = [newAnswer(true)];
  let correctAnswers = [answers[0].id];
  if (type !== questionTypes.JUDGEMENT) {
    answers.push(newAnswer(false));
  }
  return {
    id: uid(),
    name: '',
    thumbnail: '',
    type: mapToQuestionType(type),
    duration: duration.NORMAL,
    points: points.STANDARD,
    answers: answers,
    correctAnswers: correctAnswers,
  };
}

export const isEmptyQuestion = (question) => {
  return (
    isEmptyString(question.name) &&
    question.answers.filter((a) => !isEmptyString(a.name)).length === 0);
}

export const validateQuestion = (question) => {
  const errors = new Map();

  if (isEmptyString(question.name)) {
    errors.set('name', 'Question cannot be empty');
  }

  const nonEmptyAnswers = question.answers.filter((a) => !isEmptyString(a.name));
  const correctAnswers = nonEmptyAnswers.filter((a) => a.correct);
  const falseAnswers = nonEmptyAnswers.filter((a) => !a.correct);

  if (question.type === questionTypes.JUDGEMENT) {
    // Judgement question must have one correct answer
    if (nonEmptyAnswers.length < 1) {
      errors.set('answers', 'One answer is required');
    }
  }

  if (question.type === questionTypes.SINGLE_CHOICE) {
    // Single choice question must have one correct answer
    if (correctAnswers.length !== 1) {
      errors.set('correctAnswer', 'One correct answer is required');
    }
    // At least 2 answers are required
    if (falseAnswers.length < 1) {
      errors.set('falseAnswers', 'At least one false answer is required');
    }
  }

  if (question.type === questionTypes.MULTIPLE_CHOICE) {
    // Multiple choice question must have at least one correct answer
    if (correctAnswers.length === 0) {
      errors.set('answers', 'At least one correct answer is required');
    }
    // At least 2 answers are required
    if (falseAnswers.length < 1) {
      errors.set('answers', 'At least one false answer is required');
    }
  }

  return errors;
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
    correctAnswers: question.answers.filter(a => a.correct && !isEmptyString(a.name)).map(a => Number(a.id)),
  };
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
    active: Number(game.active),
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
