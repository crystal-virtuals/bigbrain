import { Button } from '@components/button';
import { Countdown } from '@components/countdown';
import { Heading } from '@components/heading';
import { Question, QuestionActions, QuestionAnswers } from '@components/session/question';
import { useEffect, useState, useCallback} from 'react';
import { useSession, useQuestionCountdown } from '@hooks/session';

export default function QuestionRunner({ session, advanceGame, stopGame, isMutating }) {
  const question = session.questions[session.position];
  const [touched, setTouched] = useState(false);
  const [selected, setSelected] = useState([]);
  const { answerAvailable, showAnswers, resetAnswers } = useSession();
  const { timeLeft, stopCountdown } = useQuestionCountdown({
    isoTimeStart: session.isoTimeLastQuestionStarted,
    duration: question.duration,
  });

  // Reset state when a new question comes in
  useEffect(() => {
    resetAnswers();
    setSelected([]);
    setTouched(false);
  }, [session.position, question.id]);

  // Show answers when countdown reaches zero
  useEffect(() => {
    if (timeLeft <= 0 && !answerAvailable) {
      showAnswers();
    }
  }, [timeLeft, answerAvailable, showAnswers]);

  // Auto-advance game after 3 seconds of showing answers
  const autoAdvance = useCallback(() => {
    advanceGame();
  }, [advanceGame]);

  useEffect(() => {
    if (!answerAvailable || isMutating) return;
    const timeout = setTimeout(autoAdvance, 3500);
    return () => clearTimeout(timeout);
  }, [answerAvailable, isMutating]);

  // Handle advancing the game
  const handleAdvance = () => {
    if (isMutating) return;
    if (timeLeft > 0) {
      showAnswers();
      stopCountdown();
    } else {
      advanceGame();
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerId, checked = null) => {
    if (!question || answerAvailable || timeLeft <= 0) return;
    if (!touched) setTouched(true);

    let newAnswers;
    if (question.type === 'multipleChoice') {
      newAnswers = checked
        ? [...selected, answerId]
        : selected.filter((id) => id !== answerId);
    } else {
      newAnswers = [answerId];
    }

    setSelected(newAnswers);
  };

  return (
    <Question
      index={session.position}
      total={session.questions.length}
    >
      <Heading className='dark:text-zinc-950'>{question.name}</Heading>
      <Countdown time={timeLeft} duration={question.duration} />
      <QuestionAnswers
        question={question}
        touched={touched}
        selectedAnswers={selected}
        correctAnswers={answerAvailable ? question.correctAnswers : null}
        onSelect={handleAnswerSelect}
      />
      <QuestionActions>
        <Button 
          color="light"
          onClick={stopGame}
          disabled={isMutating}
        >
          End Game
        </Button>
        <Button
          color="dark"
          type='submit'
          loading={isMutating}
          disabled={isMutating}
          onClick={handleAdvance}
        >
          {!answerAvailable ? 'Show Answers' : 'Next Question'}
        </Button>
      </QuestionActions>
    </Question>
  );
}
