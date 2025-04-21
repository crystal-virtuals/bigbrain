import { useEditForm } from '@/shared/hooks/form/useEditForm';
import { Checkbox } from '@components/checkbox';
import { Field, Label, Fieldset, Legend } from '@components/fieldset';
import { EditForm, TextInput } from '@components/form';
import { Input } from '@components/input';
import { Select } from '@components/select';
import * as Headless from '@headlessui/react';

const questionTimes = {
  extraShort: 5,
  short: 10,
  normal: 20,
  long: 45,
  extraLong: 80,
};

const questionTypes = {
  trueFalse: 'trueFalse',
  checkboxes: 'checkboxes',
  typeAnswer: 'typeAnswer',
};

function Card({ children }) {
  return (
    <div className="bg-white dark:bg-pink-100/5 shadow-xs ring-1 ring-zinc-900/5 sm:rounded-xl md:col-span-2">
      {children}
    </div>
  );
}

function SelectQuestionType({ formData, handleChange }) {
  return (
    <Field className="col-span-full">
      <Headless.Field className="flex items-baseline justify-items-start gap-6">
        <Label className="flex-1">Question Type</Label>
        <Select
          className="flex-1"
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value="trueFalse">True/False</option>
          <option value="checkboxes">Checkboxes</option>
          <option value="typeAnswer">Type Answer</option>
        </Select>
      </Headless.Field>
    </Field>
  );
}

function SelectTimeLimit({ formData, handleChange }) {
  return (
    <Field className="col-span-full">
      <Headless.Field className="flex items-baseline justify-items-start gap-6">
        <Label className="flex-1">Time Limit</Label>
        <Select
          name="timeLimit"
          className="flex-1"
          value={formData.timeLimit}
          onChange={(e) => handleChange('timeLimit', e.target.value)}
        >
          <option value="extraShort">Extra short time (5s)</option>
          <option value="short">Short time (10s)</option>
          <option value="normal">Normal time (20s)</option>
          <option value="long">Long time (45s)</option>
          <option value="extraLong">Extra long time (1m20s)</option>
        </Select>
      </Headless.Field>
    </Field>
  );
}

function InputQuestion({ formData, handleChange }) {
  return (
    <Field className="col-span-full">
      <Label htmlFor="name">Question</Label>
      <TextInput
        name="question"
        value={formData.question}
        onChange={(value) => handleChange('question', value)}
        type="text"
        placeholder="Required"
        rows="2"
        maxlength="120"
      />
    </Field>
  );
}

function InputAnswer({ formData, handleChange }) {
  return (
    <Field className="col-span-full">
      <div className="flex flex-row items-center space-x-3">
        <Button type="button">x</Button>
        <Input
          name="1"
          value={props.formData.answer1}
          onChange={(value) => props.handleChange('answer1', value)}
          maxlength="75"
          placeholder="Required"
        />
      </div>
    </Field>
  );
}

export function QuestionForm({ question, onSubmit }) {
  const props = useEditForm(question, onSubmit);

  return (
    <>
      <Card>
        <EditForm {...props}>
          {/* question */}
          <InputQuestion
            formData={props.formData}
            handleChange={props.handleChange}
          />
          {/* question answers */}
          <Field className="col-span-full">
            <Fieldset className="flex flex-col gap-4">
              <Legend>Answers</Legend>
              {props.formData.answers.map((answer, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox name={index} />
                  <Input
                    name={index}
                    value={answer}
                    onChange={(value) => props.handleChange(index, value)}
                    placeholder={index === 0 ? 'Required' : 'Optional'}
                  />
                </div>
              ))}
            </Fieldset>
          </Field>

          {/* question type */}
          <SelectQuestionType
            formData={props.formData}
            handleChange={props.handleChange}
          />
          {/* question time limit */}
          <SelectTimeLimit
            formData={props.formData}
            handleChange={props.handleChange}
          />
        </EditForm>
      </Card>
    </>
  );
}
