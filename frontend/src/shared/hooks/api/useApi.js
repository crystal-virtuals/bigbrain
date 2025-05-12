import { api } from '@services/api';
import { InputError } from '@services/error';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

export function useApi() {
  const { showBoundary } = useErrorBoundary();
  const navigate = useNavigate();

  const request = async (method, url, payload) => {
    try {
      return await api[method](url, payload);
    } catch (error) {
      // Let InputError be handled by the caller
      if (error instanceof InputError) {
        throw error;
      }

      // Handle redirection errors
      if (error.redirect && error.redirectPath) {
        navigate(error.redirectPath);
        return;
      }

      // Show fallback UI for unknown errors
      showBoundary(error);
    }
  };

  return {
    get: (url, payload) => request('get', url, payload),
    post: (url, payload) => request('post', url, payload),
    put: (url, payload) => request('put', url, payload),
    delete: (url, payload) => request('delete', url, payload),
  };
}
