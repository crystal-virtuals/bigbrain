import { Lobby, QuestionRunner, Results } from '@/player';
import { useToast } from '@hooks/toast';
import { Loading } from '@pages/public';
import { useEffect, useState, useCallback} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { playerAPI } from '@services/api';
import { isSessionEqual } from '@utils/session';
import { useInterval } from '@hooks/interval';

const STATE = {
  LOADING: 'loading',
  LOBBY: 'lobby',
  QUESTION: 'question',
  RESULTS: 'results',
  ERROR: 'error',
};

export default function PlayerSession() {
  const { sessionId, playerId } = useParams();
  const toastify = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState({
    state: STATE.LOADING,
    data: null,
  });

  // handle errors
  useEffect(() => {
    if (session.state === STATE.ERROR) {
      toastify.error({
        message: session.data.error,
        description: 'Please check the link or rejoin the session.',
      });
      navigate('/play');
    }
  }, [session.state]);

  // poll for session updates every second
  const pollSession = useCallback(async () => {
    try {
      // Fetch the session data
      const newSession = await playerAPI.getSession(playerId);
      // Only update state if the session has changed
      setSession(prev => {
        return isSessionEqual(prev, newSession) ? prev : newSession;
      });
      // Return false to stop polling when done
      return ![STATE.RESULTS, STATE.ERROR].includes(newSession.state);
    } catch (error) {
      console.error('Error fetching session:', error);
      setSession({
        state: STATE.ERROR,
        data: { error: error.message },
      });
      return false; // Stop polling on error
    }
  }, [playerId]);
  useInterval(pollSession, 1000, true);

  // loading
  if (session.state === STATE.LOADING) {
    return <Loading />;
  }

  // lobby
  if (session.state === STATE.LOBBY) {
    return <Lobby sessionId={sessionId} playerId={playerId} />;
  }

  // question
  if (session.state === STATE.QUESTION) {
    return (
      <QuestionRunner
        playerId={playerId}
        question={session.data.question}
        answers={session.data.answers}
      />
    );
  }

  // results
  if (session.state === STATE.RESULTS) {
    return <Results playerId={playerId} />;
  }

  // fallback
  return null;
}
