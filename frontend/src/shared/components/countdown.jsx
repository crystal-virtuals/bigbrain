import { isNullish } from '@utils/validation';
import clsx from 'clsx';

function CountdownDigit({ label, value, size, box, className, ...props }) {
  const counter = `${value} ${label}`;
  const sizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  }[size ?? '2xl'];

  const styles = {
    base: ['flex flex-col'],
    box: [
      'p-2 rounded-lg bg-black text-white dark:bg-white/10 dark:text-black',
    ],
  };

  return (
    <div className={clsx(className, styles.base, box && styles.box)} {...props}>
      <span className={clsx(sizeClass, 'font-mono')}>
        <span aria-live="polite" aria-label={counter}>
          {`${value % 60}`.padStart(2, 0)}
        </span>
      </span>
      {label}
    </div>
  );
}

function CountdownLabel({ className, ...props }) {
  const { days, hours, minutes, seconds } = props;
  const items = [
    { label: 'days', value: days },
    { label: 'hours', value: hours },
    { label: 'min', value: minutes },
    { label: 'sec', value: seconds },
  ].filter((item) => !isNullish(item.value));

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      {items.map((item, index) => (
        <CountdownDigit
          key={index}
          label={item.label}
          value={item.value}
          className={className}
        />
      ))}
    </div>
  );
}

export function Countdown({ time, duration }) {
  const classes = clsx(
    'flex flex-row justify-center items-center w-full px-4 space-x-5 h-10',
    'text-sm font-medium whitespace-nowrap flex-shrink-0'
  );

  const timesUp = time <= 0;
  const seconds = Math.max(0, time);

  return (
    <div className={classes}>
      {timesUp ? (
        <span className="text-error">Time&apos;s up!</span>
      ) : (
        <CountdownLabel
          className='text-info'
          seconds={seconds}
        />
      )}
      <progress
        className={clsx(
          'progress w-full',
          timesUp ? 'progress-error' : 'progress-info'
        )}
        value={seconds}
        max={duration}
      />
    </div>
  );
}
