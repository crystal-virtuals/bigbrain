import { Layout } from '@components/session/layout';
import { SessionNavbar as Navbar } from '@components/session/navbar';
import { Outlet, useParams } from "react-router-dom";

export default function PlayerLayout() {
  const { playerId, sessionId } = useParams();

  if (playerId && sessionId) {
    return (
      <Layout navbar={<Navbar sessionId={sessionId} />}>
        <Outlet />
      </Layout>
    );
  }

  return <Outlet />;
}