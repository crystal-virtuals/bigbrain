import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@components/dropdown';
import { AlertModal } from '@components/modal';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { useToast } from '@hooks/toast';
import { useState } from 'react';

// Edit Delete Game Menu
export default function EditDeleteGameMenu({ game, onDelete, disabled}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toastify = useToast();

  const deleteGame = () => {
    setIsLoading(true);
    onDelete(game.id)
      .then(() => {
        setIsLoading(false);
        setIsOpen(false);
        setError('');
        toastify.success({ message: 'Game deleted!' });
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message);
        toastify.error({ message: error.message, replace: true });
      });
  };

  if (disabled) {
    return null;
  }

  return (
    <>
      {/* Menu Button */}
      <Dropdown>
        <DropdownButton plain aria-label="More options">
          <EllipsisHorizontalIcon aria-hidden="true"/>
        </DropdownButton>
        <DropdownMenu className="hover:cursor-pointer">
          <DropdownItem href={`/game/${game.id}`}>View</DropdownItem>
          <DropdownItem href={`/game/${game.id}`}>Edit</DropdownItem>
          <DropdownItem onClick={() => setIsOpen(true)}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Delete Confirmation Alert */}
      <AlertModal
        title="Delete this game?"
        description="You are about to delete this game and all of its data. No one will be able to access this game ever again."
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isLoading={isLoading}
        error={error}
        confirmText="Delete"
        onConfirm={deleteGame}
      />
    </>
  );
}
