import { Link } from '@components/link';
import { Logo } from '@components/logo';
import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@components/sidebar';
import { ThemeController } from '@components/theme-controller';
import { Cog6ToothIcon, QuestionMarkCircleIcon, SparklesIcon } from '@heroicons/react/20/solid';
import { SidebarProfileDropdown } from './db-profile-dropdown';

export function DashboardSidebar({ user, actions, navItems }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" aria-label="Home">
          <Logo className="px-1" />
        </Link>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          {/* Navigation items */}
          {navItems.map(({ label, url, Icon, current }) => (
            <SidebarItem key={label} href={url} current={current}>
              <Icon />
              <SidebarLabel>{label}</SidebarLabel>
            </SidebarItem>
          ))}
        </SidebarSection>
        <SidebarDivider />
        <SidebarSection>
          <SidebarHeading>Start Here</SidebarHeading>
          {/* Action buttons */}
          {actions.map(({ label, url, Icon }) => (
            <SidebarItem key={label} href={url} aria-label={label}>
              <Icon />
              <SidebarLabel className="hidden md:block">{label}</SidebarLabel>
            </SidebarItem>
          ))}
        </SidebarSection>
        <SidebarSpacer />
        <SidebarSection>
          <SidebarItem>
            <ThemeController className=""/>
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/settings">
            <Cog6ToothIcon />
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/support">
            <QuestionMarkCircleIcon />
            <SidebarLabel>Support</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/changelog">
            <SparklesIcon />
            <SidebarLabel>Changelog</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        {/* Profile dropdown */}
        <SidebarProfileDropdown user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
