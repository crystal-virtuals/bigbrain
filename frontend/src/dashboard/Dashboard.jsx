import { SidebarLayout } from '@components/sidebar-layout';
import { useAuth } from '@hooks/auth';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from './components';

/**
 * A dashboard of all games is displayed, where each game shows:
 * (1) the title,
 * (2) number of questions it contains,
 * (3) a thumbnail, and
 * (4) a total duration to complete (sum of each individual question's duration).
 *
 * Each game listed should have a clickable UI component relating to it
 * that takes user to the screen to edit that particular game. E.G. /game/{game_id}
 *
 * A button exists on this screen which brings up a UI component that allows user to create a new game, provide a name for the game.
 * After a new game is created, it must be added to the dashboard immediately without a refresh.
 *
 * A button exists on this screen that brings up a UI component to allow user to delete a particular game.
 */
function DashboardLayout({ children }) {
  const { user } = useAuth();
  return (
    <SidebarLayout
      navbar={<Navbar user={user} />}
      sidebar={<Sidebar user={user} />}
    >
      {children}
    </SidebarLayout>
  );
}


function Dashboard() {
  // fetch games on load?
  return (
    <DashboardLayout>
      {/* This is where the nested routes will be rendered */}
      <Outlet />
    </DashboardLayout>
  );
}

export default Dashboard;
