import { Header } from '@components/heading';
import { Skeleton } from '@components/loading';
import { isEqual } from '@utils/game';
import { isNullOrUndefined } from '@utils/helpers';
import { useMemo } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { Breadcrumbs } from '@components/breadcrumbs';

const breadcrumbs = [
  { label: 'Dashboard', link: '/dashboard' },
  { label: 'Edit Game Question' },
];

function QuestionLayout() {
  const { questionId } = useParams();
  const { game, updateGame } = useOutletContext();

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

  return (
    <>
      <div className="mb-10 flex w-full items-center justify-between">
        <Breadcrumbs crumbs={breadcrumbs} />
      </div>

      <Header title="Edit Game Question" />
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        {
          isNullOrUndefined(game) || isNullOrUndefined(question) ? (
            <Skeleton className="col-span-2 max-w-2xl" />
          ) : (
            <Outlet context={{ question, updateQuestion }} />
          )
        }
      </div>
    </>
  );
}

export default QuestionLayout;
