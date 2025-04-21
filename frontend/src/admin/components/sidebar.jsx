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
import { Cog6ToothIcon, QuestionMarkCircleIcon, SparklesIcon } from '@heroicons/react/20/solid';
import { SidebarProfileDropdown } from './dropdown';
import { actions, navigation } from '@/admin/constants';
import { Branding } from '@components/branding';

export default function DashboardSidebar({ user }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <Branding />
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          {/* Navigation items */}
          {navigation.map(({ label, url, Icon, current }) => (
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
