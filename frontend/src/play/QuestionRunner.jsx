import { HeadingLight as Heading } from '@components/heading';
import { Skeleton } from '@components/loading';
import { QuestionLayout, Question, QuestionAnswers, Timer } from '@components/session/question';
import { playerAPI } from '@services/api';
import { useEffect, useState } from 'react';
import { usePlayer } from '@hooks/player';
import { calculateTimeLeft } from '@utils/session';

export default function QuestionRunner({
  playerId,
  question,
  correctAnswers,
  showAnswers,
}) {
  const { score, updateScore, questions, cacheQuestion } = usePlayer();
  const [selected, setSelected] = useState([]);
  const [touched, setTouched] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Reset state when a new question comes in
  useEffect(() => {
    if (!question) return;
    cacheQuestion(question);
    setSelected([]);
    setTouched(false);
    const initialTimeLeft = calculateTimeLeft(
      question.duration,
      question.isoTimeLastQuestionStarted
    );
    setTimeLeft(initialTimeLeft);
  }, [question?.id]);

  // Timer countdown
  useEffect(() => {
    if (!question || showAnswers) return;

    const initialTimeLeft = calculateTimeLeft(
      question.duration,
      question.isoTimeLastQuestionStarted
    );
    setTimeLeft(initialTimeLeft);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [question?.isoTimeLastQuestionStarted, showAnswers, question?.duration]);

  // Update score when answers are shown
  useEffect(() => {
    if (correctAnswers && selected.length > 0) {
      const isCorrect =
        question.type === 'multipleChoice'
          ? correctAnswers.every((a) => selected.includes(a))
          : correctAnswers[0] === selected[0];

      if (isCorrect) {
        updateScore(question.points);
      }
    }
  }, [correctAnswers]);

  // Handle selection
  const handleAnswerSelect = async (answerId, checked = null) => {
    // Prevent selection if answers are shown OR no question exists
    if (showAnswers || !question || timeLeft <= 0) return;
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
      console.log('Submitting answers:', newAnswers);
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
      <Question index={questions.length} score={score}>
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
