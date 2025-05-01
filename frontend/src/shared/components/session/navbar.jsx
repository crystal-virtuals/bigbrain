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

export function SessionNavbar({ sessionId, players }) {
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
            {players ? players.length : 0}
          </div>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  );
}
