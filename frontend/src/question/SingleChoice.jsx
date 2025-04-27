import { ControlledInput, LabelTab } from '@components/form';
import { Field } from '@components/fieldset';
import { Button } from '@components/button'
import { PlusIcon } from '@heroicons/react/16/solid'
import { newAnswer, isEqual } from '@utils/game';

// One correct answer
export default function SingleChoice({ answers, setAnswers, readOnly, errors, setErrors }) {
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
          invalid={errors.has('correctAnswer') && !readOnly}
        >
          <ControlledInput
            type="text"
            name="correctAnswer"
            id={correct.id}
            value={correct.name}
            setValue={(value) => updateAnswer({ ...correct, name: value })}
            errors={errors}
            setErrors={setErrors}
            errorMessage="Correct answer cannot be empty"
            className={readOnly && 'before:opacity-90'}
            inputclassname={readOnly && 'cursor-default pointer-events-none'}
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
          invalid={errors.has('falseAnswers') && !readOnly}
        >
          {falses.map((a, index) => (
            <ControlledInput
              type="text"
              name="falseAnswers"
              id={a.id}
              key={a.id}
              value={a.name}
              setValue={(value) => updateAnswer({ ...a, name: value })}
              errors={errors}
              setErrors={setErrors}
              errorMessage="At least one false answer is required"
              correct={false}
              required={index === 0} // only the first false answer is required
              className={readOnly && 'before:opacity-90'}
              inputclassname={readOnly && 'cursor-default pointer-events-none'}
            />
          ))}

          {/* Add at most 5 false answers */}
          {answers.length < 6 && !readOnly && (
            <Button
              type="button"
              onClick={addAnswer}
              className="col-span-full mt-2"
              disabled={readOnly}
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
