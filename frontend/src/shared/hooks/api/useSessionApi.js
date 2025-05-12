import { useApi } from './useApi';

/***************************************************************
                         Session API
***************************************************************/
export function useSessionApi() {
  const api = useApi();

  const getStatus = async (sessionId) => {
    const { results } = await api.get(`/admin/session/${sessionId}/status`);
    return results;
  };

  const getResults = async (sessionId) => {
    const { results } = await api.get(`/admin/session/${sessionId}/results`);
    return results;
  };

  return { getStatus, getResults };
}