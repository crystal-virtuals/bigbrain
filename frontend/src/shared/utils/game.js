import { questionTypes, timeLimit, points } from '@constants/question';
import { uid, pluralSuffix } from '@utils/helpers';

/***************************************************************
                        Equality
***************************************************************/
export const isEqual = (game, id) => {
  return Number(game.id) == Number(id);
}

/***************************************************************
                        Question
***************************************************************/

// reverse mapping from questionTypes.SINGLE_CHOICE to the key
const mapToQuestionType = (type) => {
  const questionType = questionTypes.find((q) => q.value === type);
  if (!questionType) {
    return questionTypes.SINGLE_CHOICE;
  }
  return questionType;
}

export const newQuestion = (type) => {
  return {
    id: uid(),
    name: '',
    thumbnail: '',
    type: mapToQuestionType(type),
    timeLimit: timeLimit.NORMAL,
    points: points.STANDARD,
    answers: [],
  };
}

export const newAnswer = () => {
  return {
    id: uid(),
    name: '',
    correct: false,
  };
}


export const mapToQuestion = (question) => {
  return {
    id: question.id,
    name: question.name,
    thumbnail: question.thumbnail,
    type: question.type,
    timeLimit: Number(question.timeLimit),
    points: Number(question.points),
    answers: question.answers.map((a) => ({ id: a.id, name: a.name, correct: a.correct })),
  };
}

export const mapGames = (games) => {
  return games.map((game) => {
    return {
      id: Number(game.id),
      name: game.name,
      owner: game.owner,
      createdAt: game.createdAt,
      thumbnail: game.thumbnail || '',
      active: Number(game.active) || 0,
      questions: game.questions ? game.questions.map((q) => mapToQuestion(q)) : [],
    };
  });
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
