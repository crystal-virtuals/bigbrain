import { Dropdown, DropdownButton, DropdownItem, DropdownMenu, DropdownLabel } from '@components/dropdown';
import { NavbarItem } from '@components/navbar';
import { SidebarItem } from '@components/sidebar';
import { UserAvatar } from '@components/user-avatar';
import { ChevronUpIcon } from '@heroicons/react/16/solid';
import { ArrowRightStartOnRectangleIcon, Cog8ToothIcon, UserIcon } from '@heroicons/react/16/solid';

const userNavItems = [
  { label: 'My Profile', url: '/my-profile', Icon: UserIcon },
  { label: 'Settings', url: '/settings', Icon: Cog8ToothIcon },
  { label: 'Log out', url: '/logout', Icon: ArrowRightStartOnRectangleIcon },
];

function ProfileDropdownMenu() {
  return (
    <DropdownMenu className="min-w-64">
      {userNavItems.map(({ label, url, Icon }) => (
        <DropdownItem key={label} href={url}>
          <Icon />
          <DropdownLabel>{label}</DropdownLabel>
        </DropdownItem>
      ))}
    </DropdownMenu>
  );
}

export function NavbarProfileDropdown({ user }) {
  return (
    <Dropdown>
      <DropdownButton as={NavbarItem} aria-label="Account menu">
        <UserAvatar user={user}/>
      </DropdownButton>
      <ProfileDropdownMenu anchor="bottom end" />
    </Dropdown>
  );
}

export function SidebarProfileDropdown({ user }) {
  return (
    <Dropdown>
      <DropdownButton as={SidebarItem}>
        <span className="flex min-w-0 items-center gap-3">
          <UserAvatar user={user} />
          <span className="min-w-0">
            <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
              {user.name}
            </span>
            <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
              {user.email}
            </span>
          </span>
        </span>
        <ChevronUpIcon />
      </DropdownButton>
      <ProfileDropdownMenu anchor="top start" navItems={userNavItems} />
    </Dropdown>
  );
}