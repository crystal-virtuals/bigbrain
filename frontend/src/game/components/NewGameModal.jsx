import { Button } from '@components/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog';
import { ErrorMessage, Field, Label } from '@components/fieldset';
import { InputError } from '@components/input';
import { isEmptyString } from '@utils/helpers';
import { useEffect, useState } from 'react';

export default function NewGameModal({ isOpen, setIsOpen, onSubmit }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (isTouched) {
      if (isEmptyString(name)) {
        setError('Please enter a name to create your game');
      } else {
        setError('');
      }
    }
  }, [name, isTouched]); // Runs whenever name or touched state changes

  const validate = () => {
    if (isEmptyString(name)) {
      setError('Please enter a name to create your game');
      setIsTouched(true);
      return false;
    }
    return true;
  };

  const reset = () => {
    setIsLoading(false);
    setName('');
    setError('');
    setIsTouched(false);
  };

  const handleChange = (e) => {
    setName(e.target.value);
    setIsTouched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    onSubmit(name).finally(() => {
      reset();
      setIsOpen(false);
    });
  };

  const handleClose = (e) => {
    e.preventDefault();
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <DialogTitle>Create a new game</DialogTitle>
      <DialogDescription>Enter a name for your new game.</DialogDescription>
      <DialogBody>
        <Field>
          <Label required>Name</Label>
          <InputError
            name="name"
            type="text"
            value={name}
            onChange={handleChange}
            invalid={isTouched && isEmptyString(name)}
            placeholder="My awesome game"
            className='col-start-1 row-start-1 before:hidden'
            autoFocus
          />
          {isTouched && error && <ErrorMessage>{error}</ErrorMessage>}
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain type="button" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
