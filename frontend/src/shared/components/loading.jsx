import clsx from 'clsx';
import { Heading } from '@components/heading';

export function Spinner({ size = 'md', className }) {
  const styles = {
    xs: ['loading-xs'],
    sm: ['loading-sm'],
    md: ['loading-md'],
    lg: ['loading-lg'],
    xl: ['loading-xl'],
  };

  return (
    <span
      className={clsx(
        'loading loading-spinner text-zinc-950 dark:text-white',
        styles[size],
        className
      )}
    />
  );
}

export function Loading() {
  return (
    <div className={'h-100 flex items-center justify-center gap-4 skeleton'}>
      <Heading>Loading</Heading> <Spinner />
    </div>
  );
}

export function Skeleton({ variant = 'rectangular', className }) {
  if (variant === 'rectangular') {
    return (
      <div
        className={clsx('flex flex-col gap-4 animate-pulse w-full', className)}
      >
        <div className="rounded-xl bg-zinc-200 h-32 w-full"></div>
        <div className="rounded-full bg-zinc-200 h-4 w-28"></div>
        <div className="rounded-full bg-zinc-200 h-4 w-full"></div>
        <div className="rounded-full bg-zinc-200 h-4 w-full"></div>
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={clsx('mx-auto max-w-md w-full rounded-md p-4', className)}
      >
        <div className="flex animate-pulse space-x-4">
          <div className="size-10 rounded-full bg-zinc-200"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 rounded bg-zinc-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-zinc-200"></div>
                <div className="col-span-1 h-2 rounded bg-zinc-200"></div>
              </div>
              <div className="h-2 rounded bg-zinc-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
