import { Button, ButtonLink } from '@components/button';
import { CopySessionId } from '@components/clipboard';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@hooks/toast';
import { useOutletContext } from 'react-router-dom';

export default function StartGameButton({ game }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const { startGame } = useOutletContext(); // get from AdminLayout
  const navigate = useNavigate();
  const toastify = useToast();

  useEffect(() => {
    if (redirectUrl) {
      navigate(redirectUrl);
    }
    return () => setRedirectUrl(null);
  }, [redirectUrl]);

  const handleClick = async () => {
    // game is already active, navigate to the session
    if (game.active) {
      setRedirectUrl(`/session/${game.active}`);
      return;
    }
    // game is not active, start a new session
    try {
      const newSessionId = await startGame(game.id);
      setSessionId(newSessionId);
      setIsOpen(true);
    } catch (error) {
      toastify.error({ message: error.message, replace: true });
    }
  };

  const toLobby = () => {
    setIsOpen(false);
    navigate(`/session/${sessionId}`);
  };

  return (
    <>
      <ButtonLink onClick={handleClick} color={game.active ? 'green' : 'pink'}>
        <span className="md:inline hidden">
          {game.active ? 'Enter Game' : 'Start Game'}
        </span>
        <span className="md:hidden inline">
          {game.active ? 'Enter' : 'Start'}
        </span>
      </ButtonLink>

      {/* Modal */}
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Game Started!</DialogTitle>
        <DialogDescription>
          Share the link below with your friends.
        </DialogDescription>
        <DialogBody>
          <CopySessionId sessionId={sessionId} />
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={toLobby}>
            Lobby <span aria-hidden="true">&rarr;</span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
