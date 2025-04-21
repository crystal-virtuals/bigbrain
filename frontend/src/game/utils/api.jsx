import { api } from "@services/api";

export const fetchGames = () => api.get('/admin/games').then(res => res.games);
export const updateGames = (games) => api.put('/admin/games', { games });
