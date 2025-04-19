import { NewGameModal } from '@/game/components';
import { Button } from '@components/button';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

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
      <NewGameModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onCreate}
      />
    </>
  );
}
