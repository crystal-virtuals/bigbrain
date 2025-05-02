import { Field, Label } from '@components/fieldset';
import { InputGroup } from '@components/input';
import { Link } from '@components/link';
import { LinkIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import { useToast } from '@hooks/toast';
import clsx from 'clsx';

export function CopyToClipboardLink({ color, value, className }) {
  const [copied, setCopied] = useState(false);
  const toastify = useToast();

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toastify.success({ message: 'Copied to clipboard.', replace: true });
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
      });
  };

  const styles = [
    // color
    color ? {color} : 'text-zinc-950 dark:text-white',
    // hover
    'group-hover:opacity-100 opacity-50',
  ]

  return (
    <Link className={clsx(className, 'group flex flex-row items-center gap-1')} onClick={copyToClipboard}>
      <LinkIcon className={clsx(styles, 'size-5')}/>
      <span className={clsx(styles, 'group-hover:underline text-sm font-normal leading-none text-center')}>
        {copied ? 'Link copied' : 'Copy link'}
      </span>
    </Link>
  )
}

export function CopyToClipboardInput({ value, copied, onCopy }) {
  return (
    <InputGroup className="relative">
      <span
        data-slot="control"
        className={clsx([
          // Basic layout
          'relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
          // Typography
          'font-nunito text-4xl font-black leading-none tracking-wider text-accent dark:text-accent',
          // Border
          'border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20',
          // Background color
          'bg-transparent dark:bg-white/5',
        ])}
      >
        {value}
      </span>

      <button
        onClick={onCopy}
        className={clsx(
          // Base
          'inline-flex items-center justify-center rounded-lg p-2',
          // Positioning
          'absolute end-2 top-1/2 -translate-y-1/2',
          // Cursor
          'cursor-pointer touch-manipulation pointer-events-auto',
          // Icon color
          'text-zinc-950 dark:text-zinc-200',
          // Background color
          'hover:bg-zinc-950/[2.5%] dark:hover:bg-white/10',
          // Tooltip
          'tooltip tooltip-neutral before:rounded-2xl'
        )}
        data-tip={copied ? 'Copied!' : 'Copy link to share'}
      >
        {copied ? (
          <svg
            className="w-3.5 h-3.5 text-green dark:text-green"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 12"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 5.917 5.724 10.5 15 1.5"
            />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
          </svg>
        )}
      </button>
    </InputGroup>
  );
}

export function CopySessionId({ sessionId }) {
  const [copied, setCopied] = useState(false);
  const toastify = useToast();

  const sessionUrl = `${window.location.origin}/play/${sessionId}`;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(sessionUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toastify.success({ message: 'Copied to clipboard.', replace: true });
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
      });
  };

  return (
    <>
      <Field>
        <Label htmlFor="session-url">Game PIN:</Label>
        <CopyToClipboardInput
          id="session-url"
          value={sessionId}
          copied={copied}
          onCopy={copyToClipboard}
        />
      </Field>
    </>
  );
}
