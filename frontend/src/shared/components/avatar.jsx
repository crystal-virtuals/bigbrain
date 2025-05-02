import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { forwardRef } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'


export function Avatar({ src = null, square = false, initials, alt = '', className, ...props }) {
  return (
    <span
      data-slot="avatar"
      {...props}
      className={clsx(
        className,
        // Basic layout
        'inline-grid shrink-0 align-middle [--avatar-radius:20%] *:col-start-1 *:row-start-1',
        'outline -outline-offset-1 outline-black/10 dark:outline-white/10',
        // Border radius
        square ? 'rounded-(--avatar-radius) *:rounded-(--avatar-radius)' : 'rounded-full *:rounded-full'
      )}
    >
      {initials && (
        <svg
          className="size-full fill-current p-[5%] text-[48px] font-medium uppercase select-none"
          viewBox="0 0 100 100"
          aria-hidden={alt ? undefined : 'true'}
        >
          {alt && <title>{alt}</title>}
          <text x="50%" y="50%" alignmentBaseline="middle" dominantBaseline="middle" textAnchor="middle" dy=".125em">
            {initials}
          </text>
        </svg>
      )}
      {src && <img className="size-full" src={src} alt={alt} />}
    </span>
  )
}

export const AvatarButton = forwardRef(function AvatarButton(
  { src, square = false, initials, alt, className, ...props },
  ref
) {
  let classes = clsx(
    className,
    square ? 'rounded-[20%]' : 'rounded-full',
    'relative inline-grid focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500'
  )

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar src={src} square={square} initials={initials} alt={alt} />
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar src={src} square={square} initials={initials} alt={alt} />
      </TouchTarget>
    </Headless.Button>
  )
})

export function PresenceIndicator({ color = 'active', size = 'md' }) {
  const colors = {
    active: { level1: 'bg-emerald-400', level2: 'bg-emerald-500' },
    red: { level1: 'bg-red-400', level2: 'bg-red-500' },
    blue: { level1: 'bg-blue-400', level2: 'bg-blue-500' },
  };

  const fallback = { level1: 'bg-emerald-400', level2: 'bg-emerald-500' };
  const { level1, level2 } = colors[color] || fallback;

  const sizeClass = {
    xs: 'size-3',
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
    xl: 'size-7',
    '2xl': 'size-8',
  }[size] || 'size-5';

  return (
    <span className={clsx('relative flex', sizeClass)}>
      <span className={clsx('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', level1)} />
      <span className={clsx('relative inline-flex rounded-full', level2, sizeClass)} />
    </span>
  );
}
