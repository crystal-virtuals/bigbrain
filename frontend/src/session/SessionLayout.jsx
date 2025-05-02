import { Skeleton } from '@components/loading';
import { Layout } from '@components/session/layout';
import { isNullOrUndefined } from '@utils/helpers';
import { useMemo, useEffect } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { SessionNavbar as Navbar } from '@components/session/navbar';
import { sessionAPI } from '@services/api';

function SessionLayout() {
  const { sessionId } = useParams();
  const { games, sessions, setSessions, advanceGame, stopGame } = useOutletContext();

  const session = useMemo(() => {
    if (!sessions) return null;
    return sessions[sessionId] || null;
  }, [sessions, sessionId]);

  const game = useMemo(() => {
    if (!games) return null;
    return games.find(g => g.active == sessionId || g.oldSessions?.includes(sessionId));
  }, [games, sessionId]);

  // Poll this specific session every second if active
  useEffect(() => {
    if (!session || !session.active) return;

    const interval = setInterval(async () => {
      try {
        const updated = await sessionAPI.getStatus(sessionId);
        setSessions((prev) => ({ ...prev, [sessionId]: updated }));
        console.log('Updated session:', updated);
      } catch (err) {
        console.warn(`Failed to poll session ${sessionId}:`, err);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionId, session?.active]);

  // wait for session and game to be set
  if (session === null || game === null) return null;

  return (
    <Layout navbar={<Navbar sessionId={sessionId} players={session.players || []} />}>
      {isNullOrUndefined(session) || isNullOrUndefined(game) ? (
        <Skeleton className="col-span-2 max-w-2xl" />
      ) : (
        <Outlet context={{ session, game, advanceGame, stopGame}} />
      )}
    </Layout>
  );
}

export default SessionLayout;
