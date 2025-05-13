import { Button } from '@components/button';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import CreateGameModal from './CreateGameModal';

export default function CreateGameButton( { onCreate, ...props } ) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button */}
      <Button type="button" color='white' onClick={() => setIsOpen(true)} {...props}>
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
