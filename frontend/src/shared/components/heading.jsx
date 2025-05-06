import clsx from 'clsx'

export function Heading({ className, level = 1, ...props }) {
  let Element = `h${level}`
  let { light } = props;
  let classes = clsx(
    className,
    'text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8',
    !light && 'dark:text-white',
  )

  return (
    <Element
      {...props}
      className={classes}
    />
  )
}


export function HeadingLight({ className, level = 1, ...props }) {
  let Element = `h${level}`
  let classes = clsx(
    className,
    'text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8',
  )

  return (
    <Element
      {...props}
      className={classes}
    />
  )
}

export function Subheading({ className, level = 2, ...props }) {
  let Element = `h${level}`

  return (
    <Element
      {...props}
      className={clsx(className, 'text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white')}
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

export function HeadingBorder({ children, ...props }) {
  const { className, color, size, ...rest } = props;

  const styles = [
    'font-nunito font-black leading-none text-center tracking-widest',
    color ? `text-${color} dark:text-${color}` : 'text-green dark:text-green',
    size ? size : 'text-4xl lg:text-5xl xl:text-6xl',
  ]

  return (
    <h1 className={clsx(className, styles)} {...rest}>
      <div className="relative inline-block">
        <div className="px-0 z-3 relative top-0 left-0">
          {children}
        </div>
        <div
          className="px-0 z-2 absolute top-0 left-0 text-transparent pointer-events-none select-none"
          style={{ WebkitTextStroke: '0.166667em rgb(0, 0, 0)' }}
        >
          {children}
        </div>
        <div
          className="px-0 top-px z-1 absolute left-0 text-transparent pointer-events-none select-none"
          style={{ WebkitTextStroke: '0.166667em rgb(0, 0, 0)' }}
        >
          {children}
        </div>
      </div>
    </h1>
  );
}