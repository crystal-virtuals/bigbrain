import { Field, Label } from '@components/fieldset';
import { ControlledTextarea, LabelTab } from '@components/form';
import {
  Listbox,
  ListboxDescription,
  ListboxLabel,
  ListboxOption,
} from '@components/listbox';
import {
  questionTypeOptions,
  timeLimitOptions,
} from '@constants/question';

export function InputQuestionName({ question, setQuestion, readOnly, errors, setErrors }) {
  return (
    <Field className="col-span-full">
      <LabelTab type="neutral" label="Question" htmlFor="name" invalid={errors.has("name")}>
        <ControlledTextarea
          id="name"
          name="name"
          rows="2"
          value={question.name}
          onChange={(e) => setQuestion((prev) => ({ ...prev, name: e.target.value }))}
          errors={errors}
          setErrors={setErrors}
          readOnly={readOnly}
          errorMessage="Question cannot be empty"
          required
        />
      </LabelTab>
    </Field>
  );
}

export function SelectQuestionType({ question, setQuestion }) {
  return (
    <Field className="col-span-full">
      <Label>Question Type</Label>
      <Listbox
        name="questionType"
        value={question.type}
        onChange={(e) => setQuestion((prev) => ({ ...prev, type: e.target.value }))}
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

export function SelectTimeLimit({ question, setQuestion }) {
  return (
    <Field className="col-span-full">
      <Label htmlFor='timeLimit'>Time Limit</Label>
      <Listbox
        name="timeLimit"
        value={question.timeLimit}
        onChange={(e) => setQuestion((prev) => ({ ...prev, timeLimit: Number(e.target.value) }))}
      >
        {timeLimitOptions.map((option) => (
          <ListboxOption key={option.value} value={option.value}>
            <ListboxLabel>{option.label}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
    </Field>
  );
}
