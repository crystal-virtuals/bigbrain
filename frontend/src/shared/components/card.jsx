import clsx from "clsx";

export function Card({ color, children }) {
  const styles = {
    purple: 'bg-[var(--color-purple-dark)]',
    navy: 'bg-zinc-100 dark:bg-[var(--color-navy-dark)]',
    default: 'bg-zinc-100 dark:bg-zinc-800',
  }

  const bgColor = color ? styles[color] : styles.default;

  return (
    <div className={
      clsx(
        "shadow-xs ring-1 ring-zinc-900/5 sm:rounded-xl md:col-span-2",
        bgColor,
      )
    }>
      {children}
    </div>
  );
}
