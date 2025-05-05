import {
  CheckboxButton,
  CheckboxButtonField,
  CheckboxButtonGroup,
} from '@components/checkbox';
import {
  RadioButton,
  RadioButtonField,
  RadioButtonGroup,
} from '@components/radio';
import clsx from 'clsx';
import { Skeleton } from '@components/loading';

/***************************************************************
                        Timer
***************************************************************/
export function Timer({ timeLeft, duration }) {
  const styles = {
    base: 'flex flex-row justify-center items-center w-full gap-x-4 pb-2',
    text: 'text-sm font-medium whitespace-nowrap flex-shrink-0',
  };

  if (timeLeft <= 0) {
    return (
      <div className={clsx(styles.base, styles.text, 'text-error')}>
        <p>Time&apos;s up!</p>
        <progress
          className="progress progress-error w-full"
          value={0}
          max={duration}
        ></progress>
      </div>
    );
  }

  return (
    <div className={clsx(styles.base, styles.text, 'text-info')}>
      <p>{timeLeft}</p>
      <progress
        className="progress progress-info w-full"
        value={timeLeft}
        max={duration}
      ></progress>
    </div>
  );
}

/***************************************************************
                    Question Component
***************************************************************/
export function Question({ index, total, score, children }) {
  return (
    <>
      <div className="overflow-hidden dark:bg-white bg-base-100 drop-shadow-lg rounded-lg">
        <QuestionHeader index={index} total={total} score={score} />
        <QuestionBody>{children}</QuestionBody>
      </div>
    </>
  );
}

function QuestionHeader({ index, total, score }) {
  return (
    <div className="bg-base-200 px-8 py-4 flex flex-row items-center justify-between text-base text-neutral">
      <div>
        Question <strong>{index + 1}</strong>
        {total && (
          <span>
            of <strong>{total}</strong>
          </span>
        )}
      </div>
      <div className="bg-green-50 text-success-content px-2 py-1 rounded-lg">
        Score: <strong>{score}</strong>
      </div>
    </div>
  );
}

function QuestionBody({ children }) {
  return (
    <div className="py-10 px-8 sm:p-8">
      <div className="flex flex-col w-full h-full justify-between gap-y-6 items-center">
        {children}
      </div>
    </div>
  );
}

export function QuestionActions({ children }) {
  return (
    <div className="flex flex-row items-center w-full mt-4 max-w-lg px-4 justify-between">
      {children}
    </div>
  );
}

/***************************************************************
                        Answer Buttons
***************************************************************/
export function QuestionAnswers({ question, touched, selectedAnswers, correctAnswers, showAnswers, onSelect }) {
  if (!question) return <Skeleton />;

  const isSelected = (answerId) => selectedAnswers.includes(answerId);
  const isCorrect = (id) => {
    if (!correctAnswers) return null;
    return question.type === 'multipleChoice'
      ? correctAnswers.includes(id)
      : correctAnswers[0] === id;
  };

  const isCorrectProp = (id) => {
    if (!showAnswers || !correctAnswers) return null;
    const correct = isCorrect(id);
    const selected = isSelected(id);
    if (correct) return true; // Mark as correct
    if (selected && !correct) return false; // Mark as incorrect
    return null; // No mark
  }

  if (question.type === 'multipleChoice') {
    return (
      <CheckboxButtonGroup>
        {question.answers.map((a) => (
          <CheckboxButtonField key={a.id} correct={isCorrectProp(a.id)}>
            <CheckboxButton
              id={a.id}
              name={a.id}
              checked={selectedAnswers.includes(a.id)}
              onChange={(checked) => onSelect(a.id, checked)}
              disabled={showAnswers}
              className={clsx(
                showAnswers && !isSelected(a.id)
                  ? 'opacity-30'
                  : 'opacity-100'
              )}
            >
              {a.name}
            </CheckboxButton>
          </CheckboxButtonField>
        ))}
      </CheckboxButtonGroup>
    );
  }

  return (
    <RadioButtonGroup
      value={selectedAnswers[0] || null}
      onChange={(value) => onSelect(value)}
      disabled={showAnswers}
    >
      {question.answers.map((a, idx) => (
        <RadioButtonField key={a.id} correct={isCorrectProp(a.id)}>
          <RadioButton
            id={idx}
            value={a.id}
            className={clsx(
              (showAnswers || touched) && !isSelected(a.id) ? 'opacity-30' : 'opacity-100',
            )}
          >
            {a.name}
          </RadioButton>
        </RadioButtonField>
      ))}
    </RadioButtonGroup>
  );
}
