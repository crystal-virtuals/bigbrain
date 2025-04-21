import { CreateGameButton, GameCardList } from '@/game/components';
import { Heading } from '@components/heading';
import { SidebarLayout } from '@components/sidebar-layout';
import { useOutletContext } from 'react-router-dom';
import { Navbar, Sidebar } from '@/admin/components';
import { Divider } from '@components/divider';
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

function DashboardHeading({ createGame }) {
  return (
    <div className="flex w-full flex-wrap items-end justify-between gap-4">
      <Heading>Dashboard</Heading>
      <CreateGameButton onCreate={createGame} />
    </div>
  );
}

export default function Dashboard() {
  const { user, games, createGame, deleteGame } = useOutletContext();
  return (
    <DashboardLayout user={user}>
      <DashboardHeading createGame={createGame} />
      <Divider className="my-6" />
      <GameCardList games={games} onDelete={deleteGame} onCreate={createGame}/>
    </DashboardLayout>
  );
}
