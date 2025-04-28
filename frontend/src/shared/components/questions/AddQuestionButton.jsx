import { Button } from '@components/button';
import { NewQuestionModal } from '@components/questions';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

export default function AddQuestionButton({ className, createQuestion }) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button color="dark/white" className={className} onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Add question
      </Button>

      <NewQuestionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        createQuestion={createQuestion}
      />
    </>
  )
}