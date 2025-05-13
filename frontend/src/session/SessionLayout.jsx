import { Skeleton } from '@components/loading';
import { Layout } from '@components/session/layout';
import { useMemo, useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { SessionNavbar as Navbar } from '@components/session/navbar';
import { sessionAPI } from '@services/api';
import { useInterval } from '@hooks/interval';

function SessionLayout() {
  const { sessionId } = useParams();
  const { games, sessions, setSessions, advanceGame, stopGame, isMutating } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const session = sessions ? sessions[sessionId] : null;

  const game = useMemo(() => {
    if (!games) return null;
    return games.find(
      (g) => g.active == sessionId || g.oldSessions?.includes(sessionId)
    );
  }, [games, sessionId]);

  useEffect(() => {
    if (!session && sessionId) {
      setLoading(true);
      const fetchSession = async () => {
        try {
          const status = await sessionAPI.getStatus(sessionId);
          console.log('Fetched session:', status);
          setSessions((prev) => ({ ...prev, [sessionId]: status }));
        } catch (error) {
          console.error('Failed to fetch session:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchSession();
    }
  }, [sessionId, session]);

  // Poll this specific session every second if active
  useInterval(async () => {
    if (!session || !session.active || isMutating) return;
    const updated = await sessionAPI.getStatus(sessionId);
    setSessions((prev) => ({ ...prev, [sessionId]: updated }));
  }, session?.active ? 1000 : null);

  // Get session status when the session is not active
  useEffect(() => {
    if (!session || session.active) return;
    const fetchSession = async () => {
      const updated = await sessionAPI.getStatus(sessionId);
      setSessions((prev) => ({ ...prev, [sessionId]: updated }));
    };
    fetchSession();
  }, [session]);

  if (loading || !session) {
    return (
      <Layout navbar={<Navbar sessionId={sessionId} />}>
        <div className='flex-1 flex flex-col items-center justify-center h-full'>
          <Skeleton className='max-w-3xl' />
        </div>
      </Layout>
    );
  }

  return (
    <Layout navbar={<Navbar sessionId={sessionId} players={session.players} />}>
      <Outlet context={{ session, game, advanceGame, stopGame, isMutating }} />
    </Layout>
  );
}

export default SessionLayout;
