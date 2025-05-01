import { ButtonLink } from '@components/button';
import { ConfirmModal, AlertModal } from '@components/modal';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useToast } from '@hooks/toast';

function ConfirmStopButton({ onStop }) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const confirmStop = (e) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleStop = () => {
    setConfirmOpen(false);
    onStop();
  }

  return (
    <>
      <ButtonLink onClick={confirmStop} color="error">
        <span className="md:inline hidden">Stop Game</span>
        <span className="md:hidden inline">Stop</span>
      </ButtonLink>

      {/* "Stop Game?" Confirmation Modal */}
      <AlertModal
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        title="Stop this game?"
        description="Are you sure you want to stop the current session? All players will be sent to the results screen."
        warning="A stopped session cannot be restarted."
        confirmText="Stop Game"
        onConfirm={handleStop}
      />
    </>
  );
}

export default function StopGameButton({ game }) {
  const [sessionId, setSessionId] = useState(null);
  const [isViewResultsOpen, setIsViewResultsOpen] = useState(false);
  const navigate = useNavigate();
  const toastify = useToast();
  const { stopGame } = useOutletContext();

  const handleStop = async () => {
    try {
      const sessionId = await stopGame(game.id);
      setSessionId(sessionId);
      setIsViewResultsOpen(true); // open "View Results" modal
    } catch (error) {
      toastify.error({ message: error.message, replace: true });
    }
  };

  const handleConfirm = () => {
    if (sessionId) navigate(`/session/${sessionId}`);
  }

  if (!game.active) {
    return null; // Don't show the button if the game is not active
  }

  return (
    <>
      <ConfirmStopButton game={game} onStop={handleStop} />

      {/* View Results Modal */}
      <ConfirmModal
        title="View results?"
        description="All players have been sent to the results screen. Would you like to view the results?"
        confirmText="View Results"
        onConfirm={handleConfirm}
        isOpen={isViewResultsOpen}
        setIsOpen={setIsViewResultsOpen}
      />
    </>
  );
}
