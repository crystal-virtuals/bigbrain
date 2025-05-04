import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
};

const styles = {
  success: {
    bg: 'bg-green-50',
    title: 'text-green-800',
    description: 'text-green-700',
    icon: 'text-green-400',
    btn: 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50',
  },
  error: {
    bg: 'bg-red-50',
    title: 'text-red-800',
    description: 'text-red-700',
    icon: 'text-red-400',
    btn: 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50',
  },
  info: {
    bg: 'bg-blue-50',
    title: 'text-blue-800',
    description: 'text-blue-700',
    icon: 'text-blue-400',
    btn: 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50',
  },
  warning: {
    bg: 'bg-yellow-50',
    title: 'text-yellow-800',
    description: 'text-yellow-700',
    icon: 'text-yellow-400',
    btn: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50',
  },
};

/***************************************************************
                       Dismissible Notification
***************************************************************/
export function Notification({ type, className, children, ...props }) {
  const { title, onDismiss } = props;
  const Icon = icons[type];

  return (
    <div className={clsx('p-4 rounded-md', styles[type].bg, className)}>
      <div className="flex">
        {/* icon */}
        <div className="shrink-0">
          <Icon
            aria-hidden="true"
            className={clsx('size-5', styles[type].icon)}
          />
        </div>
        {/* body */}
        <div className="ml-3 text-left text-sm">
          <h3 className={clsx('font-medium', styles[type].title)}>{title}</h3>
          <div className={clsx('mt-2', styles[type].description)}>
            {children}
          </div>
        </div>
        {/* dismiss button */}
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={clsx(
                  'inline-flex rounded-md p-1.5 focus:ring-2 focus:ring-offset-2 focus:outline-hidden',
                  styles[type].btn
                )}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
