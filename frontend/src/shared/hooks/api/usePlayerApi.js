import { useApi } from './useApi';
import { InactiveSessionError } from '@constants/errors';

/***************************************************************
                         Player API
***************************************************************/
const STATE = {
  LOADING: 'loading',
  LOBBY: 'lobby',
  QUESTION: 'question',
  RESULTS: 'results',
  ERROR: 'error',
};

export function usePlayerApi() {
  const { get, post, put } = useApi();

  const joinSession = async (sessionId, name) => {
    const { playerId = null } = await post(`/play/join/${sessionId}`, { name });
    return playerId;
  };

  const getStatus = async (playerId) => {
    const { started = false } = await get(`/play/${playerId}/status`);
    return started;
  };

  const getQuestion = async (playerId) => {
    const { question = null } = await get(`/play/${playerId}/question`);
    return question;
  };

  const getAnswers = async (playerId) => {
    const { answers = [] } = await get(`/play/${playerId}/answer`);
    return answers;
  };

  const putAnswers = async (playerId, answers) => {
    return await put(`/play/${playerId}/answer`, { answers });
  };

  const getResults = async (playerId) => {
    const results = await get(`/play/${playerId}/results`);
    return results ?? {};
  };

  const getSession = async (playerId) => {
    try {
      const started = await getStatus(playerId);

      // session not started (waiting in lobby)
      if (!started) {
        return { state: STATE.LOBBY, data: null };
      }

      // session started (in progress, question available)
      const question = await getQuestion(playerId);

      // see if answers are available
      try {
        // question and answers are available
        const answers = await getAnswers(playerId);
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
        const results = await getResults(playerId);
        return { state: STATE.RESULTS, data: { results } };
      }
      // other errors
      throw error;
    }
  }

  return {
    joinSession,
    getStatus,
    getQuestion,
    getAnswers,
    putAnswers,
    getResults,
    getSession,
  };
}
