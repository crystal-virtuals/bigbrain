import { Button } from '@components/button';
import { Field, FieldGroup } from '@components/fieldset';
import { CheckboxButton, ControlledInput, LabelTab } from '@components/form';
import { PlusIcon } from '@heroicons/react/16/solid';
import { uid } from '@utils/helpers';

function ChoiceInput({ value, setValue, correct, setCorrect, required=false }) {
  return (
    <Field className="flex flex-row items-start space-x-3">
      <CheckboxButton checked={correct} setChecked={setCorrect} />
      <ControlledInput
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        correct={correct}
      />
    </Field>
  );
}

// Multiple correct answers
// but at least one correct answer is required
// and one other answer is required
export default function MultipleChoice({ answers, setAnswers }) {

  const updateAnswer = (id, changes) => {
    setAnswers(answers.map(a => a.id === id ? { ...a, ...changes } : a));
  };

  const addAnswer = () => {
    const newId = uid();
    setAnswers(prev => [...prev, { id: newId, name: '', correct: false }]);
  }

  return (
    <>
      <FieldGroup className="col-span-full">
        <LabelTab type="dark" label="Select the correct answer(s)">

          {answers.map((a, index) => (
            <ChoiceInput
              key={a.id}
              value={a.name}
              setValue={(value) => updateAnswer(a.id, { name: value })}
              correct={a.correct}
              setCorrect={(bool) => updateAnswer(a.id, { correct: bool })}
              required={index < 2} // First two are required
            />
          ))}

          {/* Can be at most 6 answers */}
          {answers.length < 6 && (
            <Button type="button" onClick={addAnswer} className="mt-2">
              <PlusIcon />
              Add another accepted answer
            </Button>
          )}

        </LabelTab>
      </FieldGroup>
    </>
  );
}
