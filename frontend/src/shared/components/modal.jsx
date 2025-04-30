import { Alert, AlertActions, AlertDescription, AlertTitle } from '@components/alert';
import { Button } from '@components/button';
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@components/dialog';
import { ErrorMessage } from '@components/fieldset';
import { CheckIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Strong } from '@components/text';

export function AlertModal( { style = 'error', title, description, warning, confirmText = 'Confirm', onConfirm, isOpen, setIsOpen, ...props} ) {
  const { isLoading, error, ...rest } = props;

  style = style || 'error';
  let styles = {
    error: { color: 'red', bg: 'bg-red-100', text: 'text-red-600', icon: ExclamationTriangleIcon},
    success: {  color: 'lime', bg: 'bg-green-100', text: 'text-green-600', icon: CheckIcon },
    warning: {  color: 'amber', bg: 'bg-yellow-100', text: 'text-yellow-600', icon: ExclamationTriangleIcon },
    info: {  color: 'blue', bg: 'bg-blue-100', text: 'text-blue-600', icon: InformationCircleIcon },
  }[style];

  return (
    <Alert open={isOpen} onClose={setIsOpen}>
      <div className="flex items-start">
        <div className={clsx(
          'mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10',
          styles.bg
        )}>
          <styles.icon
            aria-hidden="true"
            className={clsx(
              'size-6',
              styles.text
            )}
          />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            {description}
            <span className="font-semibold text-gray-900 dark:text-zinc-300">{
              warning ? (
                {warning}
              ) : (
                'Are you sure? This action cannot be undone.'
              )
            }</span>
          </AlertDescription>
        </div>
      </div>
      <AlertActions className="mt-5 sm:mt-4 flex flex-row">
        <Button plain onClick={() => setIsOpen(false)} disabled={isLoading || false}>
          Cancel
        </Button>
        <Button type="submit" color={styles.color} onClick={onConfirm} loading={isLoading || false} disabled={isLoading || false}>
          {confirmText}
        </Button>
      </AlertActions>
      {error &&  <ErrorMessage>{error}</ErrorMessage>}
    </Alert>
  );
}


export function ConfirmModal( { style, title, description, confirmText = 'Confirm', onConfirm, isOpen, setIsOpen } ) {
  style = style || 'info';
  let styles = {
    error: { color: 'red', bg: 'bg-red-100', text: 'text-red-600', icon: ExclamationTriangleIcon},
    success: {  color: 'lime', bg: 'bg-green-100', text: 'text-green-600', icon: CheckIcon },
    warning: {  color: 'amber', bg: 'bg-yellow-100', text: 'text-yellow-600', icon: ExclamationTriangleIcon },
    info: {  color: 'blue', bg: 'bg-blue-100', text: 'text-blue-600', icon: InformationCircleIcon },
  }[style];

  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <div className="flex items-start">
        <div className={clsx(
          'mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10',
          styles.bg
        )}>
          <styles.icon
            aria-hidden="true"
            className={clsx(
              'size-6',
              styles.text
            )}
          />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </div>
      </div>
      <DialogActions className="mt-5 sm:mt-4 flex flex-row">
        <Button plain onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button color={styles.color} onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function Modal( { color, title, description, strongText, buttonText, onClick, isOpen, setIsOpen } ) {
  let styles = {
    error: {
      color: 'red',
      bg: 'bg-red-100',
      text: 'text-red-600',
      icon: ExclamationTriangleIcon,
    },
    success: {
      color: 'lime',
      bg: 'bg-green-100',
      text: 'text-green-600',
      icon: CheckIcon,
    },
    warning: {
      color: 'amber',
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      icon: ExclamationTriangleIcon,
    },
    info: {
      color: 'blue',
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      icon: InformationCircleIcon,
    },
  }[color ?? 'info'];

  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <div className="flex items-start">
        <div className={clsx(
          'mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10',
          styles.bg
        )}>
          <styles.icon
            aria-hidden="true"
            className={clsx('size-6', styles.text)}
          />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="flex flex-col gap-2">
            {description}
            <Strong>{strongText}</Strong>
          </DialogDescription>
        </div>
      </div>
      <DialogActions className="mt-5 sm:mt-4 flex flex-row">
        <Button plain onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button color={styles.color} onClick={onClick}>
          {buttonText ?? 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
