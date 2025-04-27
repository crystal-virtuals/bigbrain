import { EditGameForm } from '@/game';
import { Navbar, Sidebar } from '@components/dashboard';
import { Heading, Subheading } from '@components/heading';
import { Skeleton } from '@components/loading';
import { StackedLayout } from '@components/stacked-layout';
import { Text } from '@components/text';
import { isEqual, newQuestion } from '@utils/game';
import { isNullOrUndefined } from '@utils/helpers';
import { useMemo } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { EditQuestionForm, EmptyState } from '@/game';
import { PlusIcon } from '@heroicons/react/16/solid';
import { Button } from '@components/button';
import { useState } from 'react';
import NewQuestionModal from '../game/NewQuestionModal';

function Header({ title }) {
  return (
    <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
      <Heading>{title}</Heading>
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <Subheading>{title}</Subheading>
        <Text className="mt-1">{description}</Text>
      </div>
      {children}
    </div>
  );
}

function AddQuestionButton({ className, createQuestion }) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button color="dark/white" className={className} onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Add question
      </Button>

      <NewQuestionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        createQuestion={createQuestion}
      />
    </>
  )
}

function EditQuestionsForm({
  game,
  createQuestion,
  updateQuestion,
  deleteQuestion,
}) {

  if (!game || !game.questions || game.questions.length === 0) {
    return (
      <EmptyState className="col-span-2" createQuestion={createQuestion} />
    );
  }

  return (
    <div className="col-span-2 flex flex-col">
      {game.questions.map((question) => (
        <EditQuestionForm
          key={question.id}
          question={question}
          deleteQuestion={deleteQuestion}
          onSubmit={updateQuestion}
        />
      ))}
      <AddQuestionButton className="self-end" createQuestion={createQuestion} />
    </div>
  );
}

export default function EditGame() {
  const { gameId } = useParams();
  const { user, games, updateGame } = useOutletContext();

  const game = useMemo(() => {
    if (!games) return null;
    return games.find((game) => isEqual(game, gameId));
  }, [games, gameId]);

  const createQuestion = (questionType) => {
    const question = newQuestion(questionType);
    const updatedQuestions = [...game.questions, question];
    const updatedGame = { ...game, questions: updatedQuestions };
    return updateGame(updatedGame);
  };

  const updateQuestion = (editedQuestion) => {
    const updatedQuestions = game.questions.map((question) =>
      isEqual(question, editedQuestion.id) ? { ...editedQuestion } : question
    );
    const updatedGame = { ...game, questions: updatedQuestions };
    return updateGame(updatedGame);
  };

  const deleteQuestion = (questionId) => {
    const updatedQuestions = game.questions.filter(
      (question) => !isEqual(question, questionId)
    );
    const updatedGame = { ...game, questions: updatedQuestions };
    return updateGame(updatedGame);
  };

  return (
    <>
      <StackedLayout
        navbar={<Navbar user={user} />}
        sidebar={<Sidebar user={user} />}
      >
        <Header title="Edit Game" />
        <div className="divide-y divide-gray-900/10">
          {/* Game details */}
          <Section title="Game" description="Edit your game details.">
            {isNullOrUndefined(game) ? (
              <Skeleton className="col-span-2 max-w-2xl" />
            ) : (
              <EditGameForm game={game} onSubmit={updateGame} />
            )}
          </Section>

          {/* Questions */}
          <Section
            title="Questions"
            description="Add or delete your game questions."
          >
            {isNullOrUndefined(game) ? (
              <Skeleton className="col-span-2 max-w-2xl" />
            ) : (
              <EditQuestionsForm
                game={game}
                createQuestion={createQuestion}
                updateQuestion={updateQuestion}
                deleteQuestion={deleteQuestion}
              />
            )}
          </Section>
        </div>
      </StackedLayout>
    </>
  );
}
