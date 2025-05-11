import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

/***************************************************************
                            List
***************************************************************/

export function List({ children, className, ...props }) {
  const classes = clsx('list-inside space-y-2 py-2', className);

  return (
    <ul className={classes} {...props}>
      {children}
    </ul>
  );
}

export function ListItem({ children, className, ...props }) {
  const classes = clsx('text-gray-950 dark:text-white', className);
  return (
    <li className={classes} {...props}>
      {children}
    </li>
  );
}

export function ListItemIcon({ type, children }) {
  const styles = {
    base: 'relative flex size-5.5 items-center justify-center rounded-full',
    color: {
      error:
        'bg-rose-500/25 text-rose-800 inset-ring inset-ring-rose-700/25 dark:text-rose-400',
      success:
        'bg-teal-500/25 text-teal-800 inset-ring inset-ring-teal-600/25 dark:text-teal-400',
      info: 'bg-cyan-500/25 text-cyan-800 inset-ring inset-ring-cyan-600/25 dark:text-cyan-400',
    },
    icon: {
      error: 'overflow-visible size-3.5 fill-current',
      success: 'overflow-visible size-3.5 fill-current',
      info: 'overflow-visible size-7 fill-none stroke-1 stroke-current',
    },
  };

  const Icon = {
    error: XMarkIcon,
    success: CheckIcon,
    info: InformationCircleIcon,
  }[type];

  return (
    <li className="flex items-start space-x-4">
      <div className={clsx(styles.base, styles.color[type])}>
        <Icon className={clsx(styles.icon[type])} />
      </div>
      <p className="m-0 flex-1 text-sm text-gray-950 dark:text-white">
        {children}
      </p>
    </li>
  );
}

/***************************************************************
                       Numbered List
***************************************************************/
export function NumberedList({ children, className, ...props }) {
  const classes = clsx('list-none space-y-2 py-2', className);

  return (
    <ol className={classes} {...props}>
      {children}
    </ol>
  );
}


export function NumberedListItem({
  number,
  color,
  children,
  className,
  ...props
}) {
  const styles = {
    base: [
      'relative flex size-5.5 items-center justify-center rounded-full font-mono text-sm',
    ],
    colors: {
      dark: [
        'bg-zinc-900 text-white',
        'dark:bg-white dark:text-zinc-950'
      ],
      light: [
        'bg-white text-zinc-950',
        'dark:text-white dark:bg-zinc-900'
      ],
      indigo: [
        'bg-indigo-500 text-white',
        'hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500',
      ],
      cyan: [
        'bg-cyan-300 text-white',
        'hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300',
      ],
      red: [
        'bg-red-600 text-white',
        'hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600',
      ],
      orange: [
        'bg-orange-500 text-white',
        'hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500',
      ],
      amber: [
        'bg-amber-400 text-amber-950',
        'hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400',
      ],
      yellow: [
        'bg-yellow-300 text-yellow-950',
        'hover:bg-yellow-400 dark:bg-yellow-400 dark:hover:bg-yellow-300',
      ],
      lime: [
        'bg-lime-300 text-lime-950',
        'hover:bg-lime-400 dark:bg-lime-400 dark:hover:bg-lime-300',
      ],
      green: [
        'bg-green-600 text-white',
        'hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600',
      ],
      emerald: [
        'bg-emerald-600 text-white',
        'hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600',
      ],
      teal: [
        'bg-teal-600 text-white',
        'hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600',
      ],
      sky: [
        'bg-sky-500 text-white',
        'hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500',
      ],
      blue: [
        'bg-blue-600 text-white',
        'hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600',
      ],
      violet: [
        'bg-violet-500 text-white',
        'hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-500',
      ],
      purple: [
        'bg-purple-500 text-white',
        'hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500',
      ],
      fuchsia: [
        'bg-fuchsia-500 text-white',
        'hover:bg-fuchsia-600 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500',
      ],
      pink: [
        'bg-pink-500 text-white',
        'hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-500',
      ],
      rose: [
        'bg-rose-500 text-white',
        'hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500',
      ],
    },
  };

  return (
    <li className={clsx('flex items-start space-x-4', className)} {...props}>
      <div className={clsx(styles.base, styles.colors[color ?? 'dark'])}>
        <span className='overflow-visible size-5.5 flex items-center justify-center'>{number}</span>
      </div>
      <p className="m-0 text-sm text-gray-950 dark:text-white">
        {children}
      </p>
    </li>
  );
}