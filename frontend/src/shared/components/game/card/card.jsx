import { PresenceIndicator } from '@components/avatar';
import { TextLink } from '@components/text';
import { clsx } from 'clsx';

export function Card({ active, children, ...props }) {
  const { className, ...rest } = props;

  let classes = clsx(
    className,
    'relative rounded-xl p-1 flex flex-col gap-4 h-full',
    active && 'bg-active/5 outline-2 outline-active/50',
  )

  return (
    <div className={classes} {...rest}>
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

export function CardBody({ children }) {
  return (
    <div className="rounded-b-xl flex flex-col w-full space-y-0.5 bg-transparent">
      {children}
    </div>
  )
}

export function CardIndicator({ active }) {
  if (!active) return null;

  return (
    <div className="z-10 absolute -top-2 -right-2">
      <PresenceIndicator color="active" size="md" />
    </div>
  );
}

export function CardBadge({ children }) {
  return (
    <div className="text-white text-xs md:text-sm rounded-br-lg z-1 absolute left-0 top-0 p-3 leading-none font-bold bg-active select-none">
      <span className="md:inline-block hidden pl-1">{children}</span>
    </div>
  );
}

export function Link({ to, disabled, children }) {
  const styles = {
    base: 'line-clamp-2 font-bold pb-1 hover:underline',
    disabled: 'pointer-events-none hover:no-underline',
  };
  const classes = clsx(
    styles.base,
    disabled && styles.disabled,
  );

  return (
    <TextLink to={to} disabled={disabled} className={classes}>
      {children}
    </TextLink>
  );
}
