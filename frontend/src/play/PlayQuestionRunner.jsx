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

export default function PlayQuestionRunner({
  playerId,
  question,
  correctAnswers,
  showAnswers,
}) {
  const { score, updateScore, questions, cacheQuestion } = usePlayer();
  const [touched, setTouched] = useState(false);
  const [selected, setSelected] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answerSubmittedAt, setAnswerSubmittedAt] = useState(null);

  // Reset state when a new question comes in
  useEffect(() => {
    if (!question) return;

    cacheQuestion(question);
    setSelected([]);
    setTouched(false);
    setAnswerSubmittedAt(null);

    const initialTimeLeft = calculateTimeLeft(question.duration, question.isoTimeLastQuestionStarted);
    setTimeLeft(initialTimeLeft);

  }, [question?.id]);

  // Timer countdown
  useEffect(() => {
    if (!question || showAnswers) return;

    const interval = setInterval(() => {
      const currentTimeLeft = calculateTimeLeft(question.duration, question.isoTimeLastQuestionStarted);
      setTimeLeft(currentTimeLeft);

      if (currentTimeLeft <= 0) {
        clearInterval(interval);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [question?.isoTimeLastQuestionStarted, showAnswers, question?.duration]);

  useEffect(() => {
    if (!correctAnswers || showAnswers) return;

    const isCorrect =
      question.type === 'multipleChoice'
        ? correctAnswers.every((a) => selected.includes(a))
        : correctAnswers[0] === selected[0];

    if (isCorrect) {
      updateScore(question.points);
    };

  }, [correctAnswers]);

  // Handle selection
  const handleAnswerSelect = async (answerId, checked = null) => {
    // Prevent selection if answers are shown OR no question exists
    if (showAnswers || !question || timeLeft <= 0) {
      console.warn('Cannot select answer, question not available or answers shown');
      console.warn('Question:', question);
      console.warn('Show Answers:', showAnswers);
      return;
    }

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
          correctAnswers={correctAnswers}
          showAnswers={showAnswers}
          onSelect={handleAnswerSelect}
        />
      </Question>
    </QuestionLayout>
  );
}
