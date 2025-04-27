import clsx from "clsx"

export function Spinner({ size='md', className}) {
  const styles = {
    'xs': ['loading-xs'],
    'sm': ['loading-sm'],
    'md': ['loading-md'],
    'lg': ['loading-lg'],
    'xl': ['loading-xl'],
  }

  return (
    <span className={clsx('loading loading-spinner text-zinc-950 dark:text-white', styles[size], className)} />
  )
}
