/***************************************************************
                         API Calls
***************************************************************/
import axios from 'axios'
// import { BACKEND_PORT } from '@frontend/backend.config.json'
import { getAuthToken } from './token.js'
import { APIError } from '@constants/errors'
import { InactiveSessionError } from '@constants/errors';

export const DEFAULT_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
}

// Create an axios instance
const instance = axios.create(DEFAULT_CONFIG);

// Intercept the request before it is sent and use the latest token
instance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete config.headers['Authorization'];
  }
  return config;
});

// Intercept the response and return an Error object
instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(APIError(error))
);


export const api = (method, url, payload) => {
  method = method.toLowerCase();
  return instance({
    method,
    url,
    data: ['post', 'put'].includes(method) ? payload : undefined,
    params: ['get', 'delete'].includes(method) ? payload : undefined,
  });
};


/***************************************************************
                Games and Sessions API (Admin)
***************************************************************/
const request = {
  get: (url, payload) => api('get', url, payload),
  post: (url, payload) => api('post', url, payload),
  put: (url, payload) => api('put', url, payload),
  delete: (url, payload) => api('delete', url, payload),
};

const mutate = async (gameId, mutationType) => {
  const response  = await request.post(`/admin/game/${gameId}/mutate`, { mutationType });
  const { status, sessionId, position } = response.data;
  return {
    sessionId: sessionId ?? null, // null for 'ended'
    position: position ?? -1,     // only for 'advanced'
    status: status,               // ['started', 'advanced', 'ended']
  }
};

export const gamesAPI = {
  getGames: () => request.get('/admin/games').then(res => res.games),
  updateGames: (games) => request.put('/admin/games', { games }),
  start: (gameId) => mutate(gameId, 'START'),
  advance: (gameId) => mutate(gameId, 'ADVANCE'),
  end: (gameId) => mutate(gameId, 'END'),
}

export const sessionAPI = {
  getStatus: (sessionId) => request.get(`/admin/session/${sessionId}/status`).then(res => res.results),
  getResults: (sessionId) => request.get(`/admin/session/${sessionId}/results`).then(res => res.results),
}

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

export const playerAPI = {
  joinSession: (sessionId, name) => request.post(`/play/join/${sessionId}`, { name }).then(res => res.playerId),
  getStatus: (playerId) => request.get(`/play/${playerId}/status`).then(res => res.started),
  getQuestion: (playerId) => request.get(`/play/${playerId}/question`).then(res => res.question),
  getAnswers: (playerId) => request.get(`/play/${playerId}/answer`).then(res => res.answers),
  putAnswers: (playerId, answers) => request.put(`/play/${playerId}/answer`, { answers: answers }),
  getResults: (playerId) => request.get(`/play/${playerId}/results`),
  getSession: (playerId) => getSession(playerId),
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