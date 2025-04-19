import {
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from '@components/navbar';
import { Branding } from '@/dashboard/components';
import { NavbarProfileDropdown } from './dropdown';
import { actions, navigation } from '@/dashboard/constants';

export default function DashboardNavbar({ user }) {
  return (
    <Navbar>
      <Branding />
      <NavbarSection className="max-lg:hidden">
        {/* Navigation items */}
        {navigation.map(({ label, url, current }) => (
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
