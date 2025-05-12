import { apiCall } from '@services/api';
import { InputError, NetworkError } from '@constants/errors';
import { useErrorBoundary } from 'react-error-boundary';
import { useToast } from '@hooks/toast';

export function useApi() {
  const { showBoundary } = useErrorBoundary();
  const toastify = useToast();

  const request = async (method, url, payload) => {
    try {
      return await apiCall(method, url, payload);
    } catch (error) {
      // Let InputErrors be handled by the caller
      if (error instanceof InputError) {
        throw error;
      }
      // Handle network errors
      // if (error instanceof NetworkError) {
      //   toastify.error({ message: error.message, replace: true });
      //   return;
      // }
      // Show fallback UI for everything else
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