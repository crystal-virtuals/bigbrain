/***************************************************************
    Question Type (multiple choice, single choice, judgement)
***************************************************************/
export const questionTypes = {
  SINGLE_CHOICE: 'singleChoice',
  MULTIPLE_CHOICE: 'multipleChoice',
  JUDGEMENT: 'judgement',
};

export const questionTypeOptions = [
  {
    value: questionTypes.SINGLE_CHOICE,
    label: 'Single Choice',
    description: 'One correct answer',
  },
  {
    value: questionTypes.MULTIPLE_CHOICE,
    label: 'Multiple Choice',
    description: 'Multiple correct answers',
  },
  {
    value: questionTypes.JUDGEMENT,
    label: 'Judgement',
    description: 'True or False',
  },
];

/***************************************************************
  Time limit that users have to answer the question (as a number)
***************************************************************/
export const timeLimit = {
  EXTRA_SHORT: 5,
  SHORT: 10,
  NORMAL: 20,
  LONG: 45,
  EXTRA_LONG: 80,
};

export const timeLimitOptions = [
  { label: 'Extra short time (5s)', value: timeLimit.EXTRA_SHORT },
  { label: 'Short time (10s)', value: timeLimit.SHORT },
  { label: 'Normal time (20s)', value: timeLimit.NORMAL },
  { label: 'Long time (45s)', value: timeLimit.LONG },
  { label: 'Extra long time (1m20s)', value: timeLimit.EXTRA_LONG },
];

/***************************************************************
  Points for how much the question is worth
***************************************************************/
export const points = {
  NONE: 0,
  STANDARD: 1,
  DOUBLE: 2,
};

export const pointOptions = [
  {
    label: 'Standard',
    value: points.STANDARD,
    description: 'Award 1 point for each correct answer',
  },
  {
    label: 'Double',
    value: points.DOUBLE,
    description: 'Award 2 points for each correct answer',
  },
  {
    label: 'No points',
    value: points.NONE,
    description: 'No points for this question',
  },
]

// example question data
const questions = [
  {
    id: 1, // Used in JSX as a key
    thumbnail: '', // dataurl
    name: 'What is your favorite color?',
    type: questionTypes.SINGLE_CHOICE,
    timeLimit: timeLimit.NORMAL, // number
    points: points.STANDARD, // number
    answers: [
      { id: 1, name: 'Red' }, // Unique answer ID; Used in JSX as a key
      { id: 2, name: 'Green' },
      { id: 3, name: 'Blue' },
      { id: 4, name: 'Yellow' },
    ],
    correctAnswers: [1, 3], // an array of correct answer IDs
  },
]