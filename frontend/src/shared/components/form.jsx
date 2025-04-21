import { ErrorMessage } from '@components/fieldset';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { fileToDataUrl } from '@utils/helpers';
import { useState, useRef, useEffect } from 'react';
import { Text } from '@components/text';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { PencilIcon } from '@heroicons/react/24/solid';
import { ConfirmModal } from '@components/modal';
import { Toast as Alert } from '@hooks/toast';

export function TextInput({
  name,
  initialValue,
  placeholder,
  onChange,
  readOnly,
}) {
  const [value, setValue] = useState(initialValue || '');
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  const validate = (value) => {
    if (!value || value.trim() === '') {
      return 'This field is required';
    }
    return null;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) onChange(newValue);
    if (touched) setError(validate(newValue));
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  return (
    <>
      <Input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        invalid={error}
        readOnly={readOnly}
        aria-readonly={readOnly}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
}

export function FileInput({ name, initialUrl, onChange, readOnly }) {
  const [previewUrl, setPreviewUrl] = useState(initialUrl || null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // On mount, set the preview URL if a url is provided
  useEffect(() => {
    setPreviewUrl(initialUrl || null);
  }, [initialUrl]);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Convert file to data URL
    fileToDataUrl(file)
      .then((dataUrl) => {
        setPreviewUrl(dataUrl);
        setError(null);
        if (onChange) onChange(dataUrl);
      })
      .catch((error) => {
        setError(error.message || 'Failed to load image. Please try again.');
        setPreviewUrl(initialUrl || null);
      });
  };

  const handleUploadError = () => {
    setPreviewUrl(null);
    setError('Failed to load image. Please try again.');
  };

  return (
    <>
      <div className="mt-2 flex items-center gap-x-8">
        {previewUrl ? (
          <img
            alt=""
            src={previewUrl}
            className="size-24 flex-none rounded-lg object-cover"
            onError={handleUploadError}
          />
        ) : (
          <PhotoIcon aria-hidden="true" className="size-24 text-gray-300" />
        )}

        <div>
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            name={name}
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          {/* Button that triggers the file input */}
          {!readOnly && (
            <>
              <Button type="button" onClick={handleFileUpload}>
                Change thumbnail
              </Button>

              <Text className="mt-2 text-xs/5 sm:text-xs/5">
                JPG, JPEG or PNG. Max size 2MB.
              </Text>
            </>
          )}
        </div>
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
}

export function EditForm({
  children,
  onSubmit,
  onCancel,
  error,
  setError,
  readOnly=false,
  setReadOnly,
  disabled=false,
  isOpen,
  setIsOpen,
  discardChanges,
}) {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Error message */}
            {error && (
              <div className="col-span-full">
                <Alert
                  type="error"
                  message={error}
                  onDismiss={() => setError('')}
                  className="w-full"
                />
              </div>
            )}

            {/* Form fields */}
            {children}
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 border-t border-zinc-900/10 dark:border-white/10 px-4 py-4 sm:px-8">
          {readOnly ? (
            <Button type="button" onClick={() => setReadOnly(false)}>
              <PencilIcon aria-hidden="true" />
              Edit
            </Button>
          ) : (
            <>
              <Button type="button" onClick={onCancel} disabled={disabled}>
                Cancel
              </Button>
              <Button type="submit" loading={disabled} disabled={disabled}>
                Save
              </Button>
            </>
          )}
        </div>
      </form>

      {/* Confirm Dialog */}
      <ConfirmModal
        title="Unsaved changes"
        description="You have unsaved changes. Are you sure you want to discard them?"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleConfirm={discardChanges}
        confirmText="Discard"
        style="warning"
      />
    </>
  );
}
