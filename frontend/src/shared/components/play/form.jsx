import { Label as InputLabel } from '@components/fieldset';
import { InputError } from '@components/input';
import * as Headless from '@headlessui/react';
import clsx from 'clsx';

export function Form({ children, className, ...props }) {
  return (
    <div className="px-8 py-4 rounded-xl bg-base-100 dark:bg-dark border-2 border-beige-300 dark:border-indigo-200 w-full max-w-xl drop-shadow-xl">
      <form className={clsx('flex flex-col gap-4', className)} {...props}>
        {children}
      </form>
    </div>
  );
}

export function FieldGroup({ children, className }) {
  return (
    <div
      data-slot="control"
      className={clsx(
        'grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Field({ children, className }) {
  return (
    <Headless.Field
      className={clsx(
        'grid grid-cols-subgrid sm:col-span-3 items-center place-items-start',
        className
      )}
    >
      {children}
    </Headless.Field>
  );
}

export function Input({ className, ...props }) {
  return (
    <InputError
      className={clsx('mt-3 sm:col-span-2 sm:mt-0', className)}
      pink
      {...props}
    />
  );
}

export function Label({ children, ...props }) {
  return (
    <InputLabel className="col-span-1" {...props}>
      {children}
    </InputLabel>
  );
}
