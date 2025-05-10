import { Lobby, QuestionRunner, Results } from '@/play';
import { Layout } from '@components/session/layout';
import { SessionNavbar as Navbar } from '@components/session/navbar';
import { useToast } from '@hooks/toast';
import { Loading } from '@pages/public';
import { playerAPI } from '@services/api';
import { InactiveSessionError } from '@services/error';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@components/loading';

const STATE = {
  LOADING: 'loading',
  LOBBY: 'lobby',
  QUESTION: 'question',
  RESULTS: 'results',
  ERROR: 'error',
}

async function getSession(playerId) {
  try {
    const started = await playerAPI.getStatus(playerId);

    // session not started (waiting in lobby)
    if (!started) {
      return { state: STATE.LOBBY, data: null };
    }

    // session started (in progress, question available)
    const question = await playerAPI.getQuestion(playerId);

    // see if answers are available
    try {

      // question and answers are available
      const answers = await playerAPI.getAnswers(playerId);
      return { state: STATE.QUESTION, data: { question, answers } };

    } catch (answersError) {

      // question is available but answers are not
      if (answersError.message === 'Answers are not available yet') {
        return { state: STATE.QUESTION, data: { question } };
      }

      throw answersError;
    }

  } catch (error) {

    // inactive session (session finished)
    if (error instanceof InactiveSessionError) {
      const results = await playerAPI.getResults(playerId);
      return { state: STATE.RESULTS, data: { results } };
    }

    // other errors
    throw error;
  }
}

function isSessionEqual(a, b) {
  if (a.state !== b.state) return false;
  if (a.data?.question?.id !== b.data?.question?.id) return false;
  if (a.data?.answers?.length !== b.data?.answers?.length) return false;
  return true;
}

export default function PlaySession() {
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
        const newSession = await getSession(playerId);

        setSession(prev => {
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
    return (
      <Layout navbar={<Navbar sessionId={sessionId} />}>
        <Lobby sessionId={sessionId} playerId={playerId} />
      </Layout>
    );
  }

  // results
  if (session.state === STATE.RESULTS) {
    return (
      <Layout navbar={<Navbar sessionId={sessionId} />}>
        <Results playerId={playerId} />
      </Layout>
    );
  }

  // question
  if (session.state === STATE.QUESTION) {
    return (
      <Layout navbar={<Navbar sessionId={sessionId} />}>
        <QuestionRunner
          playerId={playerId}
          question={session.data.question}
          answers={session.data.answers}
        />
      </Layout>
    );
  }

  // fallback
  return null;
}
