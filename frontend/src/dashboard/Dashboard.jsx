import { Games } from '@/dashboard/games';
import { Navbar, Sidebar } from '@components/dashboard';
import { Divider } from '@components/divider';
import { CreateGameButton } from '@components/game';
import { Heading } from '@components/heading';
import { SidebarLayout } from '@components/sidebar-layout';
import { useAuth } from '@hooks/auth';
import { useOutletContext } from 'react-router-dom';

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

function DashboardHeading({ games, createGame }) {
  return (
    <div className="flex w-full flex-wrap items-end justify-between gap-4">
      <Heading>Dashboard</Heading>
      {!!games && <CreateGameButton onCreate={createGame} />}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { games, createGame, deleteGame, startGame } = useOutletContext();

  return (
    <DashboardLayout user={user}>
      <DashboardHeading games={games} createGame={createGame} />
      <Divider className="my-6" />
      <Games games={games} onDelete={deleteGame} startGame={startGame}/>
    </DashboardLayout>
  );
}
