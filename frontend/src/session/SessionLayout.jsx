import { Branding } from '@components/branding';
import { Link } from '@components/link';
import { Skeleton } from '@components/loading';
import { Navbar, NavbarDivider, NavbarSection } from '@components/navbar';
import { UserIcon } from '@heroicons/react/16/solid';
import { NotFound } from '@pages/errors';
import { isNullOrUndefined } from '@utils/helpers';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

function NavbarItem({ children }) {
  return (
    <span
      className={clsx([
        // Basic layout
        'relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 text-zinc-950 dark:text-white',
        // Typography
        'font-nunito font-black leading-none tracking-wider',
      ])}
    >
      {children}
    </span>
  );
}

function NavbarComponent({ sessionId, numberOfPlayers = 0 }) {
  return (
    <Navbar>
      <Link to="/" aria-label="Home">
        <Branding className="px-2" />
      </Link>
      <NavbarDivider />
      <NavbarSection>
        {sessionId && <NavbarItem>SESSION {sessionId}</NavbarItem>}
        <NavbarItem>
          <div className="flex flex-row items-center gap-2">
            <UserIcon className="size-6" />
            {numberOfPlayers}
          </div>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  );
}

function Layout( { sessionId, children }) {
  return (
    <div className="flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Navbar */}
      <header className="flex items-center px-4">
        <div className="min-w-0 flex-1">
          <NavbarComponent sessionId={sessionId}/>
        </div>
      </header>
      {/* Content */}
      <main className="flex min-h-dvh flex-col p-2">
        <div className="flex grow items-center justify-center p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          {children}
        </div>
      </main>
    </div>
  );
}

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


  // If session or game is not found, redirect to NotFound page
  if (!sessions || !games || !session || !game) {
    return <NotFound />;
  }

  return (
    <Layout sessionId={sessionId}>
      {isNullOrUndefined(session) || isNullOrUndefined(game) ? (
        <Skeleton className="col-span-2 max-w-2xl" />
      ) : (
        <Outlet context={{ session, game }} />
      )}
    </Layout>
  );
}

export default SessionLayout;
