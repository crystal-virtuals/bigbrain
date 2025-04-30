import { Subheading } from '@components/heading';
import { Text } from '@components/text';
import clsx from "clsx";

export function Card({ className, color, children }) {
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
        className,
      )
    }>
      {children}
    </div>
  );
}

export function Section({ title, description, children }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <Subheading>{title}</Subheading>
        <Text className="mt-1">{description}</Text>
      </div>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return (
    <div className="pb-[75%] relative w-full h-full">
      <div className="md:rounded-xl z-1 absolute top-0 left-0 block w-full h-full overflow-hidden rounded-lg">
        {children}
      </div>
    </div>
  );
}
