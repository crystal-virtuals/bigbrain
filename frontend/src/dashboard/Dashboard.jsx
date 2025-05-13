import { Games } from '@/dashboard/games';
import { Navbar, Sidebar } from '@components/dashboard';
import { Divider } from '@components/divider';
import { CreateGameButton } from '@components/game';
import { Heading } from '@components/heading';
import { SidebarLayout } from '@components/sidebar-layout';
import { useAuth } from '@hooks/auth';
import { useOutletContext } from 'react-router-dom';
import { Skeleton } from '@components/loading';

function DashboardLayout({ user, children }) {
  return (
    <SidebarLayout
      navbar={<Navbar user={user} />}
      sidebar={<Sidebar user={user} />}
    >
      <div className="container mx-auto mt-6">{children}</div>
    </SidebarLayout>
  );
}

function DashboardHeading({ loading, games, onCreate }) {
  return (
    <div className="flex w-full flex-wrap items-end justify-between gap-4">
      <Heading>Dashboard</Heading>
      {!!games && <CreateGameButton onCreate={onCreate} disabled={loading}/>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { loading, games, createGame, deleteGame } = useOutletContext();

  return (
    <DashboardLayout user={user}>
      <DashboardHeading games={games} onCreate={createGame} />
      <Divider className="my-6" />
      {loading ? (
        <Skeleton />
      ) : (
        <Games games={games} onDelete={deleteGame} onCreate={createGame}/>
      )}
    </DashboardLayout>
  );
}
