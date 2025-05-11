import clsx from 'clsx';

export function Maths({ children, className, ...props }) {
  const classes = clsx(
    'font-mono text-zinc-950 dark:text-white',
    'bg-fuchsia-500/10 dark:bg-fuchsia-800/50 rounded-lg px-1 py-0.5',
    'base/6 sm:text-sm/6',
    className,
  );
  return (
    <span className={classes} {...props}>
      { children }
    </span>
  );
}