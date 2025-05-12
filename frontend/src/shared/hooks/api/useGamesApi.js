import { useApi } from './useApi';

/***************************************************************
                         Game API
***************************************************************/
export function useGamesApi() {
  const api = useApi();

  const getGames = async () => {
    const res = await api.get('/admin/games');
    return res.games;
  };

  const updateGames = async (games) => {
    return await api.put('/admin/games', { games });
  };

  // mutate (start/advance/end) a game
  const mutate = async (gameId, mutationType) => {
    const response = await api.post(`/admin/game/${gameId}/mutate`, { mutationType });
    const { status, sessionId, position } = response;

    return {
      sessionId: sessionId ?? null,
      position: position ?? -1,
      status,
    };
  };

  return {
    getGames,
    updateGames,
    start: (gameId) => mutate(gameId, 'START'),
    advance: (gameId) => mutate(gameId, 'ADVANCE'),
    end: (gameId) => mutate(gameId, 'END'),
  };
}
