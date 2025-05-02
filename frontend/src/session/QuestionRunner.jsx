import { Button } from '@components/button';
import { HeadingLight } from '@components/heading';
import {
  SingleChoiceButton,
  MultipleChoiceButton,
} from '@components/session/button';
import { Question, Timer } from '@components/session/question';
import { useEffect, useState } from 'react';

function calculateTimeLeft(duration, isoTimeLastQuestionStarted) {
  if (!isoTimeLastQuestionStarted) return duration;
  const started = new Date(isoTimeLastQuestionStarted);
  const elapsed = Math.floor((Date.now() - started.getTime()) / 1000);
  return Math.max(duration - elapsed, 0);
}

export default function QuestionRunner({ session, lock, advanceGame, stopGame }) {
  const question = session.questions[session.position];
  const { duration, type, correctAnswers } = question;

  const [selected, setSelected] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(duration, session.isoTimeLastQuestionStarted)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const current = calculateTimeLeft(duration, session.isoTimeLastQuestionStarted);
      setTimeLeft(current);
      if (current === 0) setShowAnswers(true);
    }, 1000);
    return () => clearInterval(interval);
  }, [duration, session.isoTimeLastQuestionStarted]);

  useEffect(() => {
    setSelected(null);
    setShowAnswers(false);
    setTimeLeft(calculateTimeLeft(duration, session.isoTimeLastQuestionStarted));
  }, [session.position, question.id]);

  useEffect(() => {
    if (!showAnswers || lock) return;

    const timeout = setTimeout(() => {
      advanceGame();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showAnswers]);

  // Handle answer selection
  const handleSelect = (answerId) => {
    if (timeLeft === 0) return;
    if (type == 'singleChoice' || type == 'judgement') {
      setSelected([answerId]);
    } else if (type == 'multipleChoice') {
      setSelected((prev) =>
        prev.includes(answerId)
          ? prev.filter((id) => id != answerId)
          : [...prev, answerId]
      );
    }
  };

  const isCorrect = (answerId) => {
    if (type === 'multipleChoice') {
      return correctAnswers.includes(answerId);
    }
    return correctAnswers[0] === answerId;
  }

  const isSelected = (answerId) => {
    if (selected === null) return false;
    if (type === 'multipleChoice') {
      return selected.includes(answerId);
    }
    return selected.length === 1 && selected[0] === answerId;
  }

  const renderAnswerButton = (a) => {
    const answerProps = {
      id: a.id,
      selected: isSelected(a.id),
      touched: selected !== null,
      correct: showAnswers ? isCorrect(a.id) : null,
      disabled: timeLeft == 0,
      onClick: () => handleSelect(a.id),
      children: a.name,
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
    <div className="flex-1 max-w-xl">
      <Question
        index={session.position}
        total={session.questions.length}
        score={0}
      >
        <HeadingLight>{question.name}</HeadingLight>
        <Timer timeLeft={timeLeft} duration={duration} />

        <ul className="flex flex-col items-center w-full space-y-2 mt-4 max-w-lg px-4">
          {question.answers.map(renderAnswerButton)}
        </ul>

        <div className="flex flex-row items-center w-full mt-4 max-w-lg px-4 justify-between">
          <Button color="light" onClick={stopGame} disabled={lock}>
            End Game
          </Button>

          <Button
            color="dark"
            onClick={advanceGame}
          >
            Next
          </Button>
        </div>
      </Question>
    </div>
  );
}
