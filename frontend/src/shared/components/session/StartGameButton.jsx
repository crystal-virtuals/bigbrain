import { ButtonLink } from '@components/button';
import { CopySessionId } from '@components/clipboard';
import { DialogWithIcon } from '@components/dialog';
import { useToast } from '@hooks/toast';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Text } from '@components/text';

function StartButton({ game, onStart }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    // if game has no questions, update dialog message
    if (!game.questions || game.questions.length === 0) {
      setIsOpen(true);
      return;
    } else {
      setIsOpen(false);
      if (onStart) onStart();
    }
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

      <DialogWithIcon
        icon="error"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="This game has no questions!"
        description="Please add questions to the game before starting it."
        confirmText="Edit Game"
        onConfirm={() => {
          setIsOpen(false);
          navigate(`/game/${game.id}`, { replace: true });
        }}
      />
    </>
  );
}


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

  return (
    <>
      <StartButton game={game} onStart={handleClick} />

      {/* Modal */}
      <DialogWithIcon
        icon="info"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Game Started!"
        description={
          <div className="flex flex-col gap-2">
            <Text>Share the link below with your friends.</Text>
            <CopySessionId sessionId={sessionId} />
          </div>
        }
        confirmText={<>Lobby <span aria-hidden="true">&rarr;</span></>}
        onConfirm={() => {
          setIsOpen(false);
          navigate(`/session/${sessionId}`);
        }}
      />
    </>
  );
}
