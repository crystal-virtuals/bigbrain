import { Button, ButtonLink } from '@components/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog';
import { Field, Label } from '@components/fieldset';
import { useState } from 'react';
import { CopyToClipboardInput } from '@components/clipboard';

export default function StartGameButton({ sessionId }) {
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

  const toLobby = () => {
    setIsOpen(false);
  }

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
          <Button onClick={toLobby}>
            Lobby <span aria-hidden="true">&rarr;</span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
