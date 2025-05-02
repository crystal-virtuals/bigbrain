import {
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from '@components/navbar';
import { Branding } from '@components/branding';
import { NavbarProfileDropdown } from './user-dropdown';
import { actions, navigation } from '@constants/dashboard';
import { useLocation } from 'react-router-dom';

export default function DashboardNavbar({ user }) {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (url) => {
    return path === url || path.startsWith(url);
  };

  const navItems = navigation.map((item) => ({
    ...item,
    current: isActive(item.url),
  }));

  return (
    <Navbar>
      <Branding />
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
