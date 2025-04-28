import { Button } from '@components/button';
import { ErrorMessage, Field } from '@components/fieldset';
import { Input } from '@components/input';
import { ConfirmModal } from '@components/modal';
import { Strong, Text } from '@components/text';
import { Textarea } from '@components/textarea';
import { CheckIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { PencilIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { fileToDataUrl, isNullOrUndefined, pluralSuffix } from '@utils/helpers';
import { useRef, useState } from 'react';
import clsx from 'clsx';

/***************************************************************
                       Form Alert
***************************************************************/
export function FormAlert( { errors, children } ) {
  return (
    <div className="rounded-md bg-red-50 p-4 col-span-full border-2 border-red-100">
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">There {errors.size === 1 ? 'is' : 'were'} {errors.size || 'some'} error{pluralSuffix(errors.size || 2)} with your submission</h3>
          <div className="mt-2 text-sm text-red-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/***************************************************************
                       Edit Form Inputs
***************************************************************/
export function ControlledTextarea({
  name,
  value,
  onChange,
  required = false,
  readOnly = false,
  ...props
}) {

  return (
    <>
      <Textarea
        dark={false}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        aria-readonly={readOnly}
        placeholder={required ? 'Required' : 'Optional'}
        {...props}
      />
    </>
  );
}

export function ControlledInput({
  name,
  value,
  onChange,
  required = false,
  readOnly = false,
  correct,
  ...props
}) {

  const styles = {
    true: 'sm:focus-within:after:ring-emerald-600',
    false: 'sm:focus-within:after:ring-pink-600',
    neutral: 'sm:focus-within:after:ring-blue-500',
  }[correct === true ? 'true' : correct === false ? 'false' : 'neutral'];

  return (
    <>
      <Input
        dark={false}
        className={styles}
        placeholder={required ? 'Required' : 'Optional'}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        aria-readonly={readOnly}
        inputclassname="sm:px-[calc(--spacing(3)-1px)] px-[calc(--spacing(3.5)-1px)]"
        {...props}
      />
    </>
  );
}

export function CheckboxButton({ className, checked, toggleChecked }) {
  const styles = {
    base: 'shadow-md text-white flex rounded-lg items-center justify-center p-1.5 ml-2 touch-manipulation cursor-pointer pointer-events-auto',
    true: 'bg-emerald-400 shadow-emerald-800',
    false: 'bg-rose-500 shadow-rose-900',
  };

  return (
    <button
      type="button"
      className={clsx(
        className,
        styles.base,
        checked
          ? styles.true
          : styles.false,
      )}
      onClick={toggleChecked}
    >
      {checked ? (
        <CheckIcon
          aria-hidden="true"
          className="size-6 stroke-1 stroke-white"
        />
      ) : (
        <XMarkIcon
          aria-hidden="true"
          className="size-6 stroke-1 stroke-white"
        />
      )}
    </button>
  );
}

function LabelError() {
  const classes = [
    'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-1',
    'flex flex-col items-center justify-center',
    'bg-red-400 rounded-full size-5 text-sm font-bold text-white',
  ];
  return <div className={clsx(classes)}>!</div>;
}


export function LabelTab({ type, label, children, invalid = false, ...props }) {
  // type is either 'correct' or 'false'
  const styles = {
    correct: 'bg-emerald-500',
    false: 'bg-[var(--color-false)]',
    neutral: 'bg-[var(--color-cyan)]',
    dark: 'bg-[var(--color-dark)]',
  };
  const bgColor = styles[type] || styles.neutral;
  const style = clsx(
    'relative rounded-t-md inline-block px-3 py-2 leading-none select-none',
    bgColor
  );

  return (
    <div className="flex flex-col w-full rounded-lg">
      <div className="flex flex-row justify-start w-full text-sm font-bold text-white -mb-1">
        <span className={style}>
          <label {...props}>{label}</label>
          {invalid && <LabelError />}
        </span>
      </div>

      <div
        className={clsx(
          bgColor,
          'rounded-b-xl rounded-tr-xl gap-y-2 flex flex-col w-full p-1.5'
        )}
      >
        {children}
      </div>
    </div>
  );
}

/***************************************************************
                       Edit Form Inputs
***************************************************************/
export function TextInput({ value, onChange, readOnly, ...props }) {
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const validate = (value) => {
    if (!value || value.trim() === '') {
      return 'This field is required';
    }
    return null;
  };

  const handleChange = (e) => {
    if (onChange) onChange(e.target.value); // onChange receives the new value
    if (touched) setError(validate(e.target.value));
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  return (
    <>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        invalid={error}
        readOnly={readOnly}
        aria-readonly={readOnly}
        inputclassname="w-full truncate"
        {...props}
      />
      {error && !readOnly && touched && (
        <ErrorMessage>{error}</ErrorMessage>)
      }
    </>
  );
}

/***************************************************************
                       File Input
***************************************************************/
export function ThumbnailInput({ value, onChange, ...props }) {
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const styles = {
    close: [
      // cursor
      'cursor-pointer touch-manipulation pointer-events-auto',
      // layout
      'absolute -top-2 -right-2 rounded-full p-1 shadow-sm',
      // text
      'text-zinc-950 dark:text-white',
      // background
      'bg-white dark:bg-zinc-900 hover:bg-white/10 dark:hover:bg-zinc-950',
    ],
    dashed: [
      'border border-dashed border-zinc-900/25 dark:border-white/25',
    ],
    base: [
      // Base
      'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border',
      // Sizing
      'px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6',
    ],
    readOnly: [
      // cursor
      'cursor-none pointer-events-none',
    ]
  }

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // reset the input value to allow re-uploading the same file
    e.target.value = '';

    fileToDataUrl(file)
      .then((dataUrl) => {
        setError(null);
        onChange(dataUrl); // onChange receives the data URL
      })
      .catch((error) => {
        setError(error.message || 'Failed to load image. Please try again.');
      })
  };

  const handleUploadError = () => {
    setError('Failed to load image. Please try again.');
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the file input
    onChange(null); // Clear the image
    setError(null);
  };

  if (value) {
    return (
      <Field className="w-full flex flex-col">
        <div className={clsx('relative', styles.dashed, styles.base)}>
          <img
            alt=""
            src={value}
            className="size-full flex-none rounded-lg object-cover"
            onError={handleUploadError}
          />
          <button
            type="button"
            className={clsx(styles.close)}
            onClick={handleRemoveImage}
          >
            <XMarkIcon aria-hidden='true' className="size-5 text-zinc-950 dark:text-white" />
          </button>
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Field>
    );
  }

  return (
    <Field className="w-full flex flex-col">
      <Button
        outline
        type="button"
        className={clsx(styles.dashed, value && styles.readOnly)}
        onClick={handleFileUpload}
      >
        <div className="text-center px-6 py-10">
          <PhotoIcon
            aria-hidden="true"
            className="mx-auto size-14 text-zinc-300 dark:text-zinc-500"
          />
          <div className="mt-4 flex text-sm/6 text-zinc-600 dark:text-gray-400 justify-center">
            <Strong htmlFor="file-upload">Upload a thumbnail</Strong>
            <input
              id="file-upload"
              name="file-upload"
              accept="image/jpeg, image/png, image/jpg"
              type="file"
              className="sr-only"
              ref={fileInputRef}
              onChange={handleFileChange}
              {...props}
            />
          </div>
          <p className="text-xs/5 text-zinc-600">
            PNG, JPG, JPEG up to 10MB
          </p>
        </div>
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Field>
  );
}



export function FileInput({ value, onChange, readOnly }) {
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileToDataUrl(file)
      .then((dataUrl) => {
        setError(null);
        if (onChange) onChange(dataUrl); // onChange receives the data URL
      })
      .catch((error) => {
        setError(error.message || 'Failed to load image. Please try again.');
      });
  };

  const handleUploadError = () => {
    setError('Failed to load image. Please try again.');
  };

  return (
    <>
      <div className="mt-2 flex items-center gap-x-8">
        {value ? (
          <img
            alt=""
            src={value}
            className="size-24 flex-none rounded-lg object-cover"
            onError={handleUploadError}
          />
        ) : (
          <PhotoIcon aria-hidden="true" className="size-24 text-gray-300" />
        )}

        <div>
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

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

/***************************************************************
                       Edit Form
***************************************************************/
function AlertPlaceholder({ error, readOnly }) {
  if (isNullOrUndefined(error) || readOnly) return null;

  return (
    <FormAlert errors={[error]}>
      {error}
    </FormAlert>
  );
}

export function EditForm({
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
  ...props
}) {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <AlertPlaceholder error={error} readOnly={readOnly} />
            {/* Form fields */}
            { props.children }
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 border-t border-zinc-900/10 dark:border-white/10 px-4 py-4 sm:px-8">
          {readOnly ? (
            <Button type="button" color='white' onClick={() => setReadOnly(false)}>
              <PencilIcon aria-hidden="true" />
              Edit
            </Button>
          ) : (
            <>
              <Button type="button" onClick={onCancel} disabled={disabled} outline>
                Cancel
              </Button>
              <Button type="submit" loading={disabled} disabled={disabled} color='teal'>
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
        onConfirm={discardChanges}
        confirmText="Discard"
        style="warning"
      />
    </>
  );
}
