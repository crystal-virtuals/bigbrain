import { Navbar, Sidebar } from '@components/dashboard';
import { StackedLayout } from '@components/stacked-layout';
import { useOutletContext, Outlet } from 'react-router-dom';

export default function GameLayout() {
  const { user, games, updateGame } = useOutletContext(); // get from AdminLayout

  return (
    <StackedLayout
      navbar={<Navbar user={user} />}
      sidebar={<Sidebar user={user} />}
    >
      <Outlet context={{ games, updateGame }} />
    </StackedLayout>
  );
}
