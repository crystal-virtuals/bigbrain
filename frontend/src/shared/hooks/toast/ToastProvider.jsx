import { useState } from 'react';
import ToastContainer from './ToastContainer';
import ToastContext from './ToastContext';
import { Toast } from '@constants/toast';

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, description = '', options = {}) => {
    const newToast = new Toast(type, message, description, options);

    // Remove duplicates
    const duplicates = toasts.filter((toast) => Toast.isEqual(toast, newToast));
    duplicates.forEach((toast) => removeToast(toast.id));

    // Remove toasts if there are more than 5
    if (toasts.length >= 5) {
      removeToast(toasts[0].id);
    }

    // Replace last toast if options.replace is true
    if (newToast.options.replace && toasts.length > 0) {
      removeToast(toasts[toasts.length - 1].id);
    }

    // Add new toast to the list
    setToasts((prev) => [...prev, newToast]);

    // Remove toast after duration
    setTimeout(() => {
      removeToast(newToast.id);
    }, newToast.options.duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };


  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Global notification live region, render this permanently at the end of the document */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;