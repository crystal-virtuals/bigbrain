import { Layout } from '@components/session/layout';
import { SessionNavbar as Navbar } from '@components/session/navbar';
import { useToast } from '@hooks/toast';
import { Loading } from '@pages/public';
import { playerAPI } from '@services/api';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionRunner from './QuestionRunner';
import Lobby from './Lobby';
import PlayResults from './PlayResults';
import { InputError } from '@services/error';

export default function PlaySession() {
  const { sessionId, playerId } = useParams();
  const [state, setState] = useState({
    status: 'loading',
    error: null,
    currentQuestion: null,
    correctAnswers: null,
  });
  const toastify = useToast();
  const navigate = useNavigate();

  const lastQuestionId = useRef(null);
  const pollingAnswers = useRef(false);

  useEffect(() => {
    let statusInterval = null;
    let answersInterval = null;

    const pollStatus = async () => {
      try {
        // stop polling if we are in results
        if (state.status === 'results')  {
          clearInterval(statusInterval);
          clearInterval(answersInterval);
          return;
        }

        const hasStarted = await playerAPI.getStatus(playerId);

        if (!hasStarted) {
          setState((prev) => ({
            ...prev,
            status:
              prev.status === 'question' || prev.status === 'answers'
                ? 'results'
                : 'lobby',
            currentQuestion: null,
            correctAnswers: null,
          }));
          return;
        }

        const question = await playerAPI.getQuestion(playerId);

        // Only update if question changed
        if (!lastQuestionId.current || question.id !== lastQuestionId.current) {
          lastQuestionId.current = question.id;
          pollingAnswers.current = false;

          setState((prev) => ({
            ...prev,
            status: 'question',
            currentQuestion: question,
            correctAnswers: null,
          }));
        }

        // Start answers polling
        if (!pollingAnswers.current && state.status !== 'results') {
          pollingAnswers.current = true;
          if (answersInterval) clearInterval(answersInterval);

          answersInterval = setInterval(async () => {
            try {
              const answers = await playerAPI.getAnswers(playerId);
              setState((prev) => {
                // Only transition to answers if we're still on a question
                if (prev.status === 'question') {
                  return {
                    ...prev,
                    status: 'answers',
                    correctAnswers: answers,
                  };
                }
                return prev;
              });

              clearInterval(answersInterval);
              pollingAnswers.current = false;
              setTimeout(pollStatus, 3000);
            } catch (err) {
              console.log('Waiting for answers:', err.message);
            }
          }, 2000);
        }
      } catch (err) {
        console.error('Polling error:', err.message);
        if (err instanceof InputError) {
          setState((prev) => ({
            ...prev,
            status: 'results',
            currentQuestion: null,
            correctAnswers: null,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            error: err.message,
          }));
        }
      }
    };

    pollStatus();
    statusInterval = setInterval(pollStatus, 2000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(answersInterval);
    };
  }, [playerId, state.status]);

  useEffect(() => {
    if (state.error) {
      toastify.error({
        message: state.error,
        description: 'Please check the link or rejoin the session.',
      });
      navigate('/play');
    }
  }, [state.error]);

  if (state.status === 'loading') return <Loading />;

  if (state.status === 'results')
    return (
      <Layout navbar={<Navbar sessionId={sessionId} />}>
        <PlayResults playerId={playerId} />
      </Layout>
    );

  if (state.status === 'lobby')
    return (
      <Layout navbar={<Navbar sessionId={sessionId} />}>
        <Lobby sessionId={sessionId} playerId={playerId} />
      </Layout>
    );

  return (
    <Layout navbar={<Navbar sessionId={sessionId} />}>
      <QuestionRunner
        playerId={playerId}
        question={state.currentQuestion}
        correctAnswers={state.correctAnswers}
        showAnswers={state.status === 'answers'}
      />
    </Layout>
  );
}
