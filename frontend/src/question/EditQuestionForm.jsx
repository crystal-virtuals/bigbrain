import { Button } from '@components/button';
import { Card } from '@components/card';
import { Skeleton } from '@components/loading';
import { useToast } from '@hooks/toast';
import {
  convertToQuestion,
  mapToQuestion,
  validateQuestion,
} from '@utils/game';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  InputQuestionAnswers,
  InputQuestionName,
  InputQuestionThumbnail,
  SelectDuration,
  SelectPoints,
  SelectQuestionType,
} from './components';
import { DialogWithIcon } from '@components/dialog';

function EditQuestionForm({ question, setErrors, onSubmit }) {
  const [prevFormData, setPrevFormData] = useState(convertToQuestion(question));
  const [formData, setFormData] = useState(convertToQuestion(question));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toastify = useToast();

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const validate = () => {
    const validationErrors = validateQuestion(formData);
    setErrors(validationErrors);
    return validationErrors.size === 0;
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
    setErrors(new Map());
    setIsConfirmOpen(false);
    // navigate back
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!validate()) return;

    setIsSubmitting(true);
    const pendingQuestion = mapToQuestion(formData);
    onSubmit(pendingQuestion)
      .then(() => {
        console.log('Question updated successfully:', pendingQuestion);
        setPrevFormData(pendingQuestion);
        setFormData(pendingQuestion);
        setErrors(new Map());
        toastify.success({ message: 'Updated question' });
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
      <InputQuestionThumbnail question={formData} setQuestion={setFormData} />

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
          </div>
        </form>
      </Card>

      {/* Confirm Dialog */}
      <DialogWithIcon
        icon="warning"
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          discardChanges();
        }}
        title="Unsaved changes"
        description="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
      />
    </>
  );
}

export default EditQuestionForm;
