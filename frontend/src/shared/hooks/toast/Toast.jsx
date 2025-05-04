import { useState } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  XMarkIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const toastIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
};

const toastStyles = {
  success: {
    icon: 'text-green-400',
    btn: 'focus:ring-2 focus:ring-green-600 focus:ring-offset-green-50 focus:outline-hidden',
  },
  error: {
    icon: 'text-red-400',
    btn: 'focus:ring-2 focus:ring-red-600 focus:ring-offset-red-50 focus:outline-hidden',
  },
  info: {
    icon: 'text-blue-400',
    btn: 'focus:ring-2 focus:ring-blue-600 focus:ring-offset-blue-50 focus:outline-hidden',
  },
  warning: {
    icon: 'text-yellow-400',
    btn: 'focus:ring-2 focus:ring-yellow-600 focus:ring-offset-yellow-50 focus:outline-hidden',
  },
};

function ToastWrapper({ type, message, description, show, onDismiss }) {
  const Icon = toastIcons[type];
  if (!show) return null;
  return (
    <>
      <div className="p-4">
        <div className="flex items-start">
          <div className="shrink-0">
            <Icon
              aria-hidden="true"
              className={clsx('size-6', toastStyles[type].icon)}
            />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{message}</p>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
          <div className="ml-4 flex shrink-0">
            <button
              type="button"
              onClick={onDismiss}
              className={clsx(
                'inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500',
                toastStyles[type].btn
              )}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Toast({ type, message, description, onDismiss }) {
  const [show, setShow] = useState(true);

  const handleDismiss = () => {
    setShow(false);
    if (onDismiss) onDismiss();
  };

  return (
    <>
      {/* ToastWrapper panel, dynamically insert this into the live region when it needs to be displayed */}
      <Transition show={show}>
        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition data-closed:opacity-0 data-enter:transform data-enter:duration-300 data-enter:ease-out data-closed:data-enter:translate-y-2 data-leave:duration-100 data-leave:ease-in data-closed:data-enter:sm:translate-x-2 data-closed:data-enter:sm:translate-y-0">
          <ToastWrapper
            type={type}
            message={message}
            description={description}
            show={show}
            onDismiss={handleDismiss}
          />
        </div>
      </Transition>
    </>
  );
}
