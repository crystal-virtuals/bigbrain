import { ButtonLink } from '@components/button';
import { useToast } from '@hooks/toast';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { DialogWithIcon } from '@components/dialog';

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

      <DialogWithIcon
        icon='info'
        title="View results?"
        description="All players have been sent to the results screen. Would you like to view the results?"
        confirmText="View Results"
        onConfirm={handleStop}
        open={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}

export default function StopGameButton({ game }) {
  const navigate = useNavigate();
  const toastify = useToast();
  const { stopGame } = useOutletContext();

  const handleStop = async () => {
    try {
      const sessionId = await stopGame(game.id);
      // Navigate directly to results after stopping
      navigate(`/session/${sessionId}`); 
    } catch (error) {
      toastify.error({ message: error.message, replace: true });
    }
  };

  if (!game.active) {
    return null;
  }

  return (
    <ConfirmStopButton onStop={handleStop} />
  );
}