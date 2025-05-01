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
        <span className="md:inline hidden">Add another question</span>
        <span className="md:hidden inline">Add question</span>
      </Button>

      <NewQuestionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        createQuestion={createQuestion}
      />
    </>
  )
}