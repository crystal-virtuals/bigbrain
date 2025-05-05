import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/16/solid';

export function CheckboxGroup({ className, ...props }) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Basic groups
        'space-y-3',
        // With descriptions
        'has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium'
      )}
    />
  );
}

export function CheckboxField({ className, ...props }) {
  return (
    <Headless.Field
      data-slot="field"
      {...props}
      className={clsx(
        className,
        // Base layout
        'grid grid-cols-[1.125rem_1fr] gap-x-4 gap-y-1 sm:grid-cols-[1rem_1fr]',
        // Control layout
        '*:data-[slot=control]:col-start-1 *:data-[slot=control]:row-start-1 *:data-[slot=control]:mt-0.75 sm:*:data-[slot=control]:mt-1',
        // Label layout
        '*:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1',
        // Description layout
        '*:data-[slot=description]:col-start-2 *:data-[slot=description]:row-start-2',
        // With description
        'has-data-[slot=description]:**:data-[slot=label]:font-medium'
      )}
    />
  );
}

const base = [
  // Basic layout
  'relative isolate flex size-[1.125rem] items-center justify-center rounded-[0.3125rem] sm:size-4',
  // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
  'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(0.3125rem-1px)] before:bg-white before:shadow-sm',
  // Background color when checked
  'group-data-checked:before:bg-(--checkbox-checked-bg)',
  // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
  'dark:before:hidden',
  // Background color applied to control in dark mode
  'dark:bg-white/5 dark:group-data-checked:bg-(--checkbox-checked-bg)',
  // Border
  'border border-zinc-950/15 group-data-checked:border-transparent group-data-hover:group-data-checked:border-transparent group-data-hover:border-zinc-950/30 group-data-checked:bg-(--checkbox-checked-border)',
  'dark:border-white/15 dark:group-data-checked:border-white/5 dark:group-data-hover:group-data-checked:border-white/5 dark:group-data-hover:border-white/30',
  // Inner highlight shadow
  'after:absolute after:inset-0 after:rounded-[calc(0.3125rem-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)]',
  'dark:after:-inset-px dark:after:hidden dark:after:rounded-[0.3125rem] dark:group-data-checked:after:block',
  // Focus ring
  'group-data-focus:outline group-data-focus:outline-2 group-data-focus:outline-offset-2 group-data-focus:outline-blue-500',
  // Disabled state
  'group-data-disabled:opacity-50',
  'group-data-disabled:border-zinc-950/25 group-data-disabled:bg-zinc-950/5 group-data-disabled:[--checkbox-check:var(--color-zinc-950)]/50 group-data-disabled:before:bg-transparent',
  'dark:group-data-disabled:border-white/20 dark:group-data-disabled:bg-white/[2.5%] dark:group-data-disabled:[--checkbox-check:var(--color-white)]/50 dark:group-data-checked:group-data-disabled:after:hidden',
  // Forced colors mode
  'forced-colors:[--checkbox-check:HighlightText] forced-colors:[--checkbox-checked-bg:Highlight] forced-colors:group-data-disabled:[--checkbox-check:Highlight]',
  'dark:forced-colors:[--checkbox-check:HighlightText] dark:forced-colors:[--checkbox-checked-bg:Highlight] dark:forced-colors:group-data-disabled:[--checkbox-check:Highlight]',
];

