import { Skeleton } from '@components/loading';
import { Layout } from '@components/session/layout';
import { isNullOrUndefined } from '@utils/helpers';
import { useMemo } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { SessionNavbar as Navbar } from '@components/session/navbar';

function SessionLayout() {
  const { sessionId } = useParams();
  const { games, sessions } = useOutletContext();

  const session = useMemo(() => {
    if (!sessions) return null;
    return sessions[sessionId] || null;
  }, [sessions, sessionId]);

  const game = useMemo(() => {
    if (!games) return null;
    return games.find(g => g.active == sessionId || g.oldSessions?.includes(sessionId));
  }, [games, sessionId]);

  // wait for session and game to be set
  if (session === null || game === null) return null;

  return (
    <Layout navbar={<Navbar sessionId={sessionId} players={session.players || []} />}>
      {isNullOrUndefined(session) || isNullOrUndefined(game) ? (
        <Skeleton className="col-span-2 max-w-2xl" />
      ) : (
        <Outlet context={{ session, game }} />
      )}
    </Layout>
  );
}

export default SessionLayout;
