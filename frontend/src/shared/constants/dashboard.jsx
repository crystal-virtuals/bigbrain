import { ArrowRightStartOnRectangleIcon, Cog8ToothIcon, PlusIcon, UserIcon } from '@heroicons/react/16/solid';
import { FolderOpenIcon, HomeIcon, Square2StackIcon } from '@heroicons/react/20/solid';

export const actions = [{ label: 'Create Game', url: '#', Icon: PlusIcon }];

export const navigation = [
  { label: 'Home', url: '/home', Icon: HomeIcon, current: true },
  { label: 'Library', url: '/', Icon: FolderOpenIcon, current: false },
  { label: 'Games', url: '/', Icon: Square2StackIcon, current: false },
];

export const userNavigation = [
  { label: 'My Profile', url: '/my-profile', Icon: UserIcon },
  { label: 'Settings', url: '/settings', Icon: Cog8ToothIcon },
  { label: 'Log out', url: '/logout', Icon: ArrowRightStartOnRectangleIcon },
];