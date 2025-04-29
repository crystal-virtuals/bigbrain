import { Button, ButtonLink } from '@components/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog';
import { Field, Label } from '@components/fieldset';
import { InputGroup } from '@components/input';
import clsx from 'clsx';
import { useState } from 'react';

function Strong({ children }) {
  return (
    <span
      className={clsx([
        // Basic layout
        'relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
        // Typography
        'font-nunito text-3xl font-black leading-none tracking-wider text-cyan dark:text-cyan',
      ])}
    >
      {children}
    </span>
  );
}

export function CopyToClipboardInput({ value, copied, onCopy }) {
  return (
    <InputGroup className="relative">
      <span
        id="session-url"
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

export function StartGameButton({ sessionId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sessionUrl = `/play/${sessionId}`;
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(sessionUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
      });
  };

  return (
    <>
      <ButtonLink onClick={() => setIsOpen(true)}>
        <span className="md:inline hidden">Start Game</span>
        <span className="md:hidden inline">Start</span>
      </ButtonLink>

      {/* Modal */}
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Game Started!</DialogTitle>
        <DialogDescription>
          Share the link below with your friends.
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label htmlFor="session-url">Game PIN:</Label>
            <CopyToClipboardInput
              value={sessionId}
              copied={copied}
              onCopy={copyToClipboard}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Lobby <span aria-hidden="true">&rarr;</span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
