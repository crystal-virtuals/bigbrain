import { Field, Label } from '@components/fieldset';
import { ControlledTextarea, LabelTab } from '@components/form';
import {
  Listbox,
  ListboxDescription,
  ListboxLabel,
  ListboxOption,
} from '@components/listbox';
import { questionTypeOptions, durationOptions } from '@constants/question';
import clsx from 'clsx';

function ReadonlyInput({ className, children }) {
  const styles = [
    'text-base/6 text-zinc-950 sm:text-sm/6 py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)] dark:text-white',
  ];
  return <div className={clsx(styles, className)}>{children}</div>;
}

export function InputQuestionName({
  question,
  setQuestion,
  readOnly,
  errors,
  setErrors,
}) {

  return (
    <Field className="col-span-full">
      <LabelTab
        type="neutral"
        label="Question"
        htmlFor="name"
        invalid={errors.has('name') && !readOnly}
        className={clsx(readOnly && 'cursor-default pointer-events-none')}
      >
        <ControlledTextarea
          id="name"
          name="name"
          rows="2"
          value={question.name}
          onChange={(e) =>
            setQuestion((prev) => ({ ...prev, name: e.target.value }))
          }
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

export function SelectQuestionType({ question, setQuestion, readOnly }) {
  return (
    <Field className="col-span-full">
      <Label>Question Type</Label>
      {readOnly ? (
        <ReadonlyInput>
          {
            questionTypeOptions.find((option) => option.value === question.type)
              ?.label
          }
        </ReadonlyInput>
      ) : (
        <Listbox
          name="questionType"
          value={question.type}
          onChange={(e) =>
            setQuestion((prev) => ({ ...prev, type: e.target.value }))
          }
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
      )}
    </Field>
  );
}

export function SelectDuration({ question, setQuestion, readOnly }) {
  return (
    <Field className="col-span-full">
      <Label htmlFor="duration">Time Limit</Label>
      {readOnly ? (
        <ReadonlyInput>
          {
            durationOptions.find((option) => option.value === question.duration)
              ?.label
          }
        </ReadonlyInput>
      ) : (
        <Listbox
          name="duration"
          value={question.duration}
          onChange={(e) =>
            setQuestion((prev) => ({
              ...prev,
              duration: Number(e.target.value),
            }))
          }
        >
          {durationOptions.map((option) => (
            <ListboxOption key={option.value} value={option.value}>
              <ListboxLabel>{option.label}</ListboxLabel>
            </ListboxOption>
          ))}
        </Listbox>
      )}
    </Field>
  );
}
