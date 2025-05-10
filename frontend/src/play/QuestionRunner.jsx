import { HeadingLight as Heading } from '@components/heading';
import { Skeleton } from '@components/loading';
import {
  QuestionLayout,
  Question,
  QuestionAnswers,
  Timer,
} from '@components/session/question';
import { playerAPI } from '@services/api';
import { useEffect, useState } from 'react';
import { usePlayer } from '@hooks/player';
import { calculateTimeLeft } from '@utils/session';

export default function QuestionRunner({ playerId, question, answers = null }) {
  const { score, updateScore, questions, cacheQuestion } = usePlayer();
  const [touched, setTouched] = useState(false);
  const [selected, setSelected] = useState([]);
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(question.duration, question.isoTimeLastQuestionStarted)
  );

  // Reset state when a new question comes in or when answers are available
  useEffect(() => {
    if (!question) return;

    cacheQuestion(question);
    setSelected([]);
    setTouched(false);

    const initialTimeLeft = calculateTimeLeft(question.duration, question.isoTimeLastQuestionStarted);
    setTimeLeft(initialTimeLeft);

  }, [question?.id]);

  // Timer countdown
  useEffect(() => {
    if (!question || answers !== null) return;

    const interval = setInterval(() => {
      const currentTimeLeft = calculateTimeLeft(question.duration, question.isoTimeLastQuestionStarted);
      setTimeLeft(currentTimeLeft);

      if (currentTimeLeft <= 0) {
        clearInterval(interval);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [question?.id, answers]);

  // Calculate score on show answers
  useEffect(() => {
    if (!answers || selected.length === 0) return;

    const isCorrect =
      question.type === 'multipleChoice'
        ? answers.every((a) => selected.includes(a))
        : answers[0] === selected[0];

    if (isCorrect) {
      updateScore(question.points);
    };

  }, [answers]);

  // Handle selection
  const handleAnswerSelect = async (answerId, checked = null) => {
    if (!question || answers !== null || timeLeft <= 0) return;

    if (touched === false) setTouched(true);

    let newAnswers;
    if (question.type == 'multipleChoice') {
      newAnswers = checked
        ? [...selected, answerId]
        : selected.filter((id) => id !== answerId);
    } else {
      newAnswers = [answerId];
    }

    try {
      await playerAPI.putAnswers(playerId, newAnswers);
      setSelected(newAnswers);
    } catch (err) {
      console.error('Failed to submit answer:', err.message);
    }
  };

  if (!question) {
    return (
      <div className="flex-1 max-w-xl">
        <Skeleton />
      </div>
    );
  }

  return (
    <QuestionLayout>
      <Question index={questions.length - 1} score={score}>
        <Heading>{question.name}</Heading>
        <Timer timeLeft={timeLeft} duration={question.duration} />
        <QuestionAnswers
          question={question}
          touched={touched}
          selectedAnswers={selected}
          correctAnswers={answers}
          onSelect={handleAnswerSelect}
        />
      </Question>
    </QuestionLayout>
  );
}
