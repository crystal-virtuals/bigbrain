import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export function Accordion({ title, children, className }) {
  return (
    <>
      <Disclosure as="div" className={clsx(className, 'p-4')}>
        <DisclosureButton className="group flex w-full items-center justify-between">
          <span className="text-sm/6 font-medium dark:text-white dark:group-data-hover:text-white/80 text-zinc-950 group-data-hover:text-zinc-900">
            {title}
          </span>
          <ChevronDownIcon className="size-5 fill-zinc-950/50 group-data-hover:fill-zinc-900 dark:fill-white/60 dark:group-data-hover:fill-white/50 group-data-open:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel
          transition
          className="mt-2 text-sm/5 dark:text-white/50 text-zinc-950/50 origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0"
        >
          {children}
        </DisclosurePanel>
      </Disclosure>
    </>
  );
}
