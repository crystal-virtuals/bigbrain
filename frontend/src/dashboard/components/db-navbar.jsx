import { Link } from '@components/link';
import {
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from '@components/navbar';
import { NavbarProfileDropdown } from './db-profile-dropdown';
import { Logo } from '@components/logo';

export function DashboardNavbar({ user, actions, navItems }) {
  return (
    <Navbar>
      <Link to="/" aria-label="Home">
        <Logo className="px-2" />
      </Link>
      <NavbarSection className="max-lg:hidden">
        {/* Navigation items */}
        {navItems.map(({ label, url, current }) => (
          <NavbarItem key={label} href={url} current={current}>
            {label}
          </NavbarItem>
        ))}
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        {/* Action buttons */}
        {actions.map(({ label, url, Icon }) => (
          <NavbarItem key={label} href={url} aria-label={label}>
            <Icon />
            <NavbarLabel className="hidden sm:block">{label}</NavbarLabel>
          </NavbarItem>
        ))}
        {/* Profile dropdown */}
        <NavbarProfileDropdown user={user} />
      </NavbarSection>
    </Navbar>
  );
}
