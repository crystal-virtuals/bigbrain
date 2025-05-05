import { Skeleton } from '@components/loading';
import { Layout } from '@components/session/layout';
import { useMemo, useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { SessionNavbar as Navbar } from '@components/session/navbar';
import { sessionAPI } from '@services/api';

function SessionLayout() {
  const { sessionId } = useParams();
  const { games, sessions, setSessions, advanceGame, stopGame } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const session = sessions ? sessions[sessionId] : null;

  const game = useMemo(() => {
    if (!games) return null;
    return games.find(g => g.active == sessionId || g.oldSessions?.includes(sessionId));
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
  if (loading || !session || !game || !sessionId) {
    return (
      <div className="py-12 flex justify-center flex-col items-center">
        <Skeleton className="col-span-2 max-w-2xl" />;
      </div>
    )
  }

  return (
    <Layout navbar={<Navbar sessionId={sessionId} players={session.players} />}>
      <Outlet context={{ session, game, advanceGame, stopGame}} />
    </Layout>
  );
}

export default SessionLayout;
