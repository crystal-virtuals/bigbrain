import { GameCard, NewGameModal } from '@components/game';
import { Subheading } from '@components/heading';
import { Strong, Text } from '@components/text';
import { SearchBar } from '@components/search-bar';
import { useEffect, useState } from 'react';
import { Skeleton } from '@components/loading';
import { isNullOrUndefined } from '@utils/helpers';
import clsx from 'clsx';

function GamesList({ games, onDelete }) {
  return (
    <ul
      role="list"
      className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-x-8"
    >
      {[...games]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((game) => (
          <GameCard key={game.id} game={game} onDelete={onDelete} />
        ))}
    </ul>
  );
}

const styles = {
  dashed: [
    // Base
    'group w-full relative block rounded-lg p-12 text-center',
    // Background
    'bg-transparent hover:bg-pink-400/10',
    // Border
    'border-2 border-dashed border-zinc-950/10 text-zinc-950',
    // Dark mode
    'dark:border-white/15 dark:text-white',
    // Hover
    'hover:border-pink-400',
    // Cursor
    'cursor-pointer touch-manipulation pointer-events-auto',
  ],
};

function EmptyState({ onCreate }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button */}
      <button
        type="button"
        aria-label="Create a new game"
        onClick={() => setIsOpen(true)}
        className={clsx(styles.dashed)}
      >
        <div className="rounded-lg flex flex-col items-center p-12">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="mx-auto size-12 text-gray-400 mb-2 "
          >
            <path
              d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Strong className="font-semibold">Create a new game</Strong>
          <Text className="mt-1 text-sm text-gray-500">
            You haven’t created a game yet. Create one to get started.
          </Text>
        </div>
      </button>

      {/* Modal */}
      <NewGameModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={onCreate} />
    </>
  );
}

export default function GameCardList({ games, onDelete, onCreate }) {
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
