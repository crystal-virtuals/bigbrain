import { ArrowRightStartOnRectangleIcon, Cog8ToothIcon, UserIcon } from '@heroicons/react/16/solid';
import { HomeIcon } from '@heroicons/react/20/solid';

export const actions = [{ label: 'Logout', url: '/logout', Icon: ArrowRightStartOnRectangleIcon }];

export const navigation = [
  { label: 'Home', url: '/dashboard', Icon: HomeIcon, current: true },
];

export const userNavigation = [
  { label: 'My Profile', url: '/profile', Icon: UserIcon },
  { label: 'Settings', url: '/settings', Icon: Cog8ToothIcon },
  { label: 'Log out', url: '/logout', Icon: ArrowRightStartOnRectangleIcon },
];