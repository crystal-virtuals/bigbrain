import { questionTypes, timeLimit, points } from '@constants/question';
import { uid, pluralSuffix } from '@utils/helpers';
import { isEmptyString } from './helpers';

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

export const newQuestion = (type) => {
  let answers = [newAnswer(true)];
  if (type !== questionTypes.JUDGEMENT) {
    answers.push(newAnswer(false));
  }

  return {
    id: uid(),
    name: '',
    thumbnail: '',
    type: mapToQuestionType(type),
    timeLimit: timeLimit.NORMAL,
    points: points.STANDARD,
    answers: answers,
  };
}

export const newAnswer = (isCorrect) => {
  return {
    id: uid(),
    name: '',
    correct: isCorrect === true,
  };
}

export const mapToAnswer = (answer) => {
  return {
    id: Number(answer.id) || uid(),
    name: answer.name.trim() || '',
    correct: !!answer.correct,
  };
}

export const mapToQuestion = (question) => {
  return {
    id: Number(question.id),
    name: question.name.trim(),
    thumbnail: question.thumbnail,
    type: mapToQuestionType(question.type),
    timeLimit: Number(question.timeLimit),
    points: Number(question.points),
    answers: question.answers.map((a) => mapToAnswer(a)).filter((a) => !isEmptyString(a.name)),
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
    active: 0, // 0 = inactive, 1 = active
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
