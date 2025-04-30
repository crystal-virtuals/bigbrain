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
    if (import.meta.env.MODE !== 'production') {
      console.error('API error:', error);
    }
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
export const gamesAPI = {
  getGames: () => api.get('/admin/games').then(res => res.games),
  updateGames: (games) => api.put('/admin/games', { games }),
}

export const fetchGames = () => api.get('/admin/games').then(res => res.games);
export const updateGames = (games) => api.put('/admin/games', { games });

// map the game status to the corresponding mutation type
const MutationTypeMap = {
  'START': 'started',
  'ADVANCE': 'advanced',
  'END': 'ended',
}

const convertSessionData = (data) => {
  const { status, sessionId, position } = data;
  return {
    sessionId: sessionId ?? null, // null for 'ended'
    position: position ?? -1, // only for advanced
    status: status, // ['started', 'advanced', 'ended']
  };
}

const mutateSession = async (gameId, mutationType) => {
  const response  = await api.post(`/admin/game/${gameId}/mutate`, { mutationType });
  return convertSessionData(response.data);
};

export const mutateGameAPI = {
  start: (gameId) => mutateSession(gameId, 'START'),
  advance: (gameId) => mutateSession(gameId, 'ADVANCE'),
  end: (gameId) => mutateSession(gameId, 'END'),
};