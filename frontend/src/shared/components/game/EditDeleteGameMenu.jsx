import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@components/dropdown';
import { DialogWithIcon } from '@components/dialog';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { useToast } from '@hooks/toast';
import { useState } from 'react';

// Edit Delete Game Menu
export default function EditDeleteGameMenu({ game, onDelete, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toastify = useToast();

  const deleteGame = () => {
    setIsLoading(true);
    onDelete(game.id)
      .then(() => {
        toastify.success({ message: 'Game deleted!' });
      })
      .catch((error) => {
        toastify.error({ message: error.message, replace: true });
      })
      .finally(() => {
        setIsLoading(false);
        setIsOpen(false);
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
          <EllipsisHorizontalIcon aria-hidden="true" />
        </DropdownButton>
        <DropdownMenu className="hover:cursor-pointer">
          <DropdownItem href={`/game/${game.id}`}>View</DropdownItem>
          <DropdownItem href={`/game/${game.id}`}>Edit</DropdownItem>
          <DropdownItem onClick={() => setIsOpen(true)}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Delete Confirmation Alert */}
      <DialogWithIcon
        icon="error"
        confirmText="Delete"
        title="Delete this game?"
        description="Are you sure you want to delete this game? This action cannot be undone."
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={deleteGame}
        disabled={isLoading}
      />
    </>
  );
}
