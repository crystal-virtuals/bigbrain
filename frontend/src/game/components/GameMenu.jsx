import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@components/dropdown';
import { AlertModal } from '@components/modal';
import { EllipsisVerticalIcon, EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';


export default function GameMenu({ game, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const deleteGame = () => {
    setIsLoading(true);
    onDelete(game.id)
      .then(() => setIsOpen(false) && setIsLoading(false))
      .catch((error) => setError(error.data) && setIsLoading(false));
  };

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
