import { pluralSuffix } from '@utils/helpers';

// example data
const games =  [
  {
    "id": 56513315,
    "name": "My second game",
    "owner": "shrey@unsw.edu.au",
    "questions": [
      {}
    ]
  }
]

export const uid = () => {
  return Math.floor(Math.random() * 1000000);
}

export const isEqual = (game, gameId) => {
  return Number(game.id) === Number(gameId);
};


export const newGame = (name, user) => {
  // generate a random key for the new game
  const key = uid();
  const newGame = {
    id: parseInt(key, 10),
    name: name,
    owner: user.email,
    thumbnail: '',
    createdAt: new Date().toISOString(),
  };
  return newGame;
}

export const getTotalDuration = (questions) => {
  // if no questions, return 0
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
