import { ButtonLink } from '@components/button';
import { Modal } from '@components/modal';
import { useState } from 'react';

export default function StopGameButton({ game, onStop }) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const confirmStop = (e) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  return (
    <>
      <ButtonLink onClick={confirmStop} color="error">
        <span className="md:inline hidden">Stop Game</span>
        <span className="md:hidden inline">Stop</span>
      </ButtonLink>

      {/* "Stop Game?" Confirmation Modal */}
      <Modal
        color="error"
        title="Stop this game?"
        description="Are you sure you want to stop the current session? All players will be sent to the results screen."
        strongText="A stopped session cannot be restarted."
        buttonText="Stop"
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        onClick={() => {
          setConfirmOpen(false);
          onStop();
        }}
      />
    </>
  );
}
