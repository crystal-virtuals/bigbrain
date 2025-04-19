import { CreateGameButton, GameCardList } from '@/game/components';
import { fetchGames, updateGames } from '@/game/utils/api';
import { newGame } from '@/game/utils/helpers';
import { Heading } from '@components/heading';
import { useAuth } from '@hooks/auth';
import { useToast } from '@hooks/toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardHeading( { createGame }) {
  return (
    <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
      <Heading>Dashboard</Heading>
      <CreateGameButton onCreate={createGame} />
    </div>
  );
}

function DashboardContent({ children }) {
  return (
    <div className="container mx-auto mt-6">
      { children }
    </div>
  );
}

export default function DashboardHome() {
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
      <DashboardHeading createGame={createGame} />
      <DashboardContent>
        <GameCardList games={games} onDelete={deleteGame} onCreate={createGame} />
      </DashboardContent>
    </>
  );
}
