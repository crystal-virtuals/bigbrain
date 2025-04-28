import { useState, useEffect, useRef } from 'react';

function useEditForm(initialData, onSubmit, validate, isReadOnly = false) {
  const [prevFormData, setPrevFormData] = useState(initialData);
  const [formData, setFormData] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readOnly, setReadOnly] = useState(isReadOnly);

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
    if (validate) {
      const validationError = validate(formData);
      if (validationError) {
        setError(validationError);
        setIsSubmitting(false);
        return;
      }
    }

    return onSubmit(formData)
      .then((updated) => {
        setPrevFormData(updated);
        setFormData(updated);
        setReadOnly(true);
      })
      .catch(err => {
        setError(err.message || 'Failed to save changes.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return {
    // EditForm props
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
    formData,
    setFormData,
    handleChange,
  };
}

export default useEditForm;