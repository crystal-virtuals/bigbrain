import { Fieldset, Label, Legend } from '@components/fieldset';
import { Radio, RadioField, RadioGroup } from '@components/radio';

// One answer, either true or false
export default function Judgement({ answers, setAnswers }) {
  const selectedValue = answers.find(a => a.correct)?.name || 'True';

  const updateAnswer = (value) => {
    const updatedAnswers = answers.map((a) => ({
      ...a,
      correct: a.name === value
    }));
    setAnswers(updatedAnswers);
  };

  return (
    <>
      <Fieldset className="col-span-full">
        <Legend>Select the correct answer</Legend>
        <RadioGroup
          name="answers"
          value={selectedValue}
          onChange={(value) => updateAnswer(value)}
        >
          <RadioField>
            <Radio color="green" value="True" />
            <Label>True</Label>
          </RadioField>
          <RadioField>
            <Radio color="red" value="False" />
            <Label>False</Label>
          </RadioField>
        </RadioGroup>
      </Fieldset>
    </>
  );
}
