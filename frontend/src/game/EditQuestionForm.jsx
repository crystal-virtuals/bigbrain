import { Card } from '@components/card';
import { questionTypes } from '@constants/question';
import { mapToQuestion } from '@utils/game';
import { useState } from 'react';
import { isEmptyString, pluralSuffix } from '../shared/utils/helpers';
import { Button } from '@components/button';
import { ConfirmModal } from '@components/modal';
import { PencilIcon } from '@heroicons/react/24/solid';
import { InputQuestionName, InputQuestionAnswers, SelectQuestionType, SelectTimeLimit } from '../question'
import { XCircleIcon } from '@heroicons/react/20/solid'

export function FormAlert( { errors } ) {
  const hasErrors = errors.size > 0;
  if (!hasErrors) return null;

  return (
    <div className="rounded-md bg-red-50 p-4 col-span-full border-2 border-red-100">
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">There {errors.size === 1 ? 'is' : 'were'} {errors.size} error{pluralSuffix(errors.size)} with your submission</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc space-y-1 pl-5">
              {Array.from(errors).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditQuestionForm({ question, onSubmit }) {
  const [prevFormData] = useState(question);
  const [formData, setFormData] = useState(question);
  const [errors, setErrors] = useState(new Map());
  const [readOnly, setReadOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const validate = () => {
    const newErrors = new Map();
    if (isEmptyString(formData.name)) {
      newErrors.set('name', 'Question cannot be empty');
    }
    if (formData.answers.length < 2) {
      newErrors.set('answers', 'At least two answers are required');
    }
    if (formData.type === questionTypes.SINGLE_CHOICE && formData.answers.filter(a => a.correct).length !== 1) {
      newErrors.set('correctAnswer', 'There must be exactly one correct answer');
    }
    setErrors(newErrors);
  }

  const discardChanges = () => {
    setFormData(prevFormData);
    setReadOnly(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    const isDirty = !isEqual(formData, prevFormData);
    if (isDirty) {
      setIsOpen(true);
    } else {
      discardChanges();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    console.log('Form errors:', errors);
    if (errors.size > 0) {
      return;
    }

    setIsSubmitting(true);
    const question = mapToQuestion(formData);
    onSubmit(question)
      .then(() => {
        console.log('Question updated successfully:', question);
        setReadOnly(true);
      })
      .catch((error) => {
        console.error('Error updating question:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate>
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            {/* Form errors */}
            <FormAlert errors={errors} />

            {/* Question name */}
            <InputQuestionName
              question={formData}
              setQuestion={setFormData}
              readOnly={readOnly}
              errors={errors}
              setErrors={setErrors}
            />

            {/* Question answers */}
            <InputQuestionAnswers
              question={formData}
              answers={formData.answers}
              setAnswers={(answers) => setFormData(prev => ({ ...prev, answers }))}
              readOnly={readOnly}
              errors={errors}
              setErrors={setErrors}
            />

            {/* Question type */}
            <SelectQuestionType question={formData} setQuestion={setFormData} />

            {/* Time limit */}
            <SelectTimeLimit question={formData} setQuestion={setFormData} />

          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 border-t border-zinc-900/10 dark:border-white/10 px-4 py-4 sm:px-8">
          {readOnly ? (
            <Button type="button" color='white' onClick={() => setReadOnly(false)}>
              <PencilIcon aria-hidden="true" />
              Edit
            </Button>
          ) : (
            <>
              <Button type="button" onClick={handleCancel} disabled={isSubmitting} outline>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting} disabled={isSubmitting} color='teal'>
                Save
              </Button>
            </>
          )}
        </div>
      </form>

      {/* Confirm Dialog */}
      <ConfirmModal
        title="Unsaved changes"
        description="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
        style="warning"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onConfirm={discardChanges}
      />
    </Card>

  );
}

export default EditQuestionForm;
