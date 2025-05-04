/***************************************************************
                         API Calls
***************************************************************/
import axios from 'axios'
import { BACKEND_PORT } from '@frontend/backend.config.json'
import { getAuthToken } from './token.js'
import { createError } from './error.jsx'

const instance = axios.create({
  baseURL: `http://localhost:${BACKEND_PORT}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
  (error) => {
    console.error('API error:', error);
    return Promise.reject(createError(error));
  }
);

const apiCall = (method, url, payload) => {
  return instance({
    method,
    url,
    data: ['POST', 'PUT'].includes(method) ? payload : undefined,
    params: ['GET', 'DELETE'].includes(method) ? payload : undefined,
  });
};

export const api = {
  get: (url, payload) => apiCall('GET', url, payload),
  post: (url, payload) => apiCall('POST', url, payload),
  put: (url, payload) => apiCall('PUT', url, payload),
  delete: (url, payload) => apiCall('DELETE', url, payload),
};

/***************************************************************
                      Authentication
***************************************************************/
async function register({ email, password, name }) {
  return api.post('/admin/auth/register', { email, password, name })
    .then(res => res.token);
}

async function login ({ email, password }) {
  return api.post('/admin/auth/login', { email, password })
    .then(res => res.token);
}

async function logout () {
  return api.post('/admin/auth/logout')
}

export const authAPI = {
  register,
  login,
  logout,
}

/***************************************************************
                         Game API
***************************************************************/
const mutateSession = async (gameId, mutationType) => {
  const response  = await api.post(`/admin/game/${gameId}/mutate`, { mutationType });
  const { status, sessionId, position } = response.data;
  return {
    sessionId: sessionId ?? null, // null for 'ended'
    position: position ?? -1,     // only for 'advanced'
    status: status,               // ['started', 'advanced', 'ended']
  }
};


// get/update all games
export const gamesAPI = {
  getGames: () => api.get('/admin/games').then(res => res.games),
  updateGames: (games) => api.put('/admin/games', { games }),
}

// mutate (start/advance/end) a game
export const gameAPI = {
  // returns an object with sessionId, position, status
  start: (gameId) => mutateSession(gameId, 'START'),
  advance: (gameId) => mutateSession(gameId, 'ADVANCE'),
  end: (gameId) => mutateSession(gameId, 'END'),
};

// get status/results of a game session
export const sessionAPI = {
  getStatus: (sessionId) => api.get(`/admin/session/${sessionId}/status`).then(res => res.results),
  getResults: (sessionId) => api.get(`/admin/session/${sessionId}/results`).then(res => res.results),
}


/**
 * Fetch all games and their sessions
 * @returns { games: Array, sessions: Object }
 */
export const fetchGamesAndSessions = async () => {
  try {
    // fetch the list of games
    const games = await gamesAPI.getGames();

    // collect all session IDs from each game
    const sessionIds = games.flatMap(game => {
      const ids = [];
      if (game.active) ids.push(game.active);
      if (game.oldSessions) ids.push(...game.oldSessions);
      return ids;
    })

    // fetch the status of each session
    const sessionEntries = await Promise.all(
      sessionIds.map(async (sessionId) => {
        try {
          const sessionStatus = await sessionAPI.getStatus(sessionId);
          return [sessionId, sessionStatus];
        } catch (error) {
          console.warn(`Failed to fetch session ${sessionId}:`, error);
          return [sessionId, null];
        }
      })
    );

    // convert session entries to an object
    const sessions = Object.fromEntries(sessionEntries);
    return { games, sessions };
  } catch (error) {
    console.error('Error loading games and sessions:', error);
    return { games: [], sessions: {} };
  }
}
/***************************************************************
                         Player API
***************************************************************/
export const playerAPI = {
  joinSession: (sessionId, name) => api.post(`/play/join/${sessionId}`, { name }).then(res => res.playerId),
  getSessionStatus: (playerId) => api.get(`/play/${playerId}/status`).then(res => res.started),
  getTimeLastQuestionStarted: (playerId) => api.get(`/play/${playerId}/question`).then(res => res.isoTimeLastQuestionStarted),
  getAnswer: (playerId) => api.get(`/play/${playerId}/answer`),
  putAnswer: (playerId, answers) => api.put(`/play/${playerId}/answer`, { answers: answers }),
  getResults: (playerId) => api.get(`/play/${playerId}/results`),
}