import clsx from 'clsx'

export function Heading({ className, level = 1, ...props }) {
  let Element = `h${level}`

  return (
    <Element
      {...props}
      className={clsx('text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white', className)}
    />
  )
}

export function Subheading({ className, level = 2, ...props }) {
  let Element = `h${level}`

  return (
    <Element
      {...props}
      className={clsx('text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white', className)}
    />
  )
}

export function Header({ title }) {
  return (
    <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
      <Heading>{title}</Heading>
    </div>
  );
}
