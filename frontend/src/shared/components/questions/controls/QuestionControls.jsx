import { Field, Label } from '@components/fieldset';
import { ControlledTextarea, LabelTab } from '@components/form';
import {
  Listbox,
  ListboxDescription,
  ListboxLabel,
  ListboxOption,
} from '@components/listbox';
import { durationOptions, questionTypeOptions, pointOptions } from '@constants/questions';
import { isEmptyString } from '@utils/helpers';
import { changeQuestionType } from '@utils/game';

export function InputQuestionName ({ question, setQuestion }) {
  const handleChange = (e) => {
    const value = e.target.value;
    setQuestion((prev) => ({ ...prev, name: value }));
  }

  return (
    <Field className="col-span-full">
      <LabelTab
        type="neutral"
        label="Question"
        htmlFor="name"
        invalid={isEmptyString(question.name)}
      >
        <ControlledTextarea
          id="name"
          rows="2"
          name="name"
          value={question.name}
          onChange={handleChange}
          required
        />
      </LabelTab>
    </Field>
  );
}

export function SelectQuestionType({ question, setQuestion, resetForm }) {
  const handleChange = (type) => {
    const newQuestion = changeQuestionType(question, type);
    setQuestion(newQuestion);
    resetForm();
  }

  return (
    <Field className="col-span-full">
      <Label htmlFor="duration">Question Type</Label>
      <Listbox
        name="questionType"
        value={question.type}
        onChange={handleChange}
      >
        {questionTypeOptions.map((option) => (
          <ListboxOption key={option.value} value={option.value}>
            <ListboxLabel>{option.label}</ListboxLabel>
            {option.description && (
              <ListboxDescription>{option.description}</ListboxDescription>
            )}
          </ListboxOption>
        ))}
      </Listbox>
    </Field>
  );
}

export function SelectDuration({ question, setQuestion }) {
  return (
    <Field className="col-span-full">
      <Label htmlFor="duration">Duration</Label>
      <Listbox
        name="duration"
        value={question.duration}
        onChange={(value) => setQuestion((prev) => ({ ...prev, duration: Number(value) }))}
      >
        {durationOptions.map((option) => (
          <ListboxOption key={option.value} value={option.value}>
            <ListboxLabel>{option.label}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
    </Field>
  );
}

export function SelectPoints({ question, setQuestion }) {
  return (
    <Field className="col-span-full">
      <Label htmlFor="duration">Points</Label>
      <Listbox
        name="duration"
        value={question.points}
        onChange={(value) => setQuestion((prev) => ({ ...prev, points: Number(value) }))}
      >
        {pointOptions.map((option) => (
          <ListboxOption key={option.value} value={option.value}>
            <ListboxLabel>{option.label}</ListboxLabel>
            {option.description && (
              <ListboxDescription>{option.description}</ListboxDescription>
            )}
          </ListboxOption>
        ))}
      </Listbox>
    </Field>
  );
}
