import {
  Judgement,
  MultipleChoice,
  SingleChoice,
} from '@components/questions/types';
import { questionTypes } from '@constants/questions';

function InputQuestionAnswers({ type, answers, setAnswers }) {
  if (!type || !answers) {
    return null;
  }

  const AnswerComponent = {
    [questionTypes.SINGLE_CHOICE]: SingleChoice,
    [questionTypes.MULTIPLE_CHOICE]: MultipleChoice,
    [questionTypes.JUDGEMENT]: Judgement,
  }[type];

  return (
    <AnswerComponent
      answers={answers}
      setAnswers={setAnswers}
    />
  );
}

export default InputQuestionAnswers;
