import { questionTypes } from '@constants/question';
import SingleChoice from './SingleChoice';
import MultipleChoice from './MultipleChoice';
import Judgement from './Judgement';

function InputQuestionAnswers( { question, answers, setAnswers, readOnly, errors, setErrors }) {
  if (!question || !question.answers) {
    return null;
  }

  const AnswerComponent = {
    [questionTypes.SINGLE_CHOICE]: SingleChoice,
    [questionTypes.MULTIPLE_CHOICE]: MultipleChoice,
    [questionTypes.JUDGEMENT]: Judgement,
  }[question.type];

  return (
    <AnswerComponent
      answers={answers}
      setAnswers={setAnswers}
      readOnly={readOnly}
      errors={errors}
      setErrors={setErrors}
    />
  );
}

export default InputQuestionAnswers;