import { EditQuestionForm } from '@/game';
import { Button } from '@components/button';
import { Card } from '@components/card';
import { FormAlert } from '@components/form';
import { Header } from '@components/heading';
import { Skeleton } from '@components/loading';
import { Strong } from '@components/text';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useToast } from '@hooks/toast';
import { isEqual } from '@utils/game';
import { fileToDataUrl, isNullOrUndefined } from '@utils/helpers';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { FileInput } from '@components/form';

function ThumbnailInput({  }) {
  return (
    <Button outline type="button" className="border border-dashed border-zinc-900/25 dark:border-white/25">
      <div className="text-center px-6 py-10">
        <PhotoIcon
          aria-hidden="true"
          className="mx-auto size-14 text-zinc-300 dark:text-zinc-500"
        />
        <div className="mt-4 flex text-sm/6 text-zinc-600 dark:text-gray-400 justify-center">
          <Strong htmlFor="file-upload">Upload a thumbnail</Strong>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
          />
        </div>
        <p className="text-xs/5 text-zinc-600">PNG, JPG, JPEG up to 10MB</p>
      </div>
    </Button>
  );
}

function QuestionThumbnail({ question, setQuestion }) {
  const styles = [
    'flex flex-col lg:justify-start gap-4 p-4 sm:rounded-xl',
    'bg-zinc-100 dark:bg-zinc-800',
    'shadow-xs ring-1 ring-zinc-900/5',
  ];

  const handleChange = (dataUrl) => {
    setQuestion((prev) => ({ ...prev, thumbnail: dataUrl }));
  }

  return (
    <div className={clsx(styles)}>
      <FileInput
        name="thumbnail"
        value={question.thumbnail}
        onChange={handleChange}
      />
    </div>
  );
}

function EditQuestion() {
  const [errors, setErrors] = useState(new Map());
  const { gameId, questionId } = useParams();
  const { games, updateGame } = useOutletContext();
  const toastify = useToast();

  const game = useMemo(() => {
    if (!games) return null;
    return games.find((game) => isEqual(game, gameId));
  }, [games, gameId]);

  const question = useMemo(() => {
    if (!game) return null;
    return game.questions.find((question) => isEqual(question, questionId));
  }, [game, questionId]);

  const updateQuestion = (editedQuestion) => {
    const updatedQuestions = game.questions.map((question) =>
      isEqual(question, editedQuestion.id) ? { ...editedQuestion } : question
    );
    const updatedGame = { ...game, questions: updatedQuestions };
    return updateGame(updatedGame).then(() => toastify.success('Question updated'))
  };

  const deleteQuestion = () => {
    const updatedQuestions = game.questions.filter(
      (question) => !isEqual(question, questionId)
    );
    const updatedGame = { ...game, questions: updatedQuestions };
    return updateGame(updatedGame);
  };

  // If game is null or undefined
  if (isNullOrUndefined(game) || isNullOrUndefined(game.questions)) {
    return (
      <Skeleton className="col-span-2 max-w-2xl" />
    );
  }

  return (
    <>
      <Header title="Edit Game Question" />
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">

        {/* Form errors */}
        {errors.size > 0 && (
          <FormAlert errors={errors}>
            <ul role="list" className="list-disc space-y-1 pl-5">
              {Array.from(errors).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </FormAlert>
        )}

        {/* Question Form */}
        <EditQuestionForm
          question={question}
          deleteQuestion={deleteQuestion}
          errors={errors}
          setErrors={setErrors}
          onSubmit={updateQuestion}
          isReadOnly={false}
        />
      </div>
    </>
  );
}

export default EditQuestion;
