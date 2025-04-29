import { Badge } from '@components/badge';
import { Link } from '@components/link';
import { ClockIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { getNumberOfQuestions, getTotalDuration } from '@utils/game';
import { getInitials, getRandomBgColor, isEmptyString } from '@utils/helpers';
import { useState, useMemo } from 'react';
import GameMenu from './GameMenu';
import clsx from 'clsx';

function GameThumbnail({ game }) {
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

export default function GameCard({ game, onDelete }) {
  return (
    <>
      <li className="col-span-1 rounded-md shadow-xs bg-white ring-1 ring-zinc-950/10 dark:ring-white/10">
        <div className="flex size-full justify-between">
          <GameThumbnail game={game} />
          <div className="flex flex-1 items-center justify-between py-2 truncate">
            <div className="flex flex-col flex-1 px-4 py-3 text-sm truncate">
              {/* Name */}
              <Link to={`/game/${game.id}`} className="font-medium max-w-full truncate" title={game.name}>
                {game.name}
              </Link>
              {/* Number of Questions & Total Duration (as a badge) */}
              <div className="flex items-center gap-x-2 pt-3">
                <Badge color="indigo">
                  <ClockIcon aria-hidden="true" className="size-4"/>
                  {getTotalDuration(game.questions)}
                </Badge>
                <Badge color="fuchsia">
                  <QuestionMarkCircleIcon
                    aria-hidden="true"
                    className="size-4"
                  />
                  {getNumberOfQuestions(game.questions)}
                </Badge>
              </div>
            </div>
            {/* Menu */}
            <GameMenu game={game} onDelete={onDelete} className="shrink-0 ml-2" />
          </div>
        </div>
      </li>
    </>
  );
}
