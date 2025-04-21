import { useState } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  XMarkIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';

const toastMap = {
  success: {
    icon: <CheckCircleIcon aria-hidden="true" className="size-5 text-green-400" />,
    bg: 'bg-green-50',
    message: 'text-green-800',
    description: 'text-green-700',
    btn: 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50',
  },
  error: {
    icon: <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />,
    bg: 'bg-red-50',
    message: 'text-red-800',
    description: 'text-red-700',
    btn: 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50',
  },
  info: {
    icon: <InformationCircleIcon aria-hidden="true" className="size-5 text-blue-400" />,
    bg: 'bg-blue-50',
    message: 'text-blue-800',
    description: 'text-blue-700',
    btn: 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50',
  },
  warning: {
    icon:  <ExclamationTriangleIcon aria-hidden="true" className="size-5 text-yellow-400" />,
    bg: 'bg-yellow-50',
    message: 'text-yellow-800',
    description: 'text-yellow-700',
    btn: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50',
  },
};

function ToastWrapper({ type, message, description, onDismiss, className }) {
  const toast = toastMap[type];
  const bgClass = 'rounded-md p-4 ' + toast.bg;
  const messageClass = 'text-sm font-medium ' + toast.message;
  const descriptionClass = 'mt-1 text-sm ' + toast.description;
  const btnClass = 'inline-flex rounded-md p-1.5 focus:ring-2 focus:ring-offset-2 focus:outline-hidden ' + toast.btn;

  return (
    <div className={clsx(bgClass, className)}>
      <div className="flex">
        <div className="shrink-0">
          {toast.icon}
        </div>
        <div className="ml-3">
          {/* message */}
          <h3 className={messageClass}>{message}</h3>
          {/* description */}
          {description && <p className={descriptionClass}>{description}</p>}
        </div>
        {/* dismiss button */}
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button type="button" onClick={onDismiss} className={btnClass}>
              <span className="sr-only">Dismiss</span>
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Toast({ type, message, description = '', onDismiss, className }) {
  const [show, setShow] = useState(true);

  const handleDismiss = () => {
    setShow(false);
    if (onDismiss) onDismiss();
  };

  return (
    <>
      {/* ToastWrapper panel, dynamically insert this into the live region when it needs to be displayed */}
      <Transition show={show}>
        <div className='pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition data-closed:opacity-0 data-enter:transform data-enter:duration-300 data-enter:ease-out data-closed:data-enter:translate-y-2 data-leave:duration-100 data-leave:ease-in data-closed:data-enter:sm:translate-x-2 data-closed:data-enter:sm:translate-y-0'>
          <ToastWrapper
            type={type}
            message={message}
            description={description}
            onDismiss={handleDismiss}
            className={className}
          />
        </div>
      </Transition>
    </>
  );
}
