import { Button } from '@components/button';
import { Countdown } from '@components/countdown';
import { Heading } from '@components/heading';
import { Question, QuestionActions, QuestionAnswers } from '@components/session/question';
import { useEffect, useState, useCallback} from 'react';
import { useSession, useQuestionCountdown } from '@hooks/session';

export default function QuestionRunner({ session, advanceGame, stopGame }) {
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
    console.log('QuestionRunner: question', question);
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
    if (!answerAvailable) return;
    const timeout = setTimeout(autoAdvance, 3000);
    return () => clearTimeout(timeout);
  }, [answerAvailable]);

  // Handle advancing the game
  const handleAdvance = () => {
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
      score={0}
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
        <Button color="light" onClick={stopGame}>
          End Game
        </Button>
        <Button
          color="dark"
          onClick={handleAdvance}
          disabled={answerAvailable}
        >
          {timeLeft > 0 ? 'Show Answers' : 'Next Question'}
        </Button>
      </QuestionActions>
    </Question>
  );
}