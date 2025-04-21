import { useState, useEffect, useRef } from 'react';

export function useEditForm(initialData, onSubmit) {
  const [formData, setFormData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const initialRef = useRef(initialData);

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  // Check if form is dirty whenever formData changes
  useEffect(() => {
    const dirty = !isEqual(formData, initialRef.current);
    setIsDirty(dirty);
  }, [formData]);

  // Update initialData ref if game prop changes
  useEffect(() => {
    initialRef.current = initialData;
    setFormData(initialData);
  }, [initialData]);

  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialRef.current);
    setIsDirty(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    return onSubmit(formData)
      .then((updated) => {
        initialRef.current = updated;
        setFormData(updated);
        setIsDirty(false);
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