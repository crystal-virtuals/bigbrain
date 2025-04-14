import { Heading } from '@components/heading';
import { SidebarLayout } from '@components/sidebar-layout';
import { PlusIcon } from '@heroicons/react/16/solid';
import { FolderOpenIcon, HomeIcon, Square2StackIcon } from '@heroicons/react/20/solid';
import { Navbar, Sidebar } from './components';

const user = {
  name: 'Erika Jayne',
  email: 'erika@example.com',
  avatarUrl: '',
  initials: 'EJ',
};

const actions = [{ label: 'Create Game', url: '#', Icon: PlusIcon }];

const navItems = [
  { label: 'Home', url: '/', Icon: HomeIcon, current: true },
  { label: 'Library', url: '/', Icon: FolderOpenIcon, current: false },
  { label: 'Games', url: '/', Icon: Square2StackIcon, current: false },
];


function DashboardLayout({ children }) {
  return (
    <SidebarLayout
      navbar={<Navbar user={user} actions={actions} navItems={navItems}/>}
      sidebar={<Sidebar user={user} actions={actions} navItems={navItems}/>}
    >
      {children}
    </SidebarLayout>
  );
}

function Dashboard() {
  return (
    <DashboardLayout>
      <Heading>Dashboard</Heading>
    </DashboardLayout>
  );
}

export default Dashboard;
