import { Button } from '@components/button';
import { ConfirmModal } from '@components/modal';
import { PencilIcon } from '@heroicons/react/24/solid';
import { isNullOrUndefined } from '@utils/helpers';
import { FormAlert } from '@components/form';

export function AlertPlaceholder({ error, readOnly }) {
  if (isNullOrUndefined(error) || readOnly) return null;

  return (
    <FormAlert errors={[error]}>
      {error}
    </FormAlert>
  );
}

export default function EditForm({
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
