import { Button } from '@components/button';
import { Card } from '@components/card';
import { AlertModal, ConfirmModal } from '@components/modal';
import { InputQuestionAnswers, InputQuestionName, SelectDuration, SelectQuestionType, SelectPoints } from '@components/questions';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { convertToQuestion, isEmptyQuestion, mapToQuestion, validateQuestion } from '@utils/game';
import clsx from 'clsx';
import { useState } from 'react';
import { ThumbnailInput } from '@components/form';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@components/loading';

function QuestionThumbnail({ question, setQuestion }) {
  const styles = [
    'flex flex-col lg:justify-start gap-4 p-4 sm:rounded-xl',
    'bg-zinc-100 dark:bg-zinc-800',
    'shadow-xs ring-1 ring-zinc-900/5',
  ];

  const setThumbnail = (dataUrl) => {
    setQuestion((prev) => ({ ...prev, thumbnail: dataUrl }));
  }

  return (
    <div className={clsx(styles)}>
      <ThumbnailInput
        name="thumbnail"
        value={question.thumbnail}
        onChange={(dataUrl) => setThumbnail(dataUrl)}
      />
    </div>
  );
}

function EditQuestionForm({ question, deleteQuestion, setErrors, onSubmit, isReadOnly = false }) {
  const [prevFormData, setPrevFormData] = useState(convertToQuestion(question));
  const [formData, setFormData] = useState(convertToQuestion(question));
  const [readOnly, setReadOnly] = useState(isReadOnly);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const validate = () => {
    const validationErrors = validateQuestion(formData);
    console.log('Validation errors:', validationErrors);
    setErrors(validationErrors);
    return validationErrors.size === 0;
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteOpen(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setReadOnly(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    const isDirty = !isEqual(formData, prevFormData);
    if (isDirty) {
      setIsConfirmOpen(true);
    } else {
      discardChanges();
    }
  };

  const discardChanges = () => {
    setFormData(prevFormData);
    setIsConfirmOpen(false);
    navigate(-1);
  };

  const deleteThisQuestion = () => {
    deleteQuestion(question.id)
      .finally(() => {
        setIsDeleteOpen(false)
        // navigate back
        navigate(-1);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!validate()) return;

    setIsSubmitting(true);
    const question = mapToQuestion(formData);

    onSubmit(question)
      .then(() => {
        console.log('Question updated successfully:', question);
        setPrevFormData(question);
        setFormData(question);
        setErrors(new Map());
        // navigate back
        navigate(-1);

      })
      .catch((error) => {
        console.error('Error updating question:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!question || !formData) {
    return (
      <div className="col-span-2 max-w-2xl">
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <>
      {/* Question Thumbnail */}
      <QuestionThumbnail question={formData} setQuestion={setFormData}/>

      {/* Question Form */}
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Question name */}
              <InputQuestionName
                question={formData}
                setQuestion={setFormData}
              />

              {/* Question answers */}
              <InputQuestionAnswers
                type={formData.type}
                answers={formData.answers}
                setAnswers={(answers) =>
                  setFormData((prev) => ({ ...prev, answers }))
                }
              />

              {/* Question type */}
              <SelectQuestionType
                question={formData}
                setQuestion={setFormData}
                resetForm={() => setErrors(new Map())}
              />

              {/* Time limit */}
              <SelectDuration question={formData} setQuestion={setFormData} />

              {/* Points */}
              <SelectPoints question={formData} setQuestion={setFormData} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-6 border-t border-zinc-900/10 dark:border-white/10 px-4 py-4 sm:px-8">
            {readOnly ? (
              <>
                <Button type="button" color="red" onClick={handleDelete}>
                  <TrashIcon aria-hidden="true" />
                  Delete
                </Button>

                <Button type="button" color="white" onClick={handleEdit}>
                  <PencilIcon aria-hidden="true" />
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  outline
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  color="teal"
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>

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
    </>
  );
}

export default EditQuestionForm;
