import { fetchGames, updateGames } from '@/game/utils/api';
import { newGame, isEqual } from '@/game/utils/helpers';
import { useAuth } from '@hooks/auth';
import { useToast } from '@hooks/toast';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const [games, setGames] = useState([]);
  const { user } = useAuth();
  const toastify = useToast();
  const navigate = useNavigate();

  // Fetch games on mount
  useEffect(() => {
    fetchGames()
      .then((games) => {
        console.log('Got all games:', games);
        setGames(games);
      })
      .catch((error) => {
        console.error('Error fetching games:', error);
        toastify.error(error.data);
        (error.status === 403) && navigate('/403');
      });
  }, []);

  const createGame = (name) => {
    const updatedGames = [...games, newGame(name, user)];
    return updateGames(updatedGames)
      .then(() => {
        toastify.success('Successfully created game');
        setGames(updatedGames);
      })
      .catch((error) => {
        toastify.error('Failed to create game. Please try again later.');
        return Promise.reject(error);
      });
  };

  const deleteGame = (gameId) => {
    const updatedGames = games.filter((game) => game.id !== gameId);
    return updateGames(updatedGames)
      .then(() => {
        toastify.success('Successfully deleted game');
        setGames(updatedGames);
      })
      .catch((err) => {
        console.error('Error deleting game:', err);
        toastify.error('Failed to delete game. Please try again later.');
        return Promise.reject(err);
      });
  }

  return (
    <>
      <Outlet context={{ user, games, setGames, createGame, deleteGame }} />
    </>
  );
}

export default AdminLayout;
