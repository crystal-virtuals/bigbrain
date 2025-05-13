import { Badge } from '@components/badge';
import { Card } from '@components/card';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@components/dropdown';
import { Field, Label } from '@components/fieldset';
import { CheckboxButton } from '@components/form';
import { Link } from '@components/link';
import { DialogWithIcon } from '@components/dialog';
import { Strong } from '@components/text';
import { durationOptions, questionTypeOptions, questionTypes } from '@constants/questions';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { useToast } from '@hooks/toast';
import { isEmptyString, pluralSuffix } from '@utils/helpers';
import clsx from 'clsx';
import { useState } from 'react';

function QuestionMenu({ questionId, deleteQuestion }) {
  const url = `question/${questionId}`;

  return (
    <Dropdown>
      <DropdownButton plain aria-label="More options">
        <EllipsisVerticalIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem href={url}>Edit</DropdownItem>
        <DropdownItem onClick={() => deleteQuestion()}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

function Container({ className, children }) {
  const styles = [
    // Basic layout
    'relative block w-full appearance-none rounded-lg',
    // Padding
    'py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)] mt-3',
    // Typography
    'text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white',
  ];
  return <div className={clsx(className, styles)}>{children}</div>;
}

function QuestionAnswers({ question }) {
  const styles = [
    // Basic layout
    'w-full rounded-lg flex flex-row items-center space-x-3 py-2',
    // Background
    'bg-zinc-400/10 dark:bg-white/10',
  ]

  if (isEmptyString(question.name) || question.answers.length === 0) {
    return null;
  }

  if (question.type === questionTypes.JUDGEMENT) {
    return (
      <div className="flex flex-col space-y-4">
        <div className={clsx(styles)}>
          <CheckboxButton
            checked={question.answers.find((a) => a.correct)?.name === 'True'}
            className="size-6 cursor-default pointer-events-none"
          />
          <span className="text-zinc-950 dark:text-white text-base/6 sm:text-sm/6">
            {question.answers.find((a) => a.correct)?.name === 'True' ? 'True' : 'False'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {question.answers.map((a) => (
        <div className={clsx(styles)} key={a.id}>
          <CheckboxButton
            checked={a.correct}
            className="size-6 cursor-default pointer-events-none"
          />
          <span className="text-zinc-950 dark:text-white text-base/6 sm:text-sm/6">
            {a.name}
          </span>
        </div>
      ))}
    </div>
  );
}

function QuestionHeader({ index, question }) {
  const url = `question/${question.id}`;

  if (isEmptyString(question.name)) {
    return (
      <>
        <Label className='font-medium'>Question {index + 1}</Label>
        <Container>
          <Strong>Empty question. </Strong>
          <Link className="hover:text-accent hover:underline " to={url}>
            Get started here
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </Container>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-row gap-2">
        {!isEmptyString(question.thumbnail) && (
          <img
            src={question.thumbnail}
            alt="Question Thumbnail"
            className="size-24 rounded-lg object-cover"
          />
        )}
        <div className="ml-2 flex flex-col justify-center">
          <Label className='font-medium'>Question {index + 1}</Label>
          <Container>{question.name}</Container>
        </div>
      </div>
    </>
  );
}

function QuestionCard({ index, question, deleteQuestion }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const questionType = questionTypeOptions.find((option) => option.value === question.type)?.label;
  const questionDuration = durationOptions.find((option) => option.value === question.duration)?.label;
  const toastify = useToast();

  const deleteThisQuestion = () => {
    deleteQuestion(question.id)
      .then(() => toastify.success({ message: 'Question deleted'}))
      .catch(() => toastify.error({ message: 'Failed to delete question. Please try again later.'}))
      .finally(() => setIsDeleteOpen(false));
  }

  return (
    <>
      <Card className="mb-6" >
        <div className="relative px-4 py-6 sm:p-8">

          <div className="absolute top-4 right-4">
            <QuestionMenu
              questionId={question.id}
              deleteQuestion={() => setIsDeleteOpen(true)}
            />
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">

            <Field className="col-span-full">
              <QuestionHeader index={index} question={question} />
            </Field>

            <Field className="col-span-full">
              <QuestionAnswers question={question} />
            </Field>

            <Field className="col-span-full flex flex-row items-center gap-2">
              <Badge color="lime">{questionType}</Badge>
              <Badge color="fuchsia">{questionDuration}</Badge>
              <Badge color="amber">{question.points} point{pluralSuffix(question.points)}</Badge>
            </Field>

          </div>
        </div>
      </Card>

      {/* Delete Dialog */}
      <DialogWithIcon
        icon="error"
        title="Delete this question?"
        description="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={deleteThisQuestion}
      />
    </>
  )
}

export default QuestionCard;