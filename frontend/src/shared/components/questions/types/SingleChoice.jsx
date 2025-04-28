import { ControlledInput, LabelTab } from '@components/form';
import { Field } from '@components/fieldset';
import { Button } from '@components/button'
import { PlusIcon } from '@heroicons/react/16/solid'
import { newAnswer, isEqual } from '@utils/game';
import { isEmptyString } from '@utils/helpers';

// One correct answer
export default function SingleChoice({ answers, setAnswers }) {
  let correct = answers.find((a) => a.correct); // single (0-1) correct answer
  let falses = answers.filter((a) => !a.correct); // multiple (1-5) false answers

  const updateAnswer = (answer) => {
    const updatedAnswers = answers.map((a) =>
      isEqual(a, answer.id) ? answer : a
    );
    setAnswers(updatedAnswers);
  };

  const addAnswer = () => {
    const newFalseAnswer = newAnswer(false);
    const updatedAnswers = [...answers, newFalseAnswer];
    setAnswers(updatedAnswers);
  };

  return (
    <>
      <Field className="col-span-full">
        <LabelTab
          type="correct"
          label="Correct answer"
          htmlFor="correctAnswer"
          invalid={isEmptyString(correct.name)}
        >
          <ControlledInput
            type="text"
            name="correctAnswer"
            id={correct.id}
            value={correct.name}
            onChange={(e) => updateAnswer({ ...correct, name: e.target.value })}
            correct
            required
          />
        </LabelTab>
      </Field>

      <Field className="col-span-full">
        <LabelTab
          type="false"
          label="False answers"
          htmlFor="falseAnswers"
          invalid={isEmptyString(falses[0]?.name)}
        >
          {falses.map((a, index) => (
            <ControlledInput
              type="text"
              name="falseAnswers"
              id={a.id}
              key={a.id}
              value={a.name}
              onChange={(e) => updateAnswer({ ...a, name: e.target.value })}
              correct={false}
              required={index === 0} // only the first false answer is required
            />
          ))}

          {/* Add at most 5 false answers */}
          {answers.length < 6 && (
            <Button
              type="button"
              className="col-span-full mt-2"
              onClick={addAnswer}
            >
              <PlusIcon />
              Add another accepted answer
            </Button>
          )}

        </LabelTab>
      </Field>
    </>
  );
}
