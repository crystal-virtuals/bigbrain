import { StackedLayout } from '@/components/stacked-layout';
import { Navbar, Sidebar } from './components';
import { useOutletContext } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function GameLayout() {
  const { user, games, createGame, deleteGame } = useOutletContext();

  return (
    <StackedLayout
      navbar={<Navbar user={user} />}
      sidebar={<Sidebar user={user} />}
    >
      {/* Your page content */}
      <Outlet context={{ user, games, createGame, deleteGame }} />
    </StackedLayout>
  );
}

export default GameLayout;
