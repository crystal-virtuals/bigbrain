import { Lobby, QuestionRunner, Results } from '@/player';
import { useToast } from '@hooks/toast';
import { Loading } from '@pages/public';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { playerAPI } from '@services/api';
import { isSessionEqual } from '@utils/session';

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
  // state variables
  const [session, setSession] = useState({
    state: STATE.LOADING,
    data: null,
  });
  // save the interval ID
  const intervalRef = useRef(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const newSession = await playerAPI.getSession(playerId);

        setSession((prev) => {
          return isSessionEqual(prev, newSession) ? prev : newSession;
        });

        // Stop polling if error or results
        if ([STATE.RESULTS, STATE.ERROR].includes(newSession.state)) {
          clearInterval(intervalRef.current);
        }

      } catch (error) {
        console.error('Error fetching session:', error);

        setSession({
          state: STATE.ERROR,
          data: { error: error.message },
        });

        clearInterval(intervalRef.current);
      }
    };

    // Start polling every second
    poll();
    intervalRef.current = setInterval(poll, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [playerId, sessionId]);

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

  // loading
  if (session.state === STATE.LOADING) {
    return <Loading />;
  }

  // lobby
  if (session.state === STATE.LOBBY) {
    return <Lobby sessionId={sessionId} playerId={playerId} />;
  }

  // results
  if (session.state === STATE.RESULTS) {
    return <Results playerId={playerId} />;
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

  // fallback
  return null;
}
