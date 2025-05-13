import { Button } from '@components/button';
import { Field, FieldGroup } from '@components/fieldset';
import { CheckboxButton, ControlledInput, LabelTab } from '@components/form';
import { PlusIcon } from '@heroicons/react/16/solid';
import { isEmptyString } from '@utils/helpers';
import { newAnswer, isEqual } from '@utils/game';

// Multiple correct answers
// At least one correct answer is required and one other answer is required
export default function MultipleChoice({ answers, setAnswers }) {

  const isValid = () => {
    // First two answers in the list are required
    return answers.every((a, index) => {
      if (index < 2) {
        return !isEmptyString(a.name);
      }
      return true;
    }) && answers.length > 1;
  }

  const updateAnswer = (id, changes) => {
    const updateAnswers = answers.map(a => isEqual(a, id) ? { ...a, ...changes } : a);
    setAnswers(updateAnswers);
  };

  const addAnswer = () => {
    const newFalseAnswer = newAnswer(false);
    const updatedAnswers = [...answers, newFalseAnswer];
    setAnswers(updatedAnswers);
  }

  return (
    <>
      <FieldGroup className="col-span-full">
        <LabelTab
          type="secondary"
          label="Select the correct answer(s)"
          htmlFor="answers"
          invalid={!isValid()}
        >

          {answers.map((a, index) => (
            <Field className="flex flex-row items-start space-x-3"  key={a.id}>
              <CheckboxButton
                checked={a.correct}
                toggleChecked={() => updateAnswer(a.id, { correct: !a.correct })}
              />
              <ControlledInput
                type='text'
                name="answers"
                id={a.id}
                value={a.name}
                onChange={(e) => updateAnswer(a.id, { name: e.target.value })}
                correct={a.correct}
                required={index < 2} // First two are required
              />
            </Field>
          ))}

          {/* Can be at most 6 answers */}
          {answers.length < 6 &&  (
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
      </FieldGroup>
    </>
  );
}
