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
export const duration = {
  EXTRA_SHORT: 5,
  SHORT: 10,
  NORMAL: 20,
  LONG: 45,
  EXTRA_LONG: 80,
};

export const durationOptions = [
  { label: 'Extra short time (5s)', value: duration.EXTRA_SHORT },
  { label: 'Short time (10s)', value: duration.SHORT },
  { label: 'Normal time (20s)', value: duration.NORMAL },
  { label: 'Long time (45s)', value: duration.LONG },
  { label: 'Extra long time (1m20s)', value: duration.EXTRA_LONG },
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