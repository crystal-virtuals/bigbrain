import { Button } from '@components/button';
import { HeadingLight as Heading } from '@components/heading';
import {
  SingleChoiceButton,
  MultipleChoiceButton,
} from '@components/session/button';
import { QuestionLayout, Question, QuestionActions, Timer } from '@components/session/question';
import { useEffect, useState, useRef } from 'react';
import { calculateTimeLeft } from '@utils/session';

export default function QuestionRunner({ session, lock, advanceGame, stopGame }) {
  const question = session.questions[session.position];
  const { duration, type, correctAnswers } = question;
  const { isoTimeLastQuestionStarted } = session;
  const [selected, setSelected] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(duration, isoTimeLastQuestionStarted));

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTimeLeft = calculateTimeLeft(duration, isoTimeLastQuestionStarted);
      setTimeLeft(currentTimeLeft);
      // Automatically show answers when time runs out
      if (currentTimeLeft === 0 && !showAnswers) {
        setShowAnswers(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [duration, isoTimeLastQuestionStarted]);

  // Reset state when question changes
  useEffect(() => {
    setSelected(null);
    setShowAnswers(false);
    setTimeLeft(calculateTimeLeft(duration, isoTimeLastQuestionStarted));
  }, [session.position, question.id]);

  // Auto-advance game after 3 seconds of showing answers
  useEffect(() => {
    if (!showAnswers || lock) return;

    const timeout = setTimeout(() => {
      advanceGame();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showAnswers]);

  // Handle advancing game to next question
  const onNextQuestion = () => {
    if (!showAnswers) {
      // If answers aren't shown yet, show them and start timer
      
    } else {
      // If answers are already shown, advance immediately
      advanceGame();
    }
  };

  const handleSelect = (answerId) => {
    if (timeLeft === 0) return;
    if (type == 'singleChoice' || type == 'judgement') {
      setSelected([answerId]);
    } else if (type == 'multipleChoice') {
      setSelected((prev) => {
        if (prev === null) return [answerId];
        if (prev.includes(answerId)) {
          return prev.filter((id) => id !== answerId);
        }
        return [...prev, answerId];
      });
    }
  };

  const isCorrect = (answerId) => {
    if (correctAnswers === null) return false;
    if (type === 'multipleChoice') return correctAnswers.includes(answerId);
    return correctAnswers[0] === answerId;
  }

  const isSelected = (answerId) => {
    if (selected === null) return false;
    if (type === 'multipleChoice') return selected.includes(answerId);
    return selected.length === 1 && selected[0] === answerId;
  }

  const renderAnswerButton = (a) => {
    const answerProps = {
      id: a.id,
      selected: isSelected(a.id),
      touched: selected !== null,
      correct: showAnswers ? isCorrect(a.id) : null,
      disabled: timeLeft == 0,
      children: a.name,
      onClick: () => handleSelect(a.id),
    };

    if (type === 'multipleChoice') {
      return (
        <li key={a.id} className="flex flex-row justify-center w-full">
          <MultipleChoiceButton {...answerProps} />
        </li>
      );
    }

    return (
      <li key={a.id} className="flex flex-row justify-center w-full">
        <SingleChoiceButton
          {...answerProps}
        />
      </li>
    );
  };

  return (
    <QuestionLayout>
      <Question index={session.position} total={session.questions.length} score={0}>
        <Heading>{question.name}</Heading>
        <Timer timeLeft={timeLeft} duration={duration} />

        <ul className="flex flex-col items-center w-full space-y-2 mt-4 max-w-lg px-4">
          {question.answers.map(renderAnswerButton)}
        </ul>

        <QuestionActions>
          <Button color="light" onClick={stopGame} disabled={lock}>
            End Game
          </Button>

          <Button
            color="dark"
            onClick={advanceGame}
          >
            Next
          </Button>
        </QuestionActions>

      </Question>
    </QuestionLayout>
  );
}
