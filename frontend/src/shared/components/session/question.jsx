import React from 'react';
import clsx from 'clsx';
/***************************************************************
                    Question Component
***************************************************************/
function QuestionHeader({ index, total, score }) {
  return (
    <div className="bg-base-200 px-4 py-4 flex flex-row items-center justify-between text-base text-neutral">
      <div>
        Question <strong>{index + 1}</strong> of <strong>{total}</strong>
      </div>
      <div className="bg-green-50 text-success-content px-2 py-1 rounded-lg">
        Score: <strong>{score}</strong>
      </div>
    </div>
  );
}

function QuestionContent({ children }) {
  return (
    <div className="p-10 sm:p-6">
      <div className="flex flex-col w-full h-full justify-between gap-y-6 items-center">
        {children}
      </div>
    </div>
  );
}

export function Question({ index, total, score = 0, children }) {
  return (
    <>
      <div className="overflow-hidden dark:bg-white bg-base-100 drop-shadow-lg rounded-lg">
        <QuestionHeader index={index} total={total} score={score} />
        <QuestionContent>{children}</QuestionContent>
      </div>
    </>
  );
}

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
