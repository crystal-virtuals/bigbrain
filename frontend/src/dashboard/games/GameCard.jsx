import { PresenceIndicator } from '@components/avatar';
import { Badge } from '@components/badge';
import { TextLink } from '@components/text';
import { CheckIcon } from '@heroicons/react/16/solid';
import { ClockIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { getNumberOfQuestions, getTotalDuration } from '@utils/game';
import { GameThumbnail, EditDeleteGameMenu } from '@components/game';
import { StartGameButton, StopGameButton } from '@components/session';
import { clsx } from 'clsx';
import { CardHeader } from '@components/card';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@hooks/toast';
import { Modal } from '@components/modal';

function GameStatus({ game }) {
  // game ended
  if (game.status === 'ended') {
    return (
      <div className="text-white text-xs md:text-sm rounded-br-lg z-3 absolute left-0 top-0 p-3 leading-none font-bold bg-black/70 select-none">
        <CheckIcon className="inline-block size-4" />
        <span className="md:inline-block hidden pl-1">Played</span>
      </div>
    );
  }
  // active game
  if (game.active) {
    return (
      <div className="text-white text-xs md:text-sm rounded-br-lg z-1 absolute left-0 top-0 p-3 leading-none font-bold bg-active select-none">
        <span className="md:inline-block hidden pl-1">In Progress</span>
      </div>
    );
  }
}

function GameMetadata({ game }) {
  return (
    <div className="flex flex-row items-center flex-shrink-0 space-x-3">
      {/* Total Duration */}
      <Badge color="indigo" className="flex flex-shrink-0">
        <ClockIcon aria-hidden="true" className="size-4" />
        {getTotalDuration(game.questions)}
      </Badge>
      {/* Number of Questions */}
      <Badge color="fuchsia" className="flex flex-shrink-0">
        <QuestionMarkCircleIcon aria-hidden="true" className="size-4" />
        {getNumberOfQuestions(game.questions)}
      </Badge>
    </div>
  );
}

function GameCard({ game, onDelete }) {
  const [isViewResultsOpen, setIsViewResultsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const { stopGameSession } = useOutletContext();
  const navigate = useNavigate();
  const toastify = useToast();

  const handleStopGame = async () => {
    try {
      const sessionId = await stopGameSession(game.id);
      setSessionId(sessionId);
      setIsViewResultsOpen(true); // open "View Results" modal
    } catch (error) {
      toastify.error({ message: error.message, replace: true });
    }
  };

  const navigateToResults = () => {
    console.log('Navigating to results for session:', sessionId);
    if (sessionId) navigate(`/session/${sessionId}`);
    setIsViewResultsOpen(false);
  };

  return (
    <div
      className={clsx(
        'relative rounded-xl p-1 flex flex-col gap-4 h-full',
        game.active && 'bg-active/5 outline-2 outline-active/50'
      )}
    >
      <CardHeader>
        {/* Thumbnail */}
        <div className="absolute top-0 left-0 z-0 w-full h-full">
          <GameThumbnail game={game} />
        </div>
        {/* Play Button */}
        <div className="z-2 absolute top-0 left-0 w-full h-full visible">
          <div className="z-3 absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ease-in-out bg-black/60 opacity-0 hover:opacity-100 ">
            <StartGameButton game={game} />
            {game.active && <StopGameButton game={game} onStop={handleStopGame} />}
          </div>
        </div>
        <GameStatus game={game} />
      </CardHeader>

      <div className="rounded-b-xl flex flex-col w-full space-y-0.5 bg-transparent">
        <TextLink
          className={clsx(
            'line-clamp-2 font-bold pb-1',
            !game.active && 'hover:underline',
            game.active && 'pointer-events-none'
          )}
          title={game.name}
          to={`/game/${game.id}`}
          disabled={game.active}
        >
          {game.name}
        </TextLink>

        <div className="flex flex-row items-center justify-between h-8">
          <GameMetadata game={game} />
          {!game.active && (
            <EditDeleteGameMenu game={game} onDelete={onDelete} />
          )}
        </div>
      </div>

      {/* Active Game indicator */}
      {game.active && (
        <div className="z-10 absolute -top-2 -right-2">
          <PresenceIndicator color="active" size="md" />
        </div>
      )}


      {/* View Results Modal */}
      <Modal
        color="info"
        title="View results?"
        description="Would you like to view the results?"
        buttonText="View Results"
        isOpen={isViewResultsOpen}
        setIsOpen={setIsViewResultsOpen}
        onClick={navigateToResults}
      />
    </div>
  );
}

export default GameCard;
