import { Button } from '@components/button';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import CreateGameModal from './CreateGameModal';

export default function CreateGameButton( { onCreate }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button */}
      <Button type="button" onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Create Game
      </Button>

      {/* Modal */}
      <CreateGameModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onCreate}
      />
    </>
  );
}
