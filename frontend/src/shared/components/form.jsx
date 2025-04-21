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