const colors = {
  'dark/zinc': [
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-900)] [--checkbox-checked-border:var(--color-zinc-950)]/90',
    'dark:[--checkbox-checked-bg:var(--color-zinc-600)]',
  ],
  'dark/white': [
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-900)] [--checkbox-checked-border:var(--color-zinc-950)]/90',
    'dark:[--checkbox-check:var(--color-zinc-900)] dark:[--checkbox-checked-bg:var(--color-white)] dark:[--checkbox-checked-border:var(--color-zinc-950)]/15',
  ],
  white:
    '[--checkbox-check:var(--color-zinc-900)] [--checkbox-checked-bg:var(--color-white)] [--checkbox-checked-border:var(--color-zinc-950)]/15',
  dark: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-900)] [--checkbox-checked-border:var(--color-zinc-950)]/90',
  zinc: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-600)] [--checkbox-checked-border:var(--color-zinc-700)]/90',
  red: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-red-600)] [--checkbox-checked-border:var(--color-red-700)]/90',
  orange:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-orange-500)] [--checkbox-checked-border:var(--color-orange-600)]/90',
  amber:
    '[--checkbox-check:var(--color-amber-950)] [--checkbox-checked-bg:var(--color-amber-400)] [--checkbox-checked-border:var(--color-amber-500)]/80',
  yellow:
    '[--checkbox-check:var(--color-yellow-950)] [--checkbox-checked-bg:var(--color-yellow-300)] [--checkbox-checked-border:var(--color-yellow-400)]/80',
  lime: '[--checkbox-check:var(--color-lime-950)] [--checkbox-checked-bg:var(--color-lime-300)] [--checkbox-checked-border:var(--color-lime-400)]/80',
  green:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-green-600)] [--checkbox-checked-border:var(--color-green-700)]/90',
  emerald:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-emerald-600)] [--checkbox-checked-border:var(--color-emerald-700)]/90',
  teal: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-teal-600)] [--checkbox-checked-border:var(--color-teal-700)]/90',
  cyan: '[--checkbox-check:var(--color-cyan-950)] [--checkbox-checked-bg:var(--color-cyan-300)] [--checkbox-checked-border:var(--color-cyan-400)]/80',
  sky: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-sky-500)] [--checkbox-checked-border:var(--color-sky-600)]/80',
  blue: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-blue-600)] [--checkbox-checked-border:var(--color-blue-700)]/90',
  indigo:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-indigo-500)] [--checkbox-checked-border:var(--color-indigo-600)]/90',
  violet:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-violet-500)] [--checkbox-checked-border:var(--color-violet-600)]/90',
  purple:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-purple-500)] [--checkbox-checked-border:var(--color-purple-600)]/90',
  fuchsia:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-fuchsia-500)] [--checkbox-checked-border:var(--color-fuchsia-600)]/90',
  pink: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-pink-500)] [--checkbox-checked-border:var(--color-pink-600)]/90',
  rose: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-rose-500)] [--checkbox-checked-border:var(--color-rose-600)]/90',
};

export function Checkbox({ color = 'dark/zinc', className, ...props }) {
  return (
    <Headless.Checkbox
      data-slot="control"
      {...props}
      className={clsx(className, 'group inline-flex focus:outline-hidden')}
    >
      <span className={clsx([base, colors[color]])}>
        <svg
          className="size-4 stroke-(--checkbox-check) opacity-0 group-data-checked:opacity-100 sm:h-3.5 sm:w-3.5"
          viewBox="0 0 14 14"
          fill="none"
        >
          {/* Checkmark icon */}
          <path
            className="opacity-100 group-data-indeterminate:opacity-0"
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Indeterminate icon */}
          <path
            className="opacity-0 group-data-indeterminate:opacity-100"
            d="M3 7H11"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Headless.Checkbox>
  );
}

/***************************************************************
                      Checkbox Button
***************************************************************/
export function CheckboxButtonGroup({ className, ...props }) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Basic groups
        'flex flex-col items-center w-full space-y-2 mt-4 max-w-lg px-4',
      )}
    />
  );
}

