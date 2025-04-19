import { GameCard, NewGameModal } from '@/game/components';
import { Subheading } from '@components/heading';
import { Input, InputGroup } from '@components/input';
import { Strong, Text } from '@components/text';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

function SearchBar({ onChange }) {
  return (
    <InputGroup className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
      <MagnifyingGlassIcon aria-hidden="true" />
      <Input
        name="search"
        type="search"
        placeholder="Search games"
        aria-label="Search games"
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
}

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

function EmptyState({ onCreate }) {
  const [isOpen, setIsOpen] = useState(false);
  const styles = {
    focusRing:
      'focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-4 ring-offset-white dark:ring-offset-zinc-900 focus:outline-hidden',
    border:
      'border-2 border-dashed border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20',
    hoverBg: 'hover:bg-fuchsia-300/10',
  };

  return (
    <>
      {/* Button */}
      <button
        type="button"
        aria-label="Create a new game"
        onClick={() => setIsOpen(true)}
        className={clsx(
          'w-full rounded-lg text-center',
          styles.focusRing,
          styles.border,
          styles.hoverBg
        )}
      >
        <div className={clsx('rounded-lg flex flex-col items-center p-12')}>
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="mx-auto size-12 text-gray-400 mb-2"
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
  const [filteredGames, setFilteredGames] = useState(games);
  // Filter the list of games whenever the search query changes
  // or the list of games changes
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = games.filter((game) =>
      game.name.toLowerCase().includes(q)
    );
    setFilteredGames(filtered);
  }, [searchQuery, games]);

  // If there are no games, show the empty state
  if (games.length === 0) {
    return (
      <>
        <Subheading>All Games</Subheading>
        <div className="py-2 flex items-center justify-center">
          <EmptyState onCreate={onCreate} />
        </div>
      </>
    );
  }
  // If there are games, show the list of games
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
