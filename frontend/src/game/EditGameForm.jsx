import { Field, Label } from '@components/fieldset';
import { FileInput, TextInput, EditForm } from '@components/form';
import { useToast } from '@hooks/toast';
import { mapToGame } from '@utils/game';
import { useState } from 'react';

const validate = (game) => {
  if (!game.name || game.name.trim() === '') {
    return 'Game name is required';
  }
  return null;
}

function EditGameForm({ game, onSubmit, isReadOnly = false }) {
  const [prevFormData, setPrevFormData] = useState(mapToGame(game));
  const [formData, setFormData] = useState(mapToGame(game));
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readOnly, setReadOnly] = useState(isReadOnly);
  const toastify = useToast();

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(prevFormData);
    setError('');
  };

  // Discard changes and reset form
  const discardChanges = () => {
    resetForm();
    setReadOnly(true);
    setIsOpen(false);
  };

  // On cancel, show confirmation dialog if form is dirty (unsaved changes)
  const handleCancel = () => {
    const isDirty = !isEqual(formData, prevFormData);
    if (isDirty) {
      setIsOpen(true);
    } else {
      resetForm();
      setReadOnly(true);
    }
  };

  // Handle all form changes
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate form data
    const validationError = validate(formData);
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    // Call the onSubmit function with the form data
    const pendingData = mapToGame(formData);
    return onSubmit(pendingData)
      .then(() => {
        setPrevFormData(pendingData);
        setFormData(pendingData);
        setReadOnly(true);
        toastify.success({ message: 'Updated game' });
      })
      .catch((err) => {
        toastify.error({ message: err.message || 'Failed to save changes.' });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const props = {
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    error: error,
    setError: setError,
    readOnly: readOnly,
    setReadOnly: setReadOnly,
    disabled: isSubmitting,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    discardChanges: discardChanges,
  }

  return (
    <>
      <EditForm {...props}>
        {/* Game name */}
        <Field className="col-span-full">
          <Label htmlFor="gameName">Game name</Label>
          <TextInput
            id="gameName"
            name="name"
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            readOnly={readOnly}
            disabled={isSubmitting}
          />
        </Field>

        {/* Game thumbnail */}
        <Field className="col-span-full">
          <Label htmlFor="thumbnail">Photo</Label>
          <FileInput
            name="thumbnail"
            value={formData.thumbnail}
            onChange={(dataUrl) => handleChange('thumbnail', dataUrl)}
            readOnly={readOnly}
            disabled={isSubmitting}
          />
        </Field>
      </EditForm>
    </>
  );
}

export default EditGameForm;