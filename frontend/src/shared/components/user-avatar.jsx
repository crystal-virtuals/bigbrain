import { Avatar } from '@components/avatar';
import { isEmptyString } from '@utils/validation';
import clsx from 'clsx'

const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.toUpperCase();
}

function AvatarDefault( { className } ) {
  return (
    <span className={clsx('inline-block overflow-hidden rounded-full bg-zinc-800 dark:bg-zinc-100 size-10', className)}>
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        className="size-full text-zinc-100 dark:text-zinc-500"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </span>
  );
}

export function UserAvatar({ user, className, ...props }) {
  if (!user) {
    return (
      <AvatarDefault className={className} {...props} />
    );
  }

  const initials = getInitials(user.name);

  // if user has no name, show default avatar
  if (isEmptyString(user.name) || isEmptyString(initials)) {
    return (
      <AvatarDefault className={className} {...props} />
    );
  }

  // Otherwise, show avatar with initials or image
  return (
    <Avatar
      square
      className={clsx(
        user.avatarUrl
          ? ''
          : 'bg-zinc-900 text-white dark:bg-white dark:text-black',
        'size-10', className
      )}
      {...(user.avatarUrl ? { src: user.avatarUrl } : { initials: initials })}
      {...props}
    />
  );
}