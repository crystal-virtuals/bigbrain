import {
  CheckboxButton,
  CheckboxButtonField,
  CheckboxButtonGroup,
} from '@components/checkbox';
import { Skeleton } from '@components/loading';
import {
  RadioButton,
  RadioButtonField,
  RadioButtonGroup,
} from '@components/radio';

/***************************************************************
                    Question Component
***************************************************************/
function QuestionLayout({ children }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full">
      {children}
    </div>
  );
}

function QuestionHeader({ index, total, score }) {
  return (
    <div className="bg-base-200 px-8 py-4 flex flex-row items-center justify-between text-base text-zinc-950 dark:text-zinc-950">
      <div>
        Question <strong>{index + 1}</strong>
        {total && (
          <span>
            {' '}
            of <strong>{total}</strong>
          </span>
        )}
      </div>
      {score && (
        <div className="bg-green-50 text-success-content px-2 py-1 rounded-lg">
          Score: <strong>{score}</strong>
        </div>
      )}
    </div>
  );
}

function QuestionBody({ children }) {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col w-full h-full justify-between gap-y-6 items-center text-zinc-950 dark:text-zinc-950">
        {children}
      </div>
    </div>
  );
}

export function Question({ index, total, score, children }) {
  return (
    <QuestionLayout>
      <div className="overflow-hidden bg-base-100 drop-shadow-lg rounded-lg w-full max-w-3xl mx-auto">
        <QuestionHeader index={index} total={total} score={score} />
        <QuestionBody>{children}</QuestionBody>
      </div>
    </QuestionLayout>
  );
}

export function QuestionActions({ children }) {
  return (
    <div className="flex flex-row items-center w-full mt-4 max-w-lg px-4 justify-between shrink-0">
      {children}
    </div>
  );
}

/***************************************************************
                        Answer Buttons
***************************************************************/
export function QuestionAnswers({
  question,
  touched,
  selectedAnswers,
  correctAnswers,
  onSelect,
}) {
  if (!question) return <Skeleton />;

  const isSelected = (answerId) => selectedAnswers.includes(answerId);

  const isCorrect = (id) => {
    if (!correctAnswers) return null;
    return question.type === 'multipleChoice'
      ? correctAnswers.includes(id)
      : correctAnswers[0] === id;
  };

  const correctProp = (id) => {
    if (!correctAnswers) return null;
    const correct = isCorrect(id);
    const selected = isSelected(id);
    if (correct) return true; // Mark as correct
    if (selected && !correct) return false; // Mark as incorrect
    return null; // No mark
  };

  if (question.type === 'multipleChoice') {
    return (
      <CheckboxButtonGroup>
        {question.answers.map((a) => (
          <CheckboxButtonField key={a.id} correct={correctProp(a.id)}>
            <CheckboxButton
              id={a.id}
              name={a.id}
              checked={selectedAnswers.includes(a.id)}
              onChange={(checked) => onSelect(a.id, checked)}
              disabled={correctAnswers !== null}
              className={
                !isSelected(a.id) && touched ? 'opacity-50' : 'opacity-100'
              }
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
      disabled={correctAnswers !== null}
    >
      {question.answers.map((a, idx) => (
        <RadioButtonField key={a.id} correct={correctProp(a.id)}>
          <RadioButton
            id={idx}
            value={a.id}
            className={
              !isSelected(a.id) && touched ? 'opacity-50' : 'opacity-100'
            }
          >
            {a.name}
          </RadioButton>
        </RadioButtonField>
      ))}
    </RadioButtonGroup>
  );
}
