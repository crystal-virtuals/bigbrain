import { Button } from '@components/button';
import { ErrorMessage } from '@components/fieldset';
import { Input } from '@components/input';
import { Text } from '@components/text';
import { Textarea } from '@components/textarea';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { fileToDataUrl } from '@utils/helpers';
import clsx from 'clsx';
import { useRef, useState } from 'react';

export function ControlledTextarea({
  name,
  value,
  setValue,
  errors,
  setErrors,
  required,
  readOnly = false,
  errorMessage = '',
  ...props
}) {
  const [touched, setTouched] = useState(false);

  const validate = (value) => {
    if (!value || value.trim() === '') {
      return errorMessage || 'This field is required';
    }
    return null;
  };

  const setError = (error) => {
    const newErrors = new Map(errors);
    if (error) {
      newErrors.set(name, error);
    } else {
      newErrors.delete(name);
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    if (setValue) setValue(e.target.value);
    if (touched && required) setError(validate(e.target.value));
  };

  const handleBlur = (e) => {
    setTouched(true);
    if (required) setError(validate(e.target.value));
  };

  return (
    <>
      <Textarea
        dark={false}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
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
  setValue,
  errors,
  setErrors,
  required = false,
  readOnly = false,
  errorMessage = '',
  correct,
  ...props
}) {
  const [touched, setTouched] = useState(false);

  const validate = (value) => {
    if (!value || value.trim() === '') {
      return errorMessage || 'This field is required';
    }
    return null;
  };

  const setError = (error) => {
    const newErrors = new Map(errors);
    if (error) {
      newErrors.set(name, error);
    } else {
      newErrors.delete(name);
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    if (setValue) setValue(e.target.value); // onChange receives the new value
    if (touched && required) setError(validate(e.target.value));
  };

  const handleBlur = (e) => {
    setTouched(true);
    if (required) setError(validate(e.target.value));
  };

  let key = correct === true ? 'true' : correct === false ? 'false' : 'neutral';
  const styles = {
    true: 'sm:focus-within:after:ring-emerald-600',
    false: 'sm:focus-within:after:ring-pink-600',
    neutral: 'sm:focus-within:after:ring-blue-500',
  }[key];

  return (
    <>
      <Input
        dark={false}
        className={styles}
        placeholder={required ? 'Required' : 'Optional'}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={readOnly}
        aria-readonly={readOnly}
        inputclassname="sm:px-[calc(--spacing(3)-1px)] px-[calc(--spacing(3.5)-1px)]"
        {...props}
      />
    </>
  );
}

export function CheckboxButton({ checked, setChecked }) {
  return (
    <button
      type="button"
      className={clsx(
        'shadow-md text-white flex rounded-lg items-center justify-center p-1.5 ml-2 touch-manipulation cursor-pointer pointer-events-auto',
        checked
          ? 'bg-emerald-400 shadow-emerald-800'
          : 'bg-rose-500 shadow-rose-900'
      )}
      onClick={() => setChecked((prev) => !prev)}
    >
      <CheckIcon
        aria-hidden="true"
        className="size-6 stroke-1 stroke-white"
        style={{ display: checked ? 'block' : 'none' }}
      />
      <XMarkIcon
        aria-hidden="true"
        className="size-6 stroke-1 stroke-white"
        style={{ display: checked ? 'none' : 'block' }}
      />
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
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
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
