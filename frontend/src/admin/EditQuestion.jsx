import { EditQuestionForm } from '@/game';
import { FormAlert } from '@components/form';
import { Header } from '@components/heading';
import { Skeleton } from '@components/loading';
import { isEqual } from '@utils/game';
import { isNullOrUndefined } from '@utils/helpers';
import { useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

function EditQuestion() {
  const [errors, setErrors] = useState(new Map());
  const { gameId, questionId } = useParams();
  const { games, updateGame } = useOutletContext();

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
