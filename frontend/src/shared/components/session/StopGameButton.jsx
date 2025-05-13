import { ButtonLink } from '@components/button';
import { DialogWithIcon } from '@components/dialog';
import { useToast } from '@hooks/toast';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function StopGameButton({ game }) {
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();
  const toastify = useToast();
  const { stopGame } = useOutletContext();

  // Stop the game and show the "View Results" dialog
  const handleStopGame = async () => {
    try {
      const id = await stopGame(game.id);
      setIsStopDialogOpen(false);
      setSessionId(id);
      setTimeout(() => {
        setIsResultsDialogOpen(true);
      }, 1000);
    } catch (error) {
      toastify.error({ message: error.message, replace: true });
      setIsStopDialogOpen(false);
      setIsResultsDialogOpen(false);
    }
  };

  // Navigate to results screen
  const handleViewResults = () => {
    if (sessionId) {
      navigate(`/session/${sessionId}`);
      setSessionId(null);
      setIsResultsDialogOpen(false);
    }
  };

  // Show the "View Results" dialog if the game is not active (stopped)
  if (!game.active) return (
    <DialogWithIcon
      icon="info"
      open={isResultsDialogOpen}
      onClose={() => setIsResultsDialogOpen(false)}
      title="View results?"
      description="The game has been stopped. All players have been sent to the results screen. Would you like to view the results?"
      confirmText={
        <div>
          View Results <span aria-hidden="true">&rarr;</span>
        </div>
      }
      onConfirm={handleViewResults}
    />
  )

  return (
    <>
      <ButtonLink color="error" onClick={() => setIsStopDialogOpen(true)}>
        <span className="md:inline hidden">Stop Game</span>
        <span className="md:hidden inline">Stop</span>
      </ButtonLink>

      { /* Stop game dialog */}
      <DialogWithIcon
        icon="error"
        open={isStopDialogOpen}
        onClose={() => setIsStopDialogOpen(false)}
        title="Stop Game?"
        description="Are you sure you want to stop the game? All players will be sent to the results screen."
        confirmText="Stop Game"
        onConfirm={handleStopGame}
      />
    </>
  );
}
