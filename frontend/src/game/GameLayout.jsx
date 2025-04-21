import { StackedLayout } from '@components/stacked-layout';
import { Navbar, Sidebar } from '@/admin/components';
import { useAuth } from '@hooks/auth';

function GameLayout( {children} ) {
  const { user } = useAuth();
  return (
    <StackedLayout
      navbar={<Navbar user={user} />}
      sidebar={<Sidebar user={user} />}
    >
      {/* Your page content */}
      {children}
    </StackedLayout>
  );
}

export default GameLayout;
