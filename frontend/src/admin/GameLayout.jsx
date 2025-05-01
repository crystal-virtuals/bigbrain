import { Navbar, Sidebar } from '@components/dashboard';
import { StackedLayout } from '@components/stacked-layout';
import { useOutletContext, useParams, Outlet } from 'react-router-dom';
import { useMemo } from 'react';
import { isEqual } from '@utils/game';
import { Skeleton } from '@components/loading';
import { isNullOrUndefined } from '@utils/helpers';

export default function GameLayout() {
  const { gameId } = useParams();
  const { user, games, updateGame } = useOutletContext(); // get from AdminLayout

  const game = useMemo(() => {
    if (!games) return null;
    return games.find((game) => isEqual(game, gameId));
  }, [games, gameId]);

  return (
    <StackedLayout
      navbar={<Navbar user={user} />}
      sidebar={<Sidebar user={user} />}
    >
      {isNullOrUndefined(game) ? (
        <Skeleton />
      ) : (
        <Outlet context={{ game, updateGame }} />
      )}
    </StackedLayout>
  );
}
