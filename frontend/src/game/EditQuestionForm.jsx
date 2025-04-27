import { Button } from '@components/button';
import { Card } from '@components/card';
import { ConfirmModal, AlertModal} from '@components/modal';
import { XCircleIcon } from '@heroicons/react/20/solid';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { mapToQuestion, convertToQuestion, isEmptyQuestion, validateQuestion } from '@utils/game';
import { useState } from 'react';
import { InputQuestionAnswers, InputQuestionName, SelectQuestionType, SelectDuration } from '../question';
import { pluralSuffix } from '@utils/helpers';

export function FormAlert( { errors } ) {
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

function EditQuestionForm({ question, deleteQuestion, onSubmit }) {
  const [prevFormData, setPrevFormData] = useState(convertToQuestion(question));
  const [formData, setFormData] = useState(convertToQuestion(question));
  const [errors, setErrors] = useState(new Map());
  const [readOnly, setReadOnly] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const validate = (question) => {
    if (errors.size > 0) {
      setShowErrors(true);
      return false;
    }
    const validationErrors = validateQuestion(question);
    setErrors(validationErrors);
    setShowErrors(true);
    return validationErrors.size === 0;
  }

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteOpen(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setReadOnly(false);
  }

  const handleCancel = (e) => {
    e.preventDefault();

    const isDirty = !isEqual(formData, prevFormData);
    const isEmpty = isEmptyQuestion(prevFormData);

    // If the question is empty, this is equivalent to deleting it
    if (isEmpty) {
      setIsDeleteOpen(true);
    } else if (isDirty) {
      setIsConfirmOpen(true);
    } else {
      discardChanges();
    }
  };

  const discardChanges = () => {
    setFormData(prevFormData);
    setReadOnly(true);
    setIsConfirmOpen(false);
  };

  const deleteThisQuestion = () => {
    deleteQuestion(question.id).finally(() => setIsDeleteOpen(false));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!validate(formData)) return;

    setIsSubmitting(true);
    const question = mapToQuestion(formData);
    onSubmit(question)
      .then(() => {
        console.log('Question updated successfully:', question);
        setPrevFormData(question);
        setFormData(question);
      })
      .catch((error) => {
        console.error('Error updating question:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setReadOnly(true);
      });
  }

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Form errors */}
            {showErrors && errors.size > 0 && <FormAlert errors={errors} />}

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
              setQuestion={setFormData}
              answers={formData.answers}
              setAnswers={(answers) => setFormData(prev => ({ ...prev, answers }))}
              readOnly={readOnly}
              errors={errors}
              setErrors={setErrors}
              invalid={errors.has('answers') && !readOnly}
            />

            {/* Question type */}
            <SelectQuestionType question={formData} setQuestion={setFormData} readOnly={readOnly} />

            {/* Time limit */}
            <SelectDuration question={formData} setQuestion={setFormData} readOnly={readOnly} />

          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 border-t border-zinc-900/10 dark:border-white/10 px-4 py-4 sm:px-8">
          {readOnly ? (
            <>
              <Button type="button" color='red' onClick={handleDelete}>
                <TrashIcon aria-hidden="true" />
                Delete
              </Button>

              <Button type="button" color='white' onClick={handleEdit}>
                <PencilIcon aria-hidden="true" />
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button type="button" onClick={handleCancel} disabled={isSubmitting} outline>
                Cancel
              </Button>

              <Button type="submit" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting} color='teal'>
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
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        onConfirm={discardChanges}
      />

      {/* Delete Dialog */}
      <AlertModal
        title="Delete this question?"
        description="You are about to delete this question and all of its data. No one will be able to access this question ever again."
        confirmText="Delete"
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        onConfirm={deleteThisQuestion}
      />
    </Card>

  );
}

export default EditQuestionForm;
