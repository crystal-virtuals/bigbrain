/***************************************************************
                         API Calls
***************************************************************/
import axios from 'axios'
import { BACKEND_PORT } from '../../../backend.config.json'
import { getAuthToken, removeAuthToken } from './auth.js'

const instance = axios.create({
  baseURL: `http://localhost:${BACKEND_PORT}`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': getAuthToken() ? `Bearer ${getAuthToken()}` : undefined,
  }
});

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 403) {
      removeAuthToken();
      alert('Token removed! Forbidden access.');
      console.trace('Token Removed');
    }

    return Promise.reject(
      error.response?.data?.error || error.response?.data || error.message
    );
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