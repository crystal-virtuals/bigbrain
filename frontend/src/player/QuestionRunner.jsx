import { Heading } from '@components/heading';
import { Skeleton } from '@components/loading';
import {
  Question,
  QuestionAnswers
} from '@components/session/question';
import { useSession, useQuestionCountdown } from '@hooks/session';
import { useEffect, useState } from 'react';
import { Countdown } from '@components/countdown';
import { isNullish } from '@utils/validation';
import { playerAPI } from '@services/api';

export default function QuestionRunner({ playerId, question, answers = null }) {
  const [touched, setTouched] = useState(false);
  const [selected, setSelected] = useState([]);
  const { answerAvailable, showAnswers, resetAnswers, updateScore, questions, cacheQuestion } = useSession();
  const { timeLeft, stopCountdown } = useQuestionCountdown({
    isoTimeStart: question?.isoTimeLastQuestionStarted,
    duration: question?.duration,
  });

  // Reset state when a new question comes in
  useEffect(() => {
    if (!question) return;
    cacheQuestion(question);
    // Reset state for new question
    resetAnswers();
    setSelected([]);
    setTouched(false);
  }, [question?.id]);

  // Show answers when countdown reaches zero
  useEffect(() => {
    if (timeLeft <= 0 && !answerAvailable) {
      showAnswers();
    }
  }, [timeLeft, answerAvailable, showAnswers]);

  // Calculate score when answers become available
  useEffect(() => {
    if (!answerAvailable || selected.length === 0) return;

    const isCorrect =
      question.type === 'multipleChoice'
        ? answers?.every((a) => selected.includes(a)) && selected.length === answers.length
        : answers?.[0] === selected[0];

    if (isCorrect) {
      updateScore(question.points);
    }
  }, [answerAvailable]);

  // Handle answer selection
  const handleAnswerSelect = async (answerId, checked = null) => {
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
    await playerAPI.putAnswers(playerId, newAnswers); // optimistic update
  };

  if (isNullish(question)) {
    return (
      <div className="flex-1 max-w-xl">
        <Skeleton />
      </div>
    );
  }

  return (
    <>
      <Question index={questions.length - 1}>
        <Heading className='dark:text-zinc-950'>{question.name}</Heading>
        <Countdown time={timeLeft} duration={question.duration} />
        <QuestionAnswers
          question={question}
          touched={touched}
          selectedAnswers={selected}
          correctAnswers={answerAvailable ? answers : null}
          onSelect={handleAnswerSelect}
        />
      </Question>
    </>
  );
}
