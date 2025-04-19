import { getInitials, getRandomBgColor, isEmptyString } from '@utils/helpers';
import { useState, useMemo } from 'react';
import clsx from 'clsx';

export default function GameThumbnail({ game }) {
  const [error, setError] = useState(false);
  const imgError = error || isEmptyString(game.thumbnail);
  const bgcolor = useMemo(() => getRandomBgColor(game.id), []);

  if (imgError) {
    return (
      <div
        className={clsx(
          bgcolor,
          'flex height-100 w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white truncate',
        )}
      >
        {getInitials(game.name)}
      </div>
    );
  }

  return (
    <img
      src={game.thumbnail}
      alt={game.name}
      className="w-16 rounded-l-md shrink-0 object-cover"
      onError={() => setError(true)}
    />
  );
}