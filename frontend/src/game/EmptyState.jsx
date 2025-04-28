import { Text } from '@components/text';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import NewQuestionModal from '../shared/components/questions/NewQuestionModal';
import clsx from 'clsx';

const styles = {
  default: [
    // Cursor
    'cursor-pointer touch-manipulation pointer-events-auto',
  ],
  dashed: [
    // Base
    'group relative block rounded-lg p-12 text-center',
    // Background
    'bg-transparent hover:bg-pink-400/10',
    // Border
    'border-2 border-dashed border-zinc-950/10 text-zinc-950',
    // Dark mode
    'dark:border-white/15 dark:text-white',
    // Hover
    'hover:border-pink-400',
  ]
};

export default function EmptyState({ className, createQuestion }) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={clsx(styles.default, styles.dashed, className)}
        onClick={() => setIsOpen(true)}
      >
        <QuestionMarkCircleIcon
          aria-hidden="true"
          className="mx-auto size-12 text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-100"
        />
        <Text className="mt-2 font-semibold group-hover:text-zinc-800 dark:group-hover:text-zinc-100">
          Add your first question
        </Text>
      </button>

      <NewQuestionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        createQuestion={createQuestion}
      />
    </>
  );
}