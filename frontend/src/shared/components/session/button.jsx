import { CheckCircleIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import { useState } from 'react';

const styles = {
  base: [
    // Base
    'relative flex group font-bold text-black px-8 py-3 w-full',
    // Disabled
    'data-disabled:opacity-50 data-disabled:pointer-events-none',
    // Cursor
    'cursor-pointer touch-manipulation pointer-events-auto',
  ],
  colors: {
    random: [
      'bg-blue-neon',
      'bg-green-neon',
      'bg-orange-neon',
      'bg-red-neon',
      'bg-purple-neon',
      'bg-navy',
    ],
    default: 'bg-pink-300',
    success: 'bg-success',
    error: 'bg-error',
  },
};

export function SingleChoiceButton({ children, ...props }) {
  const {
    id,
    correct,
    selected,
    touched,
    disabled,
    onClick,
    className,
    ...rest
  } = props;

  let classes = clsx(
    className,
    styles.base,
    disabled && 'opacity-50 pointer-events-none',
    touched && !selected && 'opacity-50', // if not selected, show 50% opacity
    touched && selected && 'opacity-100' // if selected, show full opacity
  );

  let bgClass = clsx(
    id
      ? styles.colors.random[id % styles.colors.random.length]
      : styles.colors.default
  );

  const content = (
    <>
      <div className="-inset-1 absolute z-0 rounded-md" />
      <div className="absolute inset-x-0 top-0 bottom-0 transform group-active:translate-y-0.5 group-active:bottom-0.5 z-1 bg-black rounded-[0.65rem] p-[0.1875rem]">
        <div className="relative w-full h-full">
          <div
            className={clsx(
              'top-1 absolute inset-x-0 bottom-0 overflow-hidden rounded-[0.4375rem]',
              bgClass
            )}
          >
            <div className="opacity-30 absolute inset-0 bg-black" />
          </div>
          <div
            className={clsx(
              'bottom-1 absolute inset-x-0 top-0 overflow-hidden group-active:bottom-0.5 rounded-[0.4375rem]',
              bgClass
            )}
          >
            <div className="group-hover:opacity-20 absolute inset-0 opacity-0" />
          </div>
        </div>
      </div>
      <div className="z-1 absolute inset-0 overflow-hidden hidden rounded-[0.4375rem] ">
        <div
          className="opacity-20 absolute top-0 left-0 w-full h-full bg-black"
          style={{ left: '-100%' }}
        />
      </div>
      <div className="relative flex flex-row gap-x-4 items-center w-full min-h-full pointer-events-none z-2 transform -translate-y-0.5 group-active:translate-y-0 p-[0.1875rem]">
        <div className="flex flex-col flex-1 items-center">
          <div className="relative">
            <div className="relative">{children}</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative w-full">
      {correct && (
        <div className="absolute -top-2 -right-2 size-6 rounded-full bg-green-50 flex items-center justify-center z-10">
          <CheckCircleIcon className="fill-green-700 size-6" />
        </div>
      )}
      <button
        role="radio"
        type="button"
        className={classes}
        onClick={onClick}
        disabled={disabled}
        aria-checked={selected}
        {...rest}
      >
        {content}
      </button>
    </div>
  );
}

export function MultipleChoiceOptions({ children }) {
  return (
    <div className="flex flex-col items-center w-full space-y-2 text-white mt-4 max-w-lg px-4">
      {children}
    </div>
  );
}

export function MultipleChoiceButton({
  children,
  selected,
  touched,
  correct,
  disabled,
  onClick,
  ...props
}) {
  const isChecked = selected;
  const showCorrect = touched && correct !== null;

  let bgColor = 'bg-white';
  if (showCorrect) {
    bgColor = correct ? 'bg-green-500' : 'bg-red-500';
  } else if (isChecked) {
    bgColor = 'bg-green-500';
  }

  return (
    <button
      {...props}
      role="checkbox"
      aria-checked={isChecked}
      disabled={disabled}
      className="h-12 p-2 rounded-lg relative overflow-hidden flex flex-row items-center justify-start text-base bg-zinc-300/30 text-black w-full"
      type="button"
      onClick={onClick}
    >
      <div className="flex flex-row items-center px-2 space-x-6">
        <div className={`w-6 h-6 rounded-full ${bgColor} relative`}>
          {isChecked && (
            <div className="top-1/2 left-1/2 absolute w-2 h-2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
          )}
        </div>
        <div>{children}</div>
      </div>
    </button>
  );
}
