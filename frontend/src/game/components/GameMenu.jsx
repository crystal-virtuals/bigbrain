import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@components/dropdown';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { AlertModal } from '@components/modal';

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
          <EllipsisVerticalIcon aria-hidden="true" className="size-6 text-zinc-600"/>
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
        handleConfirm={deleteGame}
        isLoading={isLoading}
        error={error}
        confirmText="Delete"
      />
      {/* <Alert open={isOpen} onClose={setIsOpen}>
        <div className="flex items-start">
          <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
            <ExclamationTriangleIcon
              aria-hidden="true"
              className="size-6 text-red-600"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <AlertTitle>Delete this game?</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <Text>
                You are about to delete this game and all of its data. No one
                will be able to access this game ever again.
              </Text>
              <span className="font-semibold text-gray-900 dark:text-zinc-300">Are you sure? This action cannot be undone.</span>
            </AlertDescription>
          </div>
        </div>
        <AlertActions className="mt-5 flex flex-row-reverse">
          <Button plain onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <ButtonSubmit color="red" onClick={deleteGame} loading={isLoading}>
            Delete
          </ButtonSubmit>
        </AlertActions>
        {!!error && <ErrorMessage>{error}</ErrorMessage>}
      </Alert> */}
    </>
  );
}
