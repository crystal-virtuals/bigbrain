import * as Headless from '@headlessui/react';
import { CheckIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Button, ButtonClose } from './button';
import { Text } from './text';

const sizes = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
};

export function Dialog({ size = 'lg', className, children, ...props }) {
  return (
    <Headless.Dialog {...props}>
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/25 px-2 py-2 transition duration-100 focus:outline-0 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-zinc-950/50"
      />

      <div className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
        <div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4">
          <Headless.DialogPanel
            transition
            className={clsx(
              className,
              sizes[size],
              'row-start-2 w-full min-w-0 rounded-t-3xl bg-white p-(--gutter) shadow-lg ring-1 ring-zinc-950/10 [--gutter:--spacing(8)] sm:mb-auto sm:rounded-2xl dark:bg-zinc-900 dark:ring-white/10 forced-colors:outline',
              'transition duration-100 will-change-transform data-closed:translate-y-12 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in sm:data-closed:translate-y-0 sm:data-closed:data-enter:scale-95'
            )}
          >
            {children}
          </Headless.DialogPanel>
        </div>
      </div>
    </Headless.Dialog>
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <Headless.DialogTitle
      {...props}
      className={clsx(
        className,
        'text-lg/6 font-semibold text-balance text-zinc-950 sm:text-base/6 dark:text-white'
      )}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <Headless.Description
      as={Text}
      {...props}
      className={clsx(className, 'mt-2 text-pretty')}
    />
  );
}

export function DialogBody({ className, ...props }) {
  return <div {...props} className={clsx(className, 'mt-6')} />;
}

export function DialogActions({ className, ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto'
      )}
    />
  );
}

export function DialogIcon({ type = 'info' }) {
  const backgroundColor = {
    error: 'bg-red-100',
    info: 'bg-blue-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
  }[type];

  const classes = clsx(
    'mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10',
    backgroundColor,
  )

  const icons = {
    error: (
      <ExclamationTriangleIcon
        aria-hidden="true"
        className="size-6 text-red-600"
      />
    ),
    info: (
      <InformationCircleIcon
        aria-hidden="true"
        className="size-6 text-blue-600"
      />
    ),
    success: (
      <CheckIcon
        aria-hidden="true"
        className="size-6 text-green-600"
      />
    ),
    warning: (
      <ExclamationTriangleIcon
        aria-hidden="true"
        className="size-6 text-yellow-600"
      />
    ),
  }

  return (
    <div className={classes}>
      {icons[type]}
    </div>
  );
}

export function DialogWithIcon({
  icon = 'info',
  open = true,
  onClose = () => {},
  onConfirm = () => {},
  title,
  description,
  confirmText,
  disabled = false,
  dismissable = true,
  ...props
}) {
  return (
    <>
      <Headless.Dialog open={open} onClose={onClose} className="relative z-10">
        <Headless.DialogBackdrop
          transition
          className="fixed inset-0 bg-zinc-500 transition-opacity data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-400 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Headless.DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-zinc-900 px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              {dismissable && (
                <ButtonClose onClick={onClose} className="hidden sm:block" disabled={disabled}/>
              )}
              <div className="sm:flex sm:items-start">
                <DialogIcon type={icon}/>
                <div className="mt-3 text-center sm:mt-0 sm:ml-7 sm:text-left">
                  <DialogTitle>
                    {title}
                  </DialogTitle>
                  <DialogDescription>
                    {description}
                  </DialogDescription>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                <Button
                  color="red"
                  type="button"
                  onClick={onConfirm}
                  disabled={disabled}
                  loading={disabled}
                  className="inline-flex w-full justify-center sm:ml-3 sm:w-auto"
                >
                  {confirmText || 'Confirm'}
                </Button>
                {dismissable && <Button
                  plain
                  type="button"
                  onClick={onClose}
                  disabled={disabled}
                  className="mt-3 inline-flex w-full justify-center sm:mt-0 sm:w-auto "
                >
                  Cancel
                </Button>}
              </div>
            </Headless.DialogPanel>
          </div>
        </div>
      </Headless.Dialog>
    </>
  );
}
