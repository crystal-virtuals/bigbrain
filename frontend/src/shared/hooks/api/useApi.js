import { InputError } from '@constants/errors';
import { api } from '@services/api';
import { useErrorBoundary } from 'react-error-boundary';

export function useApi() {
  const { showBoundary } = useErrorBoundary();

  const request = async (method, url, payload) => {
    try {
      const result =  await api(method, url, payload);
      return result ?? {};
    } catch (error) {
      // Let InputErrors be handled by the caller
      if (error instanceof InputError) {
        throw error;
      }
      showBoundary(error);
      throw error; // re-throw after showing boundary
    }
  };

  return {
    get: (url, payload) => request('get', url, payload),
    post: (url, payload) => request('post', url, payload),
    put: (url, payload) => request('put', url, payload),
    delete: (url, payload) => request('delete', url, payload),
  };
}
