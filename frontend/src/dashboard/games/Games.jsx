import { Subheading } from '@components/heading';
import { Skeleton } from '@components/loading';
import { SearchBar } from '@components/search-bar';
import { isNullOrUndefined } from '@utils/helpers';
import { useEffect, useState } from 'react';
import EmptyState from './EmptyState';
import GameCard from './GameCard';

function GamesList({ games, onDelete }) {
  const sortCriteria = (a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt); // sort by most recent
  }

  return (
    <ul role="list" className='grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-x-8 mt-3 auto-rows-fr'>
      {[...games]
        .sort(sortCriteria)
        .map((game) => (
          <li key={game.id} className="col-span-1 h-full">
            <GameCard game={game} onDelete={onDelete}/>
          </li>
        ))}
    </ul>
  );
}

export default function Games({ games, onDelete, onCreate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState([]);

  // Filter the list of games whenever the search query changes
  // or the list of games changes
  useEffect(() => {
    if (!games) return;
    const q = searchQuery.toLowerCase();
    const filtered = games.filter((game) =>
      game.name.toLowerCase().includes(q)
    );
    setFilteredGames(filtered);
  }, [searchQuery, games]);

  // If the games array is not fetched yet, it will be null
  if (isNullOrUndefined(games)) {
    return <Skeleton />;
  }

  // If the games array is empty, show the empty state
  if (games && games.length === 0) {
    return (
      <>
        <Subheading>All Games</Subheading>
        <div className="py-2 flex items-center justify-center">
          <EmptyState onCreate={onCreate} />
        </div>
      </>
    );
  }

  // Otherwise, show the list of games
  return (
    <>
      <div className="pb-5 sm:flex sm:items-center sm:justify-between">
        <Subheading>All Games</Subheading>
        <SearchBar onChange={setSearchQuery} />
      </div>

      <GamesList games={filteredGames} onDelete={onDelete} />
    </>
  );
}
