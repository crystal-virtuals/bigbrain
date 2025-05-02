import { NotFound } from '@pages/errors';
import { useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import Lobby from './Lobby';
import QuestionRunner from './QuestionRunner';
import Results from './Results';

function getSessionState(session) {
  if (!session) return 'invalid';
  if (session.active === false && session.position !== -1) return 'finished';
  if (session.active === true && session.position === -1) return 'not_started';
  if (session.active === true && session.position !== -1) return 'in_progress';
  return 'invalid';
}

function AdminSession() {
  const { sessionId } = useParams();
  const { session, game, advanceGame, stopGame } = useOutletContext();
  const [lock, setLock] = useState(false);


  const handleAdvanceGame = async () => {
    if (lock) return;
    setLock(true);
    try {
      await advanceGame(game.id);
    } catch (error) {
      console.error('Failed to advance game:', error);
    }
    setLock(false);
  };

  const handleStopGame = async () => {
    if (lock) return;
    setLock(true);
    try {
      await stopGame(game.id);
    } catch (error) {
      console.error('Failed to stop game:', error);
    }
    setLock(false);
  };


  const sharedProps = {
    sessionId,
    session,
    game,
    lock,
    setLock,
    advanceGame: handleAdvanceGame,
    stopGame: handleStopGame,
  };

  const state = getSessionState(session);
  switch (state) {
    case 'finished':
      return <Results {...sharedProps} />;

    case 'not_started':
      return <Lobby {...sharedProps} />;

    case 'in_progress':
      return <QuestionRunner {...sharedProps} />;

    default:
      return <NotFound />; // or 404 fallback if invalid session
  }
}

export default AdminSession;