export function CheckboxButtonField({ className, children, correct, ...props }) {
  return (
    <Headless.Field
      data-slot="field"
      {...props}
      className={clsx(
        className,
        // Base layout
        'flex flex-row justify-center w-full',
      )}
    >
      <div className="relative w-full">
        {children}
        {correct === true && (
          <div className="top-1/2 translate-x-1/4 absolute right-0 z-10 overflow-hidden transform -translate-y-1/2 size-6 rounded-full bg-white">
            <CheckCircleIcon className="fill-green-600 size-6" />
          </div>
        )}
        {correct === false && (
          <div className="top-1/2 translate-x-1/4 absolute right-0 z-10 overflow-hidden transform -translate-y-1/2 size-6 rounded-full bg-white">
            <XCircleIcon className="fill-error size-6" />
          </div>
        )}
      </div>
    </Headless.Field>
  );
}

export function CheckboxButton({ className, children, ...props }) {
  const main = [
    // Base
    'group relative flex w-full touch-manipulation cursor-pointer',
    // Disabled
    'data-disabled:pointer-events-none',
    // Cursor
    'cursor-pointer touch-manipulation pointer-events-auto',
  ];

  const base = [
    'size-8 overflow-hidden',
    'relative isolate flex items-center justify-center w-full h-full',
    'bg-gray-content/90',
    'border-4 border-solid rounded-md border-gray',
    // Disabled state
    'group-data-disabled:border-zinc-950/25 group-data-disabled:bg-zinc-950/5',
  ];

  const content = (
    <>
      <div className="-inset-1 absolute z-0 rounded-md" />
      <div className="absolute inset-x-0 top-0 bottom-0 transform group-active:translate-y-0.5 group-active:bottom-0.5 z-1 bg-black rounded-[0.65rem] p-[0.1875rem]">
        <div className="relative w-full h-full">
          <div className="top-1 absolute inset-x-0 bottom-0 overflow-hidden rounded-[0.4375rem] bg-beige">
            <div className="opacity-30 absolute inset-0 bg-black" />
          </div>
          <div className="bottom-1 absolute inset-x-0 top-0 overflow-hidden group-active:bottom-0.5 rounded-[0.4375rem] bg-beige">
            <div className="group-hover:opacity-20 absolute inset-0 opacity-0" />
          </div>
        </div>
      </div>
      <div className="z-1 absolute inset-0 overflow-hidden hidden rounded-[0.4375rem] ">
        <div
          className="opacity-20 absolute top-0 left-0 w-full h-full bg-black"
          style={{ left: '-100%' }}
        />
      </div>
    </>
  );

  return (
    <Headless.Checkbox
      data-slot="control"
      {...props}
      className={clsx(className, main)}
    >
      <button
        className="relative flex group touch-manipulation cursor-pointer px-5 w-full pointer-events-auto leading-none group-data-disabled:pointer-events-none"
        type="button"
      >
        {/* Background layers */}
        {content}
        {/* Checkbox indicator */}
        <div className="relative flex flex-row gap-x-4 items-center w-full min-h-full pointer-events-none z-2 transform -translate-y-0.5 group-active:translate-y-0 p-[0.25rem]">
          <div className="relative flex-grow-0">
            <div className={clsx(base)}>
              <div className="relative flex items-center justify-center w-full h-full">
                {/* Checkmark icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 40 40"
                  className="size-4 stroke-black opacity-0 group-data-checked:opacity-100"
                >
                  <path
                    fill="black"
                    className="opacity-100 group-data-indeterminate:opacity-0"
                    d="m14.6 33.11-8.31-10a2.88 2.88 0 0 1-.82-2 2.68 2.68 0 0 1 2.8-2.74 2.66 2.66 0 0 1 2.22 1.07l6.61 8.1L30.14 7a2.63 2.63 0 0 1 2.46-1.48 2.7 2.7 0 0 1 2.81 2.73 3.32 3.32 0 0 1-.62 1.86L19.79 33a3 3 0 0 1-2.63 1.34 3.15 3.15 0 0 1-2.56-1.23z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 items-start">
            <div className="relative">
              <div className="relative text-left">
                <div className="md:py-4 text-base text-black font-bold">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    </Headless.Checkbox>
  );
}
