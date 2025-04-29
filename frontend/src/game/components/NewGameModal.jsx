import { Button } from '@components/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@components/dialog';
import { ErrorMessage, Field, Label } from '@components/fieldset';
import { Input } from '@components/input';
import { isEmptyString } from '@utils/helpers';
import { useState } from 'react';

export default function NewGameModal({ isOpen, setIsOpen, onSubmit }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (isEmptyString(name)) {
      setError('Please enter a name to create your game');
      setShowError(true);
      return false;
    } else {
      setError('');
      setShowError(false);
      return true;
    }
  }

  const reset = () => {
    setShowError(false);
    setIsLoading(false);
    setIsOpen(false);
    setName('');
    setError('');
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate() === false) {
      return;
    }

    setIsLoading(true);
    onSubmit(name).finally(() => reset());
  }

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    reset();
  }

  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create a new game</DialogTitle>
          <DialogDescription>Enter a name for your new game.</DialogDescription>
          <DialogBody>
            <Field>
              <Label required>Name</Label>
              <Input
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => validate()}
                invalid={showError}
                placeholder="My awesome game"
                autoFocus
              />
              {showError && <ErrorMessage>{error}</ErrorMessage>}
            </Field>
          </DialogBody>
          <DialogActions>
            <Button plain type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} loading={isLoading}>
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
