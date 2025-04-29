import { Branding } from '@components/branding';
import { Link } from '@components/link';
import { Navbar, NavbarDivider, NavbarSection } from '@components/navbar';
import { UserIcon } from '@heroicons/react/16/solid';
import { clsx } from 'clsx';

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

function NavbarComponent({ sessionId = 123456, numberOfPlayers = 0 }) {
  return (
    <Navbar>
      <Link to="/" aria-label="Home">
        <Branding className="px-2" />
      </Link>
      <NavbarDivider />
      <NavbarSection>
        <NavbarItem>SESSION {sessionId}</NavbarItem>
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

function SessionLayout({ children }) {
  return (
    <div className="flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Navbar */}
      <header className="flex items-center px-4">
        <div className="min-w-0 flex-1">
          <NavbarComponent />
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

export default SessionLayout;
