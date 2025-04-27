/***************************************************************
                         API Calls
***************************************************************/
import axios from 'axios'
import { BACKEND_PORT } from '@frontend/backend.config.json'
import { getAuthToken } from './token.js'

const statusText = {
  200: 'OK',
  400: 'Bad Input',
  403: 'Unauthorized',
}

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


// Intercept the response and handle errors
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API error:', error);
    return Promise.reject({
      status: error.response?.status || 500,
      statusText: statusText[error.response?.status] || 'Unknown Error',
      data: error.response?.data?.error || error.message,
      request: error.config.data
    });
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
                         Game API
***************************************************************/
export const fetchGames = () => api.get('/admin/games').then(res => res.games);
export const updateGames = (games) => api.put('/admin/games', { games });
