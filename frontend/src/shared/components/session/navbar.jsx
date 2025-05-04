import { Branding } from '@components/branding';
import { Navbar, NavbarDivider, NavbarSection } from '@components/navbar';
import { UserIcon } from '@heroicons/react/16/solid';
import { clsx } from 'clsx';

function NavbarItem({ className, children }) {
  return (
    <span
      className={clsx([
        // Basic layout
        'relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 text-zinc-950 dark:text-white',
        // Typography
        'font-black',
        className,
      ])}
    >
      {children}
    </span>
  );
}

export function SessionNavbar({ sessionId, players }) {
  return (
    <Navbar>
      <NavbarItem>
        <Branding />
      </NavbarItem>
      <NavbarDivider />
      <NavbarSection>
        {sessionId && (
          <NavbarItem className="font-nunito font-black leading-none tracking-wider">
            SESSION {sessionId}
          </NavbarItem>
        )}
        {players && (
          <NavbarItem>
            <div className="flex flex-row items-center gap-2">
              <UserIcon className="size-6" />
              {players.length}
            </div>
          </NavbarItem>
        )}
      </NavbarSection>
    </Navbar>
  );
}
