import { EditGameForm, EmptyState } from '@/game';
import { Card, Section } from '@components/card';
import { Header } from '@components/heading';
import { Skeleton } from '@components/loading';
import { AddQuestionButton, QuestionCard } from '@components/questions';
import { isEqual, newQuestion } from '@utils/game';
import { isNullOrUndefined } from '@utils/helpers';
import { useOutletContext } from 'react-router-dom';

export default function EditGame() {
  const { game, updateGame } = useOutletContext();

  return (
    <>
      <Header title="Edit Game" />
      <div className="divide-y divide-zinc-900/10 dark:divide-white/5">

        {/* Game */}
        <Section title="Game" description="Edit your game details.">
          <Game game={game} updateGame={updateGame} />
        </Section>

        {/* Questions */}
        <Section title="Questions" description="Edit your game questions.">
          <GameQuestions game={game} updateGame={updateGame} />
        </Section>
      </div>
    </>
  );
}

function GameQuestions({ game, updateGame }) {
  const createQuestion = (questionType) => {
    const question = newQuestion(questionType);
    const updatedQuestions = [...game.questions, question];
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

  // If game is null or undefined
  if (isNullOrUndefined(game) || isNullOrUndefined(game.questions)) {
    return <Skeleton className="col-span-2 max-w-2xl" />;
  }

  // If game has no questions
  if (game.questions && game.questions.length === 0) {
    return (
      <EmptyState className="col-span-2" createQuestion={createQuestion} />
    );
  }

  // If game has questions
  return (
    <div className="col-span-2 flex flex-col">
      {game.questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          index={index}
          question={question}
          deleteQuestion={deleteQuestion}
        />
      ))}
      <AddQuestionButton className="self-end" createQuestion={createQuestion} />
    </div>
  );
}

function Game({ game, updateGame }) {
  if (isNullOrUndefined(game)) {
    return <Skeleton className="col-span-2 max-w-2xl" />;
  }

  return (
    <Card>
      <EditGameForm game={game} onSubmit={updateGame} />
    </Card>
  );
}
